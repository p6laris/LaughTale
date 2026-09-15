using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;
using LaughTale.Core.Extensions;
using LaughTale.Core.Plugins;
using Xunit;

namespace LaughTale.Tests.Plugins;

public class LaughTalePluginTests
{
    private class RecordingPlugin : LaughTalePlugin
    {
        public override string Name => "recording-plugin";
        public bool ConfigureWasCalled { get; private set; }

        public override void OnConfigure(LaughTaleOptions options, IServiceCollection services)
        {
            ConfigureWasCalled = true;
            options.ThemeStudio.Enabled = true;
        }
    }

    [Fact]
    public void AddLaughTalePlugin_BeforeAddLaughTale_StillConfiguresOptions()
    {
        var services = new ServiceCollection();
        var plugin = new RecordingPlugin();

        services.AddLaughTalePlugin(plugin);
        services.AddLaughTale();

        Assert.True(plugin.ConfigureWasCalled);

        var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<LaughTaleOptions>();

        Assert.True(options.ThemeStudio.Enabled);
    }

    [Fact]
    public void AddLaughTalePlugin_AfterAddLaughTale_StillConfiguresOptions()
    {
        var services = new ServiceCollection();
        var plugin = new RecordingPlugin();

        services.AddLaughTale();
        services.AddLaughTalePlugin(plugin);

        Assert.True(plugin.ConfigureWasCalled);

        var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<LaughTaleOptions>();

        Assert.True(options.ThemeStudio.Enabled);
    }

    [Fact]
    public void AddLaughTalePlugin_RegistersPlugin_AsBothConcreteTypeAndBaseType()
    {
        var services = new ServiceCollection();
        var plugin = new RecordingPlugin();

        services.AddLaughTale();
        services.AddLaughTalePlugin(plugin);

        var provider = services.BuildServiceProvider();

        Assert.Same(plugin, provider.GetRequiredService<RecordingPlugin>());

        var resolvedPlugins = provider.GetRequiredService<System.Collections.Generic.IEnumerable<LaughTalePlugin>>();
        Assert.Contains(plugin, resolvedPlugins);
    }

    [Fact]
    public void AddLaughTalePlugin_MultiplePlugins_AllResolveViaIEnumerable()
    {
        var services = new ServiceCollection();
        var pluginA = new RecordingPlugin();
        var pluginB = new RecordingPlugin();

        services.AddLaughTale();
        services.AddLaughTalePlugin(pluginA);
        services.AddLaughTalePlugin(pluginB);

        var provider = services.BuildServiceProvider();
        var resolvedPlugins = provider.GetRequiredService<System.Collections.Generic.IEnumerable<LaughTalePlugin>>();

        Assert.Equal(2, System.Linq.Enumerable.Count(resolvedPlugins));
        Assert.Contains(pluginA, resolvedPlugins);
        Assert.Contains(pluginB, resolvedPlugins);
    }

    [Fact]
    public void AddLaughTalePlugin_WithNoAddLaughTaleCall_StillCreatesOptionsInstance()
    {
        var services = new ServiceCollection();
        var plugin = new RecordingPlugin();

        services.AddLaughTalePlugin(plugin);

        var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<LaughTaleOptions>();

        Assert.True(options.ThemeStudio.Enabled);
    }
}
