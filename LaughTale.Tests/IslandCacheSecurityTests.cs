using System.IO;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.Routing;
using LaughTale.Core.Attributes;
using LaughTale.Core.Extensions;
using LaughTale.Core.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace LaughTale.Tests;

[IslandPrivate("Contains user billing profile")]
public record UserBillingProps(string AccountNumber, decimal Balance);

public record UserProfileProps(
    string DisplayName,
    [property: IslandPrivate] string Ssn
);

public record PublicCatalogProps(string Category, int TotalProducts);

public class IslandCacheSecurityTests
{
    [Fact]
    public async Task PrivateModel_EnforcesNoStoreAndPrivateCacheHeaders()
    {
        var httpContext = new DefaultHttpContext();
        var tagHelper = CreateTagHelper(httpContext);
        tagHelper.Name = "user-billing";
        tagHelper.Props = new UserBillingProps("ACC-98214", 450.75m);

        var context = CreateTagHelperContext();
        var output = CreateTagHelperOutput("island");

        await tagHelper.ProcessAsync(context, output);

        var cacheControl = httpContext.Response.Headers.CacheControl.ToString();
        Assert.Contains("no-store", cacheControl);
        Assert.Contains("private", cacheControl);
        Assert.Contains("Cookie", httpContext.Response.Headers.Vary.ToString());
    }

    [Fact]
    public async Task PrivateProperty_EnforcesNoStoreAndPrivateCacheHeaders()
    {
        var httpContext = new DefaultHttpContext();
        var tagHelper = CreateTagHelper(httpContext);
        tagHelper.Name = "user-profile";
        tagHelper.Props = new UserProfileProps("John Doe", "123-45-6789");

        var context = CreateTagHelperContext();
        var output = CreateTagHelperOutput("island");

        await tagHelper.ProcessAsync(context, output);

        var cacheControl = httpContext.Response.Headers.CacheControl.ToString();
        Assert.Contains("no-store", cacheControl);
        Assert.Contains("private", cacheControl);
    }

    [Fact]
    public async Task ExplicitPrivateAttribute_EnforcesNoStore()
    {
        var httpContext = new DefaultHttpContext();
        var tagHelper = CreateTagHelper(httpContext);
        tagHelper.Name = "generic-card";
        tagHelper.IsPrivate = true;

        var context = CreateTagHelperContext();
        var output = CreateTagHelperOutput("island");

        await tagHelper.ProcessAsync(context, output);

        var cacheControl = httpContext.Response.Headers.CacheControl.ToString();
        Assert.Contains("no-store", cacheControl);
    }

    [Fact]
    public async Task PublicIsland_DoesNotForceNoStoreHeader()
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Response.Headers.CacheControl = "public, max-age=3600";

        var tagHelper = CreateTagHelper(httpContext);
        tagHelper.Name = "catalog-island";
        tagHelper.Props = new PublicCatalogProps("Electronics", 42);

        var context = CreateTagHelperContext();
        var output = CreateTagHelperOutput("island");

        await tagHelper.ProcessAsync(context, output);

        var cacheControl = httpContext.Response.Headers.CacheControl.ToString();
        Assert.Equal("public, max-age=3600", cacheControl);
    }

    private static IslandTagHelper CreateTagHelper(HttpContext httpContext)
    {
        var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(options => options.Refresh.AllowUndeclaredIslands = true);
        httpContext.RequestServices = services.BuildServiceProvider();

        var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new RouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        var viewContext = new ViewContext(actionContext, new MockView(), viewData, new TempDataDictionary(httpContext, new MockTempDataProvider()), TextWriter.Null, new HtmlHelperOptions());

        return new IslandTagHelper { ViewContext = viewContext };
    }

    private static TagHelperContext CreateTagHelperContext()
    {
        return new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            System.Guid.NewGuid().ToString("N"));
    }

    private static TagHelperOutput CreateTagHelperOutput(string tagName)
    {
        return new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));
    }

    private class MockView : Microsoft.AspNetCore.Mvc.ViewEngines.IView
    {
        public string Path => "MockView";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public System.Collections.Generic.IDictionary<string, object> LoadTempData(HttpContext context) => new System.Collections.Generic.Dictionary<string, object>();
        public void SaveTempData(HttpContext context, System.Collections.Generic.IDictionary<string, object> values) { }
    }
}
