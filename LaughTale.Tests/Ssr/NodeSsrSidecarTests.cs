using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Ssr;
using Xunit;

namespace LaughTale.Tests.Ssr;

/// <summary>
/// Drives <see cref="NodeSsrSidecar"/> against real <c>node</c> processes running tiny fixture
/// scripts written to a temp directory. Every wait is a condition with a deadline, not a fixed sleep.
/// </summary>
public class NodeSsrSidecarTests : IDisposable
{
    private static readonly TimeSpan Deadline = TimeSpan.FromSeconds(15);

    // Shared protocol plumbing prepended to every fixture.
    private const string Prelude = """
        import readline from 'node:readline';
        const send = (m) => process.stdout.write(JSON.stringify(m) + '\n');
        const ok = (id, html) => send({ type: 'result', id, ok: true, html });
        const fail = (id, error) => send({ type: 'result', id, ok: false, error });
        const rl = readline.createInterface({ input: process.stdin });
        rl.on('close', () => process.exit(0));

        """;

    private const string StandardFixture = Prelude + """
        const batch = [];
        rl.on('line', (line) => {
          const m = JSON.parse(line);
          switch (m.island) {
            case 'hello': ok(m.id, `<p>Hello ${m.props?.name ?? 'anon'}</p>`); break;
            case 'err': fail(m.id, 'boom'); break;
            case 'slow': setTimeout(() => { ok(m.id, '<p>late</p>'); console.error('late-sent'); }, m.props.delay); break;
            case 'crash': process.exit(3); break;
            case 'batch':
              batch.push(m);
              if (batch.length === m.props.size) {
                for (const b of batch.reverse()) ok(b.id, `item-${b.props.n}`);
                batch.length = 0;
              }
              break;
          }
        });
        send({ type: 'ready', components: { hello: 'react', err: 'react', slow: 'react', crash: 'react', batch: 'preact' } });
        """;

    private readonly string _dir = Path.Combine(Path.GetTempPath(), "lt-ssr-tests-" + Guid.NewGuid().ToString("N"));
    private readonly ListLogger<NodeSsrSidecar> _logger = new();

    public NodeSsrSidecarTests()
    {
        Directory.CreateDirectory(_dir);
    }

    public void Dispose()
    {
        try
        {
            Directory.Delete(_dir, recursive: true);
        }
        catch (IOException)
        {
        }
        catch (UnauthorizedAccessException)
        {
        }
    }

    private string WriteFixture(string source)
    {
        var path = Path.Combine(_dir, Guid.NewGuid().ToString("N") + ".mjs");
        File.WriteAllText(path, source);
        return path;
    }

    private NodeSsrSidecar CreateSidecar(string fixtureSource, Action<SsrSidecarOptions>? configure = null)
    {
        var options = new SsrSidecarOptions
        {
            Enabled = true,
            ServerBundlePath = WriteFixture(fixtureSource),
            RenderTimeout = TimeSpan.FromSeconds(5),
            StartupTimeout = TimeSpan.FromSeconds(10),
            RestartBackoffInitial = TimeSpan.FromMilliseconds(50),
            RestartBackoffMax = TimeSpan.FromMilliseconds(200),
            ShutdownGracePeriod = TimeSpan.FromMilliseconds(500)
        };
        configure?.Invoke(options);
        return new NodeSsrSidecar(options, _logger);
    }

    private static async Task<NodeSsrSidecar> StartReadyAsync(NodeSsrSidecar sidecar)
    {
        await sidecar.StartAsync(CancellationToken.None);
        await WaitUntilAsync(() => sidecar.IsReady, "sidecar ready");
        return sidecar;
    }

    private static async Task WaitUntilAsync(Func<bool> condition, string what)
    {
        var sw = Stopwatch.StartNew();
        while (!condition())
        {
            if (sw.Elapsed > Deadline)
            {
                throw new TimeoutException($"Timed out waiting for: {what}");
            }

            await Task.Delay(20);
        }
    }

    [Fact]
    public async Task ReadyHandshake_ThenRender_ReturnsHtml()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            Assert.True(sidecar.CanRender("hello"));

            var result = await sidecar.RenderAsync("hello", "{\"name\":\"Ada\"}");

            Assert.True(result.Success, result.Error);
            Assert.Equal("<p>Hello Ada</p>", result.Html);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task Render_NullAndMultiLineProps_AreSentAsSingleProtocolLine()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            var withNull = await sidecar.RenderAsync("hello", null);
            var multiLine = await sidecar.RenderAsync("hello", "{\n  \"name\": \"Grace\"\n}");

            Assert.Equal("<p>Hello anon</p>", withNull.Html);
            Assert.Equal("<p>Hello Grace</p>", multiLine.Html);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task Render_ErrorResult_ReturnsRenderErrorFailure()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            var result = await sidecar.RenderAsync("err", "{}");

            Assert.False(result.Success);
            Assert.Equal(SsrRenderFailure.RenderError, result.Failure);
            Assert.Equal("boom", result.Error);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task UnknownIsland_CanRenderFalse_AndRenderFailsWithoutSending()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            Assert.False(sidecar.CanRender("not-in-bundle"));

            var result = await sidecar.RenderAsync("not-in-bundle", "{}");

            Assert.Equal(SsrRenderFailure.UnknownIsland, result.Failure);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task ConcurrentRenders_RepliedInReverseOrder_AreCorrelatedById()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            const int size = 8;
            var tasks = Enumerable.Range(0, size)
                .Select(n => sidecar.RenderAsync("batch", $"{{\"n\":{n},\"size\":{size}}}"))
                .ToArray();

            var results = await Task.WhenAll(tasks);

            for (var n = 0; n < size; n++)
            {
                Assert.True(results[n].Success, results[n].Error);
                Assert.Equal($"item-{n}", results[n].Html);
            }
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task RenderTimeout_FailsQuickly_AndLateResultIsIgnored()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture, o => o.RenderTimeout = TimeSpan.FromMilliseconds(200)));
        try
        {
            var sw = Stopwatch.StartNew();
            var timedOut = await sidecar.RenderAsync("slow", "{\"delay\":3000}");
            sw.Stop();
            var lateAlreadySent = _logger.Messages.Any(m => m.Contains("late-sent"));

            Assert.Equal(SsrRenderFailure.Timeout, timedOut.Failure);
            Assert.False(lateAlreadySent, $"timeout only fired after the late reply ({sw.Elapsed})");
            Assert.True(sw.Elapsed < TimeSpan.FromMilliseconds(2800), $"timeout took {sw.Elapsed}");

            // Wait until the fixture has actually written the late result, then prove the reader survived it.
            await WaitUntilAsync(() => _logger.Messages.Any(m => m.Contains("late-sent")), "late result emitted");

            // Retried because the deliberately tiny 200ms budget can also expire under a loaded test run.
            SsrRenderResult after = SsrRenderResult.Fail(SsrRenderFailure.NotReady);
            for (var attempt = 0; attempt < 10 && !after.Success; attempt++)
            {
                after = await sidecar.RenderAsync("hello", "{\"name\":\"after\"}");
            }

            Assert.True(sidecar.IsReady);
            Assert.Equal("<p>Hello after</p>", after.Html);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task ChildCrash_FailsPending_RestartsAndRendersAgain()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            var firstPid = sidecar.ProcessId;
            var pending = sidecar.RenderAsync("slow", "{\"delay\":4000}");
            var crash = await sidecar.RenderAsync("crash", "{}");
            var pendingResult = await pending;

            Assert.Equal(SsrRenderFailure.ProcessExited, crash.Failure);
            Assert.Equal(SsrRenderFailure.ProcessExited, pendingResult.Failure);

            await WaitUntilAsync(() => sidecar.IsReady && sidecar.ProcessId != firstPid, "restarted child ready");
            var result = await sidecar.RenderAsync("hello", "{\"name\":\"again\"}");

            Assert.Equal("<p>Hello again</p>", result.Html);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task GarbageStdoutAndStderrNoise_AreIgnored()
    {
        const string fixture = Prelude + """
            process.stdout.write('this is not json\n');
            process.stdout.write('[1,2,3]\n');
            process.stdout.write('{"type":"mystery"}\n');
            process.stdout.write('{"type":"result","id":"nope","ok":true}\n');
            process.stdout.write('{"type":"result","id":424242,"ok":true,"html":"stray"}\n');
            process.stdout.write('{"no":"type"}\n\n');
            console.error('warming up... some noise on stderr');
            rl.on('line', (line) => {
              const m = JSON.parse(line);
              process.stdout.write('{broken json\n');
              console.error('rendering', m.island);
              ok(m.id, '<i>fine</i>');
            });
            send({ type: 'ready', components: { hello: 'vue' } });
            """;

        var sidecar = await StartReadyAsync(CreateSidecar(fixture));
        try
        {
            var first = await sidecar.RenderAsync("hello", "{}");
            var second = await sidecar.RenderAsync("hello", "{}");

            Assert.Equal("<i>fine</i>", first.Html);
            Assert.Equal("<i>fine</i>", second.Html);
            Assert.True(sidecar.IsReady);
            await WaitUntilAsync(() => _logger.Messages.Any(m => m.Contains("some noise on stderr")), "stderr forwarded to logger");
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task MissingNodeExecutable_NoException_NeverReady_FailsOpen()
    {
        var sidecar = CreateSidecar(StandardFixture, o => o.NodePath = Path.Combine(_dir, "definitely-not-node-" + Guid.NewGuid().ToString("N")));
        try
        {
            await sidecar.StartAsync(CancellationToken.None);
            await WaitUntilAsync(() => _logger.Entries.Count(e => e.Level == LogLevel.Warning && e.Message.Contains("Could not start")) >= 2, "spawn failure warnings (with retry)");

            Assert.False(sidecar.IsReady);
            Assert.False(sidecar.CanRender("hello"));
            var result = await sidecar.RenderAsync("hello", "{}");
            Assert.Equal(SsrRenderFailure.NotReady, result.Failure);
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    [Fact]
    public async Task StopAsync_ClosesStdin_ChildExits()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        var pid = sidecar.ProcessId!.Value;

        await sidecar.StopAsync(CancellationToken.None);

        Assert.False(sidecar.IsReady);
        Assert.True(await HasExitedAsync(pid));
        Assert.Equal(SsrRenderFailure.NotReady, (await sidecar.RenderAsync("hello", "{}")).Failure);
    }

    [Fact]
    public async Task StopAsync_ChildIgnoringStdinClose_IsKilledAfterGracePeriod()
    {
        const string fixture = """
            process.stdin.resume();
            process.stdin.on('end', () => {}); // ignore the shutdown signal
            setInterval(() => {}, 1000);
            process.stdout.write(JSON.stringify({ type: 'ready', components: {} }) + '\n');
            """;

        var sidecar = await StartReadyAsync(CreateSidecar(fixture, o => o.ShutdownGracePeriod = TimeSpan.FromMilliseconds(200)));
        var pid = sidecar.ProcessId!.Value;

        await sidecar.StopAsync(CancellationToken.None);

        Assert.True(await HasExitedAsync(pid));
    }

    [Fact]
    public async Task EndToEnd_IslandTagHelper_EmbedsNodeRenderedHtml()
    {
        var sidecar = await StartReadyAsync(CreateSidecar(StandardFixture));
        try
        {
            var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
            Microsoft.Extensions.DependencyInjection.LoggingServiceCollectionExtensions.AddLogging(services);
            LaughTale.Core.Extensions.ServiceCollectionExtensions.AddLaughTale(services, o => o.Refresh.AllowUndeclaredIslands = true);
            Microsoft.Extensions.DependencyInjection.ServiceCollectionServiceExtensions.AddSingleton<ISsrRenderer>(services, sidecar);
            LaughTale.Core.Extensions.ServiceCollectionExtensions.AddLaughTalePlugin(services, new SsrSidecarPlugin());
            var provider = Microsoft.Extensions.DependencyInjection.ServiceCollectionContainerBuilderExtensions.BuildServiceProvider(services);

            var tagHelper = new LaughTale.Core.TagHelpers.IslandTagHelper
            {
                ViewContext = new Microsoft.AspNetCore.Mvc.Rendering.ViewContext
                {
                    HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { RequestServices = provider },
                    ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(
                        new Microsoft.AspNetCore.Mvc.ModelBinding.EmptyModelMetadataProvider(),
                        new Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary())
                },
                Name = "hello",
                Props = new { name = "Node" },
                Framework = LaughTale.Core.Enums.IslandFramework.React
            };
            var context = new Microsoft.AspNetCore.Razor.TagHelpers.TagHelperContext(
                new Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttributeList(),
                new System.Collections.Generic.Dictionary<object, object>(),
                "e2e");
            var output = new Microsoft.AspNetCore.Razor.TagHelpers.TagHelperOutput(
                "island",
                new Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttributeList(),
                (_, _) => Task.FromResult<Microsoft.AspNetCore.Razor.TagHelpers.TagHelperContent>(new Microsoft.AspNetCore.Razor.TagHelpers.DefaultTagHelperContent()));

            await tagHelper.ProcessAsync(context, output);

            Assert.Equal("<p>Hello Node</p>", output.Content.GetContent());
            Assert.Equal("true", output.Attributes["data-lt-ssr"].Value.ToString());
        }
        finally
        {
            await sidecar.StopAsync(CancellationToken.None);
        }
    }

    private static async Task<bool> HasExitedAsync(int pid)
    {
        try
        {
            using var process = Process.GetProcessById(pid);
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            await process.WaitForExitAsync(cts.Token);
            return true;
        }
        catch (OperationCanceledException)
        {
            return false;
        }
        catch (ArgumentException)
        {
            return true; // no longer running
        }
        catch (InvalidOperationException)
        {
            return true;
        }
    }

    internal sealed class ListLogger<T> : ILogger<T>
    {
        public ConcurrentQueue<(LogLevel Level, string Message)> Entries { get; } = new();

        public System.Collections.Generic.IEnumerable<string> Messages => Entries.Select(e => e.Message);

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            Entries.Enqueue((logLevel, formatter(state, exception)));
        }
    }
}
