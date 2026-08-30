using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests;

public class LaughTaleOptionsTests
{
    [Fact]
    public void AddLaughTale_WithDefaults_LeavesAllOptionalFeaturesDisabled()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();

        var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<LaughTaleOptions>();

        Assert.NotNull(options);
        Assert.False(options.ViewTransitions.Enabled);
        Assert.False(options.Prefetch.Enabled);
        Assert.False(options.Csp.Enabled);
        Assert.False(options.ThemeStudio.Enabled);
        Assert.True(options.Caching.EnforcePrivateOnUserProps);
    }

    [Fact]
    public void AddLaughTale_WithCustomConfiguration_CorrectlySetsOptions()
    {
        var services = new ServiceCollection();
        services.AddLaughTale(o =>
        {
            o.ViewTransitions.Enabled = true;
            o.Prefetch.Enabled = true;
            o.Prefetch.HoverDelayMs = 120;
            o.Csp.Enabled = true;
            o.ThemeStudio.Enabled = true;
        });

        var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<IOptions<LaughTaleOptions>>().Value;

        Assert.True(options.ViewTransitions.Enabled);
        Assert.True(options.Prefetch.Enabled);
        Assert.Equal(120, options.Prefetch.HoverDelayMs);
        Assert.True(options.Csp.Enabled);
        Assert.True(options.ThemeStudio.Enabled);
    }

    [Fact]
    public void AddIslands_Alias_RegistersEquivalentOptions()
    {
        var services = new ServiceCollection();
        services.AddIslands(o => o.ViewTransitions.Enabled = true);

        var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<LaughTaleOptions>();

        Assert.True(options.ViewTransitions.Enabled);
    }
}
