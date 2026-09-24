using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests.Security;

/// <summary>
/// IslandTagHelperBase must apply the same [IslandPrivate] no-store rule as the core &lt;island&gt;
/// TagHelper and IslandDeferredTagHelper.
/// </summary>
public class IslandTagHelperBasePrivacyTests
{
    [IslandPrivate]
    public record PrivateAccountProps(string AccountNumber);

    public record PartlyPrivateProps(string Name, [property: IslandPrivate] string Email);

    [IslandAllowAnonymous]
    private sealed class PropsTagHelper : IslandTagHelperBase
    {
        private readonly object? _props;

        public PropsTagHelper(object? props) => _props = props;

        public override string IslandName => "account-card";

        protected override object? BuildProps() => _props;
    }

    [IslandAllowAnonymous]
    [IslandPrivate]
    private sealed class PrivateComponentTagHelper : IslandTagHelperBase
    {
        public override string IslandName => "private-component";
    }

    private static async Task<HttpContext> RenderAsync(IslandTagHelperBase tagHelper, string? existingCacheControl = null)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale();
        var httpContext = new DefaultHttpContext { RequestServices = services.BuildServiceProvider() };
        if (existingCacheControl is not null)
        {
            httpContext.Response.Headers.CacheControl = existingCacheControl;
        }

        tagHelper.ViewContext = new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };

        var context = new TagHelperContext(new TagHelperAttributeList(), new Dictionary<object, object>(), Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput(
            "account-card",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        await tagHelper.ProcessAsync(context, output);
        return httpContext;
    }

    [Fact]
    public async Task PrivatePropsType_EnforcesNoStore()
    {
        var httpContext = await RenderAsync(new PropsTagHelper(new PrivateAccountProps("ACC-1")), "public, max-age=60");

        Assert.Equal("no-store, no-cache, private", httpContext.Response.Headers.CacheControl.ToString());
        Assert.Equal("Cookie", httpContext.Response.Headers.Vary.ToString());
    }

    [Fact]
    public async Task PrivateProperty_EnforcesNoStore()
    {
        var httpContext = await RenderAsync(new PropsTagHelper(new PartlyPrivateProps("Ada", "ada@example.com")));

        Assert.Contains("no-store", httpContext.Response.Headers.CacheControl.ToString());
    }

    [Fact]
    public async Task PrivateComponentType_EnforcesNoStore()
    {
        var httpContext = await RenderAsync(new PrivateComponentTagHelper());

        Assert.Contains("no-store", httpContext.Response.Headers.CacheControl.ToString());
    }

    [Fact]
    public async Task PublicProps_LeaveCacheHeadersAlone()
    {
        var httpContext = await RenderAsync(new PropsTagHelper(new { title = "catalog" }), "public, max-age=60");

        Assert.Equal("public, max-age=60", httpContext.Response.Headers.CacheControl.ToString());
    }
}
