using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Enums;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

public class IslandRuntimeDiagnosticTests : IDisposable
{
    public IslandRuntimeDiagnosticTests()
    {
        LaughTaleEnvironment.SetDevelopment(true);
    }

    public void Dispose()
    {
        LaughTaleEnvironment.SetDevelopment(null);
    }

    [Fact]
    public async Task Development_InvalidNameFormat_EmitsWarningAttribute()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "Invalid_Name-Upper"
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.True(output.Attributes.ContainsName("data-laughtale-warning-name"));
        Assert.Contains("must be non-empty lowercase kebab-case", output.Attributes["data-laughtale-warning-name"].Value.ToString());
    }

    [Fact]
    public async Task Development_ValidKebabCaseName_NoWarningAttribute()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "valid-island-name"
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.False(output.Attributes.ContainsName("data-laughtale-warning-name"));
    }

    [Fact]
    public async Task Development_MediaWithoutMediaStrategy_EmitsWarningAttribute()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "responsive-card",
            Media = "(min-width: 768px)",
            Hydrate = HydrateStrategy.Load
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.True(output.Attributes.ContainsName("data-laughtale-warning-media"));
        Assert.Contains("only evaluated when hydrate='Media'", output.Attributes["data-laughtale-warning-media"].Value.ToString());
    }

    [Fact]
    public async Task Development_MediaWithMediaStrategy_NoWarningAttribute()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "responsive-card",
            Media = "(min-width: 768px)",
            Hydrate = HydrateStrategy.Media
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.False(output.Attributes.ContainsName("data-laughtale-warning-media"));
    }

    [Fact]
    public async Task Development_PersistOnLazyStrategy_EmitsWarningAttribute()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "persistent-chat",
            Persist = "true",
            Hydrate = HydrateStrategy.Visible
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.True(output.Attributes.ContainsName("data-laughtale-warning-persist"));
        Assert.Contains("must use hydrate='Load'", output.Attributes["data-laughtale-warning-persist"].Value.ToString());
    }

    [Fact]
    public async Task Development_PersistOnLoadStrategy_NoWarningAttribute()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "persistent-chat",
            Persist = "true",
            Hydrate = HydrateStrategy.Load
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.False(output.Attributes.ContainsName("data-laughtale-warning-persist"));
    }

    [Fact]
    public async Task Production_InvalidConfigurations_ZeroWarningAttributes()
    {
        LaughTaleEnvironment.SetDevelopment(false);

        var tagHelper = new IslandTagHelper
        {
            Name = "Invalid_Name-Upper",
            Media = "(min-width: 768px)",
            Hydrate = HydrateStrategy.Visible,
            Persist = "true"
        };

        var (context, output) = CreateTagHelperContext("island");
        await tagHelper.ProcessAsync(context, output);

        Assert.False(output.Attributes.ContainsName("data-laughtale-warning-name"));
        Assert.False(output.Attributes.ContainsName("data-laughtale-warning-media"));
        Assert.False(output.Attributes.ContainsName("data-laughtale-warning-persist"));
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }
}
