using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;
using LaughTale.Core.Extensions;
using LaughTale.Core.Plugins;
using LaughTale.Core.Ssr;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Ssr;

/// <summary>
/// <see cref="SsrSidecarPlugin"/> through the real <c>&lt;island&gt;</c> TagHelper (and
/// IslandTagHelperBase), with a fake <see cref="ISsrRenderer"/> so no process is involved.
/// </summary>
public class SsrSidecarPluginTests
{
    public record CounterProps(int Start, string Label);

    private sealed class FakeRenderer : ISsrRenderer
    {
        private readonly Func<string, string?, SsrRenderResult> _render;

        public FakeRenderer(Func<string, string?, SsrRenderResult> render, params string[] islands)
        {
            _render = render;
            Islands = new HashSet<string>(islands);
        }

        public HashSet<string> Islands { get; }

        public bool Ready { get; set; } = true;

        public ConcurrentQueue<(string Island, string? Props)> Calls { get; } = new();

        public bool IsReady => Ready;

        public bool CanRender(string islandName) => Ready && Islands.Contains(islandName);

        public Task<SsrRenderResult> RenderAsync(string islandName, string? propsJson, CancellationToken cancellationToken = default)
        {
            Calls.Enqueue((islandName, propsJson));
            return Task.FromResult(_render(islandName, propsJson));
        }
    }

    private static IServiceProvider BuildServices(ISsrRenderer? renderer, bool registerPlugin = true)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(options => options.Refresh.AllowUndeclaredIslands = true);
        if (renderer is not null)
        {
            services.AddSingleton(renderer);
        }

        if (registerPlugin)
        {
            services.AddLaughTalePlugin(new SsrSidecarPlugin());
        }

        return services.BuildServiceProvider();
    }

    private static ViewContext CreateViewContext(IServiceProvider provider)
    {
        var httpContext = new DefaultHttpContext { RequestServices = provider };
        return new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName, string? childHtml = null)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "fixed-unique-id");

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) =>
            {
                var content = new DefaultTagHelperContent();
                if (childHtml is not null)
                {
                    content.SetHtmlContent(childHtml);
                }

                return Task.FromResult<TagHelperContent>(content);
            });

        return (context, output);
    }

    private static async Task<(TagHelperOutput Output, string Html)> RenderIslandAsync(
        IServiceProvider provider,
        string name = "counter",
        object? props = null,
        string? fallback = null,
        string? childHtml = null)
    {
        var tagHelper = new IslandTagHelper
        {
            ViewContext = CreateViewContext(provider),
            Name = name,
            Props = props ?? new CounterProps(3, "Clicks"),
            Framework = IslandFramework.React,
            Fallback = fallback
        };

        var (context, output) = CreateTagHelperContext("island", childHtml);
        await tagHelper.ProcessAsync(context, output);

        // Dev-only diagnostics depend on process-global environment state other test classes toggle.
        foreach (var attribute in output.Attributes.Where(a => a.Name.StartsWith("data-laughtale-warning", StringComparison.Ordinal)).ToList())
        {
            output.Attributes.Remove(attribute);
        }

        using var writer = new StringWriter();
        output.WriteTo(writer, HtmlEncoder.Default);
        return (output, writer.ToString());
    }

    [Fact]
    public async Task RenderableIsland_GetsServerHtmlAndSsrStamp()
    {
        var renderer = new FakeRenderer((_, _) => SsrRenderResult.Ok("<button>Clicks: 3</button>"), "counter");
        var (output, html) = await RenderIslandAsync(BuildServices(renderer));

        Assert.Equal("<button>Clicks: 3</button>", output.Content.GetContent());
        Assert.Equal("true", output.Attributes["data-lt-ssr"].Value.ToString());
        Assert.Contains("<button>Clicks: 3</button></div>", html); // raw HTML, not encoded
    }

    [Fact]
    public async Task PropsSentToRenderer_AreByteIdenticalToDataProps()
    {
        var renderer = new FakeRenderer((_, _) => SsrRenderResult.Ok("<b>x</b>"), "counter");
        var props = new CounterProps(7, "<script>\"quoted\" & ünïcode</script>");
        var (output, _) = await RenderIslandAsync(BuildServices(renderer), props: props);

        var call = Assert.Single(renderer.Calls);
        Assert.Equal("counter", call.Island);
        Assert.Equal(output.Attributes["data-props"].Value.ToString(), call.Props);
    }

    [Fact]
    public async Task SsrContent_WithFallback_IsKeptVerbatimWithoutTemplateOrMarker()
    {
        var renderer = new FakeRenderer((_, _) => SsrRenderResult.Ok("<span>ssr</span>"), "counter");
        var (output, _) = await RenderIslandAsync(BuildServices(renderer), fallback: "Loading...");

        Assert.Equal("<span>ssr</span>", output.Content.GetContent());
        Assert.Equal("Loading...", output.Attributes["data-fallback"].Value.ToString());
    }

    public static IEnumerable<object[]> FailureResults() => new[]
    {
        new object[] { SsrRenderResult.Fail(SsrRenderFailure.RenderError, "boom") },
        new object[] { SsrRenderResult.Fail(SsrRenderFailure.Timeout) },
        new object[] { SsrRenderResult.Fail(SsrRenderFailure.ProcessExited) },
        new object[] { SsrRenderResult.Ok("   ") }
    };

    [Theory]
    [MemberData(nameof(FailureResults))]
    public async Task RendererFailure_OutputIdenticalToNoSsr(SsrRenderResult failure)
    {
        var (_, baseline) = await RenderIslandAsync(BuildServices(renderer: null, registerPlugin: false), fallback: "Loading...");
        var renderer = new FakeRenderer((_, _) => failure, "counter");

        var (output, html) = await RenderIslandAsync(BuildServices(renderer), fallback: "Loading...");

        Assert.Single(renderer.Calls);
        Assert.Equal(baseline, html);
        Assert.False(output.Attributes.ContainsName("data-lt-ssr"));
    }

    [Fact]
    public async Task RendererThrowing_FailsOpen()
    {
        var (_, baseline) = await RenderIslandAsync(BuildServices(renderer: null, registerPlugin: false));
        var renderer = new FakeRenderer((_, _) => throw new InvalidOperationException("kaboom"), "counter");

        var (_, html) = await RenderIslandAsync(BuildServices(renderer));

        Assert.Equal(baseline, html);
    }

    [Fact]
    public async Task IslandWithChildContent_IsNotSentToRenderer()
    {
        var renderer = new FakeRenderer((_, _) => SsrRenderResult.Ok("<p>ssr</p>"), "counter");

        var (output, _) = await RenderIslandAsync(BuildServices(renderer), childHtml: "<em>slotted</em>");

        Assert.Empty(renderer.Calls);
        Assert.False(output.Attributes.ContainsName("data-lt-ssr"));
        Assert.Contains("<div data-slot=\"default\" class=\"island-slot\"><em>slotted</em></div>", output.Content.GetContent());
    }

    [Fact]
    public async Task IslandUnknownToRenderer_OrRendererNotReady_IsNotSent()
    {
        var unknown = new FakeRenderer((_, _) => SsrRenderResult.Ok("<p>ssr</p>"), "something-else");
        var notReady = new FakeRenderer((_, _) => SsrRenderResult.Ok("<p>ssr</p>"), "counter") { Ready = false };

        var (unknownOutput, _) = await RenderIslandAsync(BuildServices(unknown));
        var (notReadyOutput, _) = await RenderIslandAsync(BuildServices(notReady));

        Assert.Empty(unknown.Calls);
        Assert.Empty(notReady.Calls);
        Assert.False(unknownOutput.Content.IsModified);
        Assert.False(notReadyOutput.Content.IsModified);
    }

    [Fact]
    public async Task Disabled_RegistersNothing_AndRenderIsUnchanged()
    {
        var (_, baseline) = await RenderIslandAsync(BuildServices(renderer: null, registerPlugin: false));

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(options => options.Refresh.AllowUndeclaredIslands = true);
        services.AddLaughTaleSsrSidecar(o => o.Enabled = false);
        var provider = services.BuildServiceProvider();

        Assert.Empty(provider.GetServices<LaughTalePlugin>());
        Assert.Null(provider.GetService<ISsrRenderer>());
        Assert.Empty(provider.GetServices<IHostedService>());

        var (_, html) = await RenderIslandAsync(provider);
        Assert.Equal(baseline, html);
    }

    [Fact]
    public void Enabled_RegistersSidecarAsRendererHostedServiceAndPlugin()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTaleSsrSidecar(o =>
        {
            o.Enabled = true;
            o.ServerBundlePath = "server-bundle.mjs";
        });
        services.AddLaughTaleSsrSidecar(o => { o.Enabled = true; o.ServerBundlePath = "ignored.mjs"; });
        using var provider = services.BuildServiceProvider();

        var sidecar = provider.GetRequiredService<NodeSsrSidecar>();
        Assert.Same(sidecar, provider.GetRequiredService<ISsrRenderer>());
        Assert.Same(sidecar, Assert.Single(provider.GetServices<IHostedService>()));
        Assert.IsType<SsrSidecarPlugin>(Assert.Single(provider.GetServices<LaughTalePlugin>()));
        Assert.Equal("server-bundle.mjs", provider.GetRequiredService<SsrSidecarOptions>().ServerBundlePath);
        Assert.False(sidecar.IsReady); // never started
    }

    [Fact]
    public void Enabled_WithoutServerBundle_Throws()
    {
        var services = new ServiceCollection();
        Assert.Throws<ArgumentException>(() => services.AddLaughTaleSsrSidecar(o => o.Enabled = true));
    }

    [Fact]
    public void ConfigurationOverload_BindsLaughTaleSsrSection()
    {
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["LaughTale:Ssr:Enabled"] = "true",
            ["LaughTale:Ssr:NodePath"] = "/opt/node/bin/node",
            ["LaughTale:Ssr:ServerBundlePath"] = "dist/server.mjs",
            ["LaughTale:Ssr:RenderTimeout"] = "00:00:00.250"
        }).Build();

        var services = new ServiceCollection();
        services.AddLaughTaleSsrSidecar(configuration);

        var options = (SsrSidecarOptions)services.Single(d => d.ServiceType == typeof(SsrSidecarOptions)).ImplementationInstance!;
        Assert.True(options.Enabled);
        Assert.Equal("/opt/node/bin/node", options.NodePath);
        Assert.Equal("dist/server.mjs", options.ServerBundlePath);
        Assert.Equal(TimeSpan.FromMilliseconds(250), options.RenderTimeout);
        Assert.Equal(TimeSpan.FromSeconds(10), options.StartupTimeout);
    }

    [IslandAllowAnonymous]
    private sealed class BaseDerivedTagHelper : IslandTagHelperBase
    {
        public override string IslandName => "base-counter";

        protected override object? BuildProps() => new { start = 1 };
    }

    [Fact]
    public async Task IslandTagHelperBase_AlsoReceivesSsrContent()
    {
        var renderer = new FakeRenderer((_, _) => SsrRenderResult.Ok("<p>base ssr</p>"), "base-counter");
        var tagHelper = new BaseDerivedTagHelper { ViewContext = CreateViewContext(BuildServices(renderer)) };
        var (context, output) = CreateTagHelperContext("base-counter");

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("<p>base ssr</p>", output.Content.GetContent());
        Assert.Equal("true", output.Attributes["data-lt-ssr"].Value.ToString());
        Assert.Equal(output.Attributes["data-props"].Value.ToString(), Assert.Single(renderer.Calls).Props);
    }
}
