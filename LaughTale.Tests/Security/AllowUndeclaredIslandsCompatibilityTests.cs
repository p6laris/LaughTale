using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LaughTale.Core.Configuration;
using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;

namespace LaughTale.Tests.Security;

public class AllowUndeclaredIslandsCompatibilityTests
{
    private class TestLogMessage
    {
        public LogLevel LogLevel { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    private class TestLogger : ILogger
    {
        private readonly List<TestLogMessage> _logs;

        public TestLogger(List<TestLogMessage> logs)
        {
            _logs = logs;
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            lock (_logs)
            {
                _logs.Add(new TestLogMessage
                {
                    LogLevel = logLevel,
                    Message = formatter(state, exception)
                });
            }
        }
    }

    private class TestLoggerProvider : ILoggerProvider
    {
        private readonly List<TestLogMessage> _logs;

        public TestLoggerProvider(List<TestLogMessage> logs)
        {
            _logs = logs;
        }

        public ILogger CreateLogger(string categoryName) => new TestLogger(_logs);
        public void Dispose() { }
    }

    private class SimpleEndpointRouteBuilder : IEndpointRouteBuilder
    {
        public SimpleEndpointRouteBuilder(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider;
        }

        public IServiceProvider ServiceProvider { get; }
        public ICollection<EndpointDataSource> DataSources { get; } = new List<EndpointDataSource>();
        public IApplicationBuilder CreateApplicationBuilder() => new ApplicationBuilder(ServiceProvider);
    }

    private async Task<(int StatusCode, string Body)> ExecuteRefreshAsync(
        string islandName,
        string payloadJson,
        IServiceProvider provider)
    {
        var routeBuilder = new SimpleEndpointRouteBuilder(provider);
        routeBuilder.MapLaughTaleIslandRefresh("/_laughtale/island/{name}");

        var endpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .First();

        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = $"/_laughtale/island/{islandName}";
        context.Request.RouteValues["name"] = islandName;
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(payloadJson));
        context.Request.ContentLength = Encoding.UTF8.GetByteCount(payloadJson);
        context.Response.Body = new MemoryStream();
        context.User = new ClaimsPrincipal(new ClaimsIdentity());

        await endpoint.RequestDelegate!(context);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var body = await reader.ReadToEndAsync();

        return (context.Response.StatusCode, body);
    }

    [Fact]
    public async Task AllowUndeclaredIslands_Returns200_OnUndeclaredIsland()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddRouting();
        services.AddAntiforgery();
        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            options.Refresh.AllowUndeclaredIslands = true;
        });

        var provider = services.BuildServiceProvider();
        var (status, body) = await ExecuteRefreshAsync("legacy-island", "{}", provider);

        Assert.Equal(200, status);
        Assert.Contains("data-island=\"legacy-island\"", body);
    }

    [Fact]
    public async Task AllowUndeclaredIslands_LogsWarning_OnlyOnceAcrossRepeatedRequests()
    {
        var logs = new List<TestLogMessage>();
        var services = new ServiceCollection();
        services.AddLogging(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Warning);
            builder.AddProvider(new TestLoggerProvider(logs));
        });
        services.AddOptions();
        services.AddRouting();
        services.AddAntiforgery();
        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            options.Refresh.AllowUndeclaredIslands = true;
        });

        var provider = services.BuildServiceProvider();

        // 50 consecutive requests for the same undeclared island (T033)
        for (int i = 0; i < 50; i++)
        {
            var (status, _) = await ExecuteRefreshAsync("dedup-50-island", "{}", provider);
            Assert.Equal(200, status);
        }

        // Verify that the warning was logged exactly once across all 50 requests (deduplication)
        var warningLogs = logs
            .Where(l => l.LogLevel == LogLevel.Warning && l.Message.Contains("dedup-50-island"))
            .ToList();

        Assert.Single(warningLogs);
        Assert.Contains("AllowUndeclaredIslands", warningLogs[0].Message);
    }
}
