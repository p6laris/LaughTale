using System;
using LaughTale.Core.Configuration;
using Xunit;

namespace LaughTale.Tests.Configuration;

/// <summary>
/// ROADMAP.v5.md Part E "Route rules", redefined honestly as per-path Cache-Control declarations.
/// </summary>
public class RouteRulesOptionsTests
{
    [Fact]
    public void Match_ExactPath_ReturnsConfiguredCacheControl()
    {
        var options = new RouteRulesOptions().AddRule("/pricing", "public, max-age=300");

        Assert.Equal("public, max-age=300", options.Match("/pricing"));
    }

    [Fact]
    public void Match_ExactPath_IsCaseInsensitive()
    {
        var options = new RouteRulesOptions().AddRule("/Pricing", "public, max-age=300");

        Assert.Equal("public, max-age=300", options.Match("/pricing"));
    }

    [Fact]
    public void Match_ExactPath_DoesNotMatchASubPath()
    {
        var options = new RouteRulesOptions().AddRule("/pricing", "public, max-age=300");

        Assert.Null(options.Match("/pricing/enterprise"));
    }

    [Fact]
    public void Match_TrailingWildcard_MatchesAnyPathUnderThePrefix()
    {
        var options = new RouteRulesOptions().AddRule("/blog/*", "public, max-age=3600");

        Assert.Equal("public, max-age=3600", options.Match("/blog/my-post"));
        Assert.Equal("public, max-age=3600", options.Match("/blog/2026/my-post"));
    }

    [Fact]
    public void Match_TrailingWildcard_DoesNotMatchAnUnrelatedPath()
    {
        var options = new RouteRulesOptions().AddRule("/blog/*", "public, max-age=3600");

        Assert.Null(options.Match("/news/my-post"));
    }

    [Fact]
    public void Match_NoRulesRegistered_ReturnsNull()
    {
        var options = new RouteRulesOptions();

        Assert.Null(options.Match("/anything"));
    }

    [Fact]
    public void Match_MultipleRules_FirstRegisteredMatchWins()
    {
        var options = new RouteRulesOptions()
            .AddRule("/blog/drafts", "no-store")
            .AddRule("/blog/*", "public, max-age=3600");

        Assert.Equal("no-store", options.Match("/blog/drafts"));
        Assert.Equal("public, max-age=3600", options.Match("/blog/other-post"));
    }

    [Fact]
    public void AddRule_RejectsNullOrEmptyPattern()
    {
        var options = new RouteRulesOptions();

        Assert.Throws<ArgumentException>(() => options.AddRule("", "public"));
        Assert.Throws<ArgumentException>(() => options.AddRule("   ", "public"));
    }

    [Fact]
    public void AddRule_RejectsNullOrEmptyCacheControl()
    {
        var options = new RouteRulesOptions();

        Assert.Throws<ArgumentException>(() => options.AddRule("/pricing", ""));
    }
}
