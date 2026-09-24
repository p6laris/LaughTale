using System;
using System.Buffers;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace LaughTale.Core.Ssr;

/// <summary>
/// Supervises a Node child process running the app's server bundle and talks to it over
/// newline-delimited JSON on stdin/stdout (no network ports). Fail-open by design: a missing Node,
/// a crashed or slow child, or a render error all surface as a failed <see cref="SsrRenderResult"/>,
/// never as an exception. The child is restarted with capped exponential backoff.
/// </summary>
public sealed class NodeSsrSidecar : ISsrRenderer, IHostedService, IDisposable
{
    private static readonly UTF8Encoding Utf8NoBom = new(encoderShouldEmitUTF8Identifier: false);

    private readonly SsrSidecarOptions _options;
    private readonly ILogger<NodeSsrSidecar> _logger;
    private readonly CancellationTokenSource _stopCts = new();
    private Session? _current;
    private Task? _supervisor;
    private int _nextId;

    public NodeSsrSidecar(SsrSidecarOptions options, ILogger<NodeSsrSidecar>? logger = null)
    {
        _options = options ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? NullLogger<NodeSsrSidecar>.Instance;
    }

    public bool IsReady => Volatile.Read(ref _current)?.IsReady == true;

    /// <summary>The current child's process id, or null when no child is running. Diagnostics only.</summary>
    public int? ProcessId
    {
        get
        {
            var session = Volatile.Read(ref _current);
            try
            {
                return session?.Process.Id;
            }
            catch (InvalidOperationException)
            {
                return null;
            }
        }
    }

    public bool CanRender(string islandName)
    {
        var session = Volatile.Read(ref _current);
        return session is not null && session.IsReady && session.Components!.ContainsKey(islandName);
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Deliberately not awaiting readiness: app startup must never block on (or fail because of) Node.
        if (_supervisor is null && !_stopCts.IsCancellationRequested)
        {
            _supervisor = Task.Run(() => SuperviseAsync(_stopCts.Token));
        }

        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        _stopCts.Cancel();
        var supervisor = _supervisor;
        if (supervisor is null)
        {
            return;
        }

        try
        {
            await supervisor.WaitAsync(cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException)
        {
            // Host shutdown budget exhausted before the graceful path finished.
            Volatile.Read(ref _current)?.Kill();
        }
    }

    public void Dispose()
    {
        _stopCts.Cancel();
        Volatile.Read(ref _current)?.Kill();
    }

    public async Task<SsrRenderResult> RenderAsync(string islandName, string? propsJson, CancellationToken cancellationToken = default)
    {
        var session = Volatile.Read(ref _current);
        if (session is null || !session.IsReady)
        {
            return SsrRenderResult.Fail(SsrRenderFailure.NotReady);
        }

        if (!session.Components!.ContainsKey(islandName))
        {
            return SsrRenderResult.Fail(SsrRenderFailure.UnknownIsland);
        }

        var id = Interlocked.Increment(ref _nextId);
        string message;
        try
        {
            message = BuildRenderMessage(id, islandName, propsJson);
        }
        catch (Exception ex) when (ex is JsonException or ArgumentException or InvalidOperationException)
        {
            return SsrRenderResult.Fail(SsrRenderFailure.InvalidProps, ex.Message);
        }

        var tcs = new TaskCompletionSource<SsrRenderResult>(TaskCreationOptions.RunContinuationsAsynchronously);
        session.Pending[id] = tcs;
        if (session.IsClosed)
        {
            // The session died between the readiness check and registration; its fail-all sweep may have missed us.
            session.Pending.TryRemove(id, out _);
            return SsrRenderResult.Fail(SsrRenderFailure.ProcessExited);
        }

        using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeoutCts.CancelAfter(_options.RenderTimeout);
        try
        {
            if (!await session.WriteLineAsync(message, timeoutCts.Token).ConfigureAwait(false))
            {
                session.Pending.TryRemove(id, out _);
                return SsrRenderResult.Fail(SsrRenderFailure.WriteFailed);
            }

            return await tcs.Task.WaitAsync(timeoutCts.Token).ConfigureAwait(false);
        }
        catch (OperationCanceledException)
        {
            // A result arriving after this point finds no pending entry and is dropped by the reader.
            session.Pending.TryRemove(id, out _);
            return cancellationToken.IsCancellationRequested
                ? SsrRenderResult.Fail(SsrRenderFailure.Canceled)
                : SsrRenderResult.Fail(SsrRenderFailure.Timeout);
        }
    }

    private static string BuildRenderMessage(int id, string islandName, string? propsJson)
    {
        var buffer = new ArrayBufferWriter<byte>(256 + (propsJson?.Length ?? 0));
        using (var writer = new Utf8JsonWriter(buffer))
        {
            writer.WriteStartObject();
            writer.WriteString("type", "render");
            writer.WriteNumber("id", id);
            writer.WriteString("island", islandName);
            writer.WritePropertyName("props");
            if (propsJson is null)
            {
                writer.WriteNullValue();
            }
            else if (propsJson.AsSpan().IndexOfAny('\r', '\n') < 0)
            {
                writer.WriteRawValue(propsJson); // validates
            }
            else
            {
                // Insignificant whitespace newlines would split the message across protocol lines.
                using var doc = JsonDocument.Parse(propsJson);
                doc.RootElement.WriteTo(writer);
            }

            writer.WriteEndObject();
        }

        return Encoding.UTF8.GetString(buffer.WrittenSpan);
    }

    private async Task SuperviseAsync(CancellationToken stop)
    {
        var backoff = _options.RestartBackoffInitial;
        var stopTask = Task.Delay(Timeout.Infinite, stop);

        while (!stop.IsCancellationRequested)
        {
            var session = TryStartSession();
            if (session is not null)
            {
                Volatile.Write(ref _current, session);
                try
                {
                    await RunSessionAsync(session, stopTask).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "[LaughTale SSR] Sidecar supervisor error.");
                }
                finally
                {
                    Interlocked.CompareExchange(ref _current, null, session);
                    if (stop.IsCancellationRequested)
                    {
                        await session.ShutdownAsync(_options.ShutdownGracePeriod).ConfigureAwait(false);
                    }
                    else
                    {
                        session.Kill();
                    }

                    session.Close();
                    await session.DisposeAsync().ConfigureAwait(false);
                }

                if (session.ReadyAt is long readyAt && Stopwatch.GetElapsedTime(readyAt) >= _options.RestartBackoffResetAfter)
                {
                    backoff = _options.RestartBackoffInitial;
                }
            }

            if (stop.IsCancellationRequested)
            {
                break;
            }

            try
            {
                await Task.Delay(backoff, stop).ConfigureAwait(false);
            }
            catch (OperationCanceledException)
            {
                break;
            }

            var next = TimeSpan.FromTicks(Math.Max(backoff.Ticks, 1) * 2);
            backoff = next > _options.RestartBackoffMax ? _options.RestartBackoffMax : next;
        }
    }

    private Session? TryStartSession()
    {
        var workingDirectory = string.IsNullOrWhiteSpace(_options.WorkingDirectory)
            ? Directory.GetCurrentDirectory()
            : Path.GetFullPath(_options.WorkingDirectory);

        if (string.IsNullOrWhiteSpace(_options.ServerBundlePath))
        {
            _logger.LogWarning("[LaughTale SSR] ServerBundlePath is not configured; islands render without SSR.");
            return null;
        }

        var bundlePath = Path.GetFullPath(_options.ServerBundlePath, workingDirectory);
        if (!File.Exists(bundlePath))
        {
            _logger.LogWarning("[LaughTale SSR] Server bundle '{BundlePath}' not found; islands render without SSR. Retrying.", bundlePath);
            return null;
        }

        var startInfo = new ProcessStartInfo
        {
            FileName = _options.NodePath,
            WorkingDirectory = workingDirectory,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardInput = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardInputEncoding = Utf8NoBom,
            StandardOutputEncoding = Utf8NoBom,
            StandardErrorEncoding = Utf8NoBom
        };
        startInfo.ArgumentList.Add(bundlePath);

        Process? process = null;
        try
        {
            process = Process.Start(startInfo);
        }
        catch (Exception ex) when (ex is Win32Exception or InvalidOperationException or IOException or UnauthorizedAccessException)
        {
            _logger.LogWarning(
                "[LaughTale SSR] Could not start '{NodePath}' ({Reason}). Is Node installed and on PATH? Islands render without SSR. Retrying.",
                _options.NodePath,
                ex.Message);
            process?.Dispose();
            return null;
        }

        if (process is null)
        {
            _logger.LogWarning("[LaughTale SSR] Could not start '{NodePath}'. Retrying.", _options.NodePath);
            return null;
        }

        var session = new Session(process);
        session.StdoutTask = Task.Run(() => ReadStdoutAsync(session));
        session.StderrTask = Task.Run(() => ReadStderrAsync(session));
        _logger.LogDebug("[LaughTale SSR] Started sidecar pid {Pid}: {NodePath} {BundlePath}", process.Id, _options.NodePath, bundlePath);
        return session;
    }

    private async Task RunSessionAsync(Session session, Task stopTask)
    {
        var exited = Task.WhenAny(session.StdoutTask!, session.Process.WaitForExitAsync());
        var startupTimeout = Task.Delay(_options.StartupTimeout);

        await Task.WhenAny(session.Ready, exited, startupTimeout, stopTask).ConfigureAwait(false);
        if (stopTask.IsCompleted)
        {
            return;
        }

        if (!session.Ready.IsCompleted)
        {
            if (exited.IsCompleted)
            {
                _logger.LogWarning("[LaughTale SSR] Sidecar exited before becoming ready (exit code {ExitCode}).", session.TryGetExitCode());
            }
            else
            {
                _logger.LogWarning("[LaughTale SSR] Sidecar did not send 'ready' within {Timeout}; restarting.", _options.StartupTimeout);
            }

            return;
        }

        _logger.LogInformation("[LaughTale SSR] Sidecar ready with {Count} component(s).", session.Components!.Count);

        await Task.WhenAny(exited, stopTask).ConfigureAwait(false);
        if (!stopTask.IsCompleted)
        {
            _logger.LogWarning("[LaughTale SSR] Sidecar exited unexpectedly (exit code {ExitCode}); restarting.", session.TryGetExitCode());
        }
    }

    private async Task ReadStdoutAsync(Session session)
    {
        try
        {
            var reader = session.Process.StandardOutput;
            while (await reader.ReadLineAsync().ConfigureAwait(false) is { } line)
            {
                HandleLine(session, line);
            }
        }
        catch (Exception ex) when (ex is IOException or ObjectDisposedException or InvalidOperationException)
        {
            _logger.LogDebug(ex, "[LaughTale SSR] Sidecar stdout closed.");
        }
        finally
        {
            session.Close();
        }
    }

    private async Task ReadStderrAsync(Session session)
    {
        try
        {
            var reader = session.Process.StandardError;
            while (await reader.ReadLineAsync().ConfigureAwait(false) is { } line)
            {
                if (line.Length > 0)
                {
                    _logger.LogInformation("[LaughTale SSR] {Line}", line);
                }
            }
        }
        catch (Exception ex) when (ex is IOException or ObjectDisposedException or InvalidOperationException)
        {
            _logger.LogDebug(ex, "[LaughTale SSR] Sidecar stderr closed.");
        }
    }

    private void HandleLine(Session session, string line)
    {
        if (string.IsNullOrWhiteSpace(line))
        {
            return;
        }

        try
        {
            using var doc = JsonDocument.Parse(line);
            var root = doc.RootElement;
            if (root.ValueKind != JsonValueKind.Object
                || !root.TryGetProperty("type", out var type)
                || type.ValueKind != JsonValueKind.String)
            {
                LogIgnored(line);
                return;
            }

            switch (type.GetString())
            {
                case "ready":
                    var components = new Dictionary<string, string>(StringComparer.Ordinal);
                    if (root.TryGetProperty("components", out var map) && map.ValueKind == JsonValueKind.Object)
                    {
                        foreach (var entry in map.EnumerateObject())
                        {
                            components[entry.Name] = entry.Value.ValueKind == JsonValueKind.String ? entry.Value.GetString()! : string.Empty;
                        }
                    }

                    session.MarkReady(components);
                    break;

                case "result":
                    if (!root.TryGetProperty("id", out var idElement)
                        || idElement.ValueKind != JsonValueKind.Number
                        || !idElement.TryGetInt32(out var id)
                        || !root.TryGetProperty("ok", out var okElement)
                        || okElement.ValueKind is not (JsonValueKind.True or JsonValueKind.False))
                    {
                        LogIgnored(line);
                        return;
                    }

                    if (!session.Pending.TryRemove(id, out var tcs))
                    {
                        _logger.LogDebug("[LaughTale SSR] Dropping result for unknown or timed-out request {Id}.", id);
                        return;
                    }

                    if (okElement.GetBoolean())
                    {
                        var html = root.TryGetProperty("html", out var htmlElement) && htmlElement.ValueKind == JsonValueKind.String
                            ? htmlElement.GetString()!
                            : string.Empty;
                        tcs.TrySetResult(SsrRenderResult.Ok(html));
                    }
                    else
                    {
                        var error = root.TryGetProperty("error", out var errorElement) && errorElement.ValueKind == JsonValueKind.String
                            ? errorElement.GetString()
                            : null;
                        tcs.TrySetResult(SsrRenderResult.Fail(SsrRenderFailure.RenderError, error));
                    }

                    break;

                default:
                    LogIgnored(line);
                    break;
            }
        }
        catch (Exception ex) when (ex is JsonException or InvalidOperationException or FormatException)
        {
            LogIgnored(line);
        }
    }

    private void LogIgnored(string line)
    {
        if (_logger.IsEnabled(LogLevel.Debug))
        {
            _logger.LogDebug("[LaughTale SSR] Ignoring non-protocol stdout line: {Line}", line.Length > 200 ? line[..200] + "..." : line);
        }
    }

    private sealed class Session : IAsyncDisposable
    {
        private readonly SemaphoreSlim _writeLock = new(1, 1);
        private readonly TaskCompletionSource _ready = new(TaskCreationOptions.RunContinuationsAsynchronously);
        private volatile IReadOnlyDictionary<string, string>? _components;
        private volatile bool _closed;
        private long _readyAt;

        public Session(Process process) => Process = process;

        public Process Process { get; }

        public ConcurrentDictionary<int, TaskCompletionSource<SsrRenderResult>> Pending { get; } = new();

        public Task? StdoutTask { get; set; }

        public Task? StderrTask { get; set; }

        public Task Ready => _ready.Task;

        public IReadOnlyDictionary<string, string>? Components => _components;

        public bool IsClosed => _closed;

        public bool IsReady => _components is not null && !_closed;

        public long? ReadyAt => Interlocked.Read(ref _readyAt) is var t && t != 0 ? t : null;

        public void MarkReady(IReadOnlyDictionary<string, string> components)
        {
            _components = components;
            Interlocked.CompareExchange(ref _readyAt, Stopwatch.GetTimestamp(), 0);
            _ready.TrySetResult();
        }

        public void Close()
        {
            _closed = true;
            foreach (var id in Pending.Keys)
            {
                if (Pending.TryRemove(id, out var tcs))
                {
                    tcs.TrySetResult(SsrRenderResult.Fail(SsrRenderFailure.ProcessExited));
                }
            }
        }

        public async Task<bool> WriteLineAsync(string line, CancellationToken cancellationToken)
        {
            await _writeLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            // The write itself is never cancelled mid-line (that would corrupt the stream framing); the
            // caller merely stops waiting and the lock is released when the write completes.
            return await WriteCoreAsync(line).WaitAsync(cancellationToken).ConfigureAwait(false);
        }

        private async Task<bool> WriteCoreAsync(string line)
        {
            try
            {
                if (_closed)
                {
                    return false;
                }

                var stdin = Process.StandardInput;
                await stdin.WriteAsync(line).ConfigureAwait(false);
                await stdin.WriteAsync('\n').ConfigureAwait(false);
                await stdin.FlushAsync().ConfigureAwait(false);
                return true;
            }
            catch (Exception ex) when (ex is IOException or ObjectDisposedException or InvalidOperationException)
            {
                return false;
            }
            finally
            {
                _writeLock.Release();
            }
        }

        public int? TryGetExitCode()
        {
            try
            {
                return Process.HasExited ? Process.ExitCode : null;
            }
            catch (InvalidOperationException)
            {
                return null;
            }
        }

        public async Task ShutdownAsync(TimeSpan gracePeriod)
        {
            try
            {
                // Closing stdin is the protocol's shutdown signal.
                Process.StandardInput.Close();
            }
            catch (Exception ex) when (ex is IOException or ObjectDisposedException or InvalidOperationException)
            {
            }

            try
            {
                await Process.WaitForExitAsync().WaitAsync(gracePeriod).ConfigureAwait(false);
            }
            catch (Exception ex) when (ex is TimeoutException or InvalidOperationException)
            {
            }

            Kill();
        }

        public void Kill()
        {
            try
            {
                if (!Process.HasExited)
                {
                    Process.Kill(entireProcessTree: true);
                }
            }
            catch (Exception ex) when (ex is InvalidOperationException or Win32Exception or NotSupportedException)
            {
            }
        }

        public async ValueTask DisposeAsync()
        {
            try
            {
                var readers = Task.WhenAll(StdoutTask ?? Task.CompletedTask, StderrTask ?? Task.CompletedTask);
                await readers.WaitAsync(TimeSpan.FromSeconds(2)).ConfigureAwait(false);
            }
            catch (Exception)
            {
                // Best effort; the process handle is released regardless.
            }

            Process.Dispose();
        }
    }
}
