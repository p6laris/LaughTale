using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Enums;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Diagnostics;

public class DiagnosticLoggingTests
{
    private class TestLogger<T> : ILogger<T>
    {
        public List<string> LoggedMessages { get; } = new();

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            LoggedMessages.Add(formatter(state, exception));
        }
    }

    [Fact]
    public async Task IslandTagHelper_EmitsStructuredLog_WithPropsPayloadSize()
    {
        var logger = new TestLogger<IslandTagHelper>();
        var tagHelper = new IslandTagHelper(logger)
        {
            Name = "analytics-widget",
            Hydrate = HydrateStrategy.Visible,
            Props = new { userId = 42, role = "admin" }
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            "island",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        await tagHelper.ProcessAsync(context, output);

        Assert.Single(logger.LoggedMessages);
        Assert.Contains("analytics-widget", logger.LoggedMessages[0]);
        Assert.Contains("Visible", logger.LoggedMessages[0]);
        Assert.Contains("PropsSize=", logger.LoggedMessages[0]);
    }
}
