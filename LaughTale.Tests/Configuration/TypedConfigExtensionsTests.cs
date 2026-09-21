using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Configuration;

/// <summary>
/// ROADMAP.v5.md Part F "Typed config & sessions" (config half): validates AddLaughTaleTypedConfig's
/// bind/validate/split behavior and TypedConfigAmbientStateMiddleware's dehydration into the Ambient
/// State Pool.
/// </summary>
public class TypedConfigExtensionsTests
{
    public class AppConfig
    {
        [Required]
        public string DbConnectionString { get; set; } = "";

        [ClientExposed]
        public string PublicApiUrl { get; set; } = "";

        [ClientExposed]
        [Required]
        public string FeatureFlagName { get; set; } = "";
    }

    private static IConfiguration BuildConfiguration(Dictionary<string, string?> values) =>
        new ConfigurationBuilder().AddInMemoryCollection(values).Build();

    [Fact]
    public void AddLaughTaleTypedConfig_ValidConfig_ResolvesFullObjectViaIOptions()
    {
        var config = BuildConfiguration(new()
        {
            ["DbConnectionString"] = "Server=.;Database=x",
            ["PublicApiUrl"] = "https://api.example.com",
            ["FeatureFlagName"] = "new-checkout"
        });

        var services = new ServiceCollection();
        services.AddLaughTaleTypedConfig<AppConfig>(config);
        var provider = services.BuildServiceProvider();

        var resolved = provider.GetRequiredService<IOptions<AppConfig>>().Value;

        Assert.Equal("Server=.;Database=x", resolved.DbConnectionString);
        Assert.Equal("https://api.example.com", resolved.PublicApiUrl);
    }

    [Fact]
    public void AddLaughTaleTypedConfig_InvalidConfig_ThrowsOnFirstAccess()
    {
        var config = BuildConfiguration(new()
        {
            ["DbConnectionString"] = "Server=.;Database=x",
            ["PublicApiUrl"] = "https://api.example.com"
            // FeatureFlagName deliberately missing - [Required] must fail validation.
        });

        var services = new ServiceCollection();
        services.AddLaughTaleTypedConfig<AppConfig>(config);
        var provider = services.BuildServiceProvider();

        Assert.Throws<OptionsValidationException>(() => provider.GetRequiredService<IOptions<AppConfig>>().Value);
    }

    [Fact]
    public void AddLaughTaleTypedConfig_ClientExposedProjection_OnlyContainsMarkedProperties()
    {
        var config = BuildConfiguration(new()
        {
            ["DbConnectionString"] = "Server=.;Database=x",
            ["PublicApiUrl"] = "https://api.example.com",
            ["FeatureFlagName"] = "new-checkout"
        });

        var services = new ServiceCollection();
        services.AddLaughTaleTypedConfig<AppConfig>(config);
        var provider = services.BuildServiceProvider();

        var projection = provider.GetRequiredService<ClientExposedConfigProjection>();

        Assert.Equal(2, projection.Values.Count);
        Assert.Equal("https://api.example.com", projection.Values["publicApiUrl"]);
        Assert.Equal("new-checkout", projection.Values["featureFlagName"]);
        Assert.False(projection.Values.ContainsKey("dbConnectionString"), "Server-only property must never appear in the client-exposed projection");
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext()
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            "island-state-script",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public async Task TypedConfigAmbientStateMiddleware_SeedsMergedProjectionUnderConfigKey()
    {
        var config = BuildConfiguration(new()
        {
            ["DbConnectionString"] = "Server=.;Database=x",
            ["PublicApiUrl"] = "https://api.example.com",
            ["FeatureFlagName"] = "new-checkout"
        });

        var services = new ServiceCollection();
        services.AddLaughTaleTypedConfig<AppConfig>(config);
        var provider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext { RequestServices = provider };
        var middleware = new TypedConfigAmbientStateMiddleware(
            _ => Task.CompletedTask,
            provider.GetServices<ClientExposedConfigProjection>());

        await middleware.InvokeAsync(httpContext);

        // Assert through the same public surface a real page uses - <island-state-script /> - since
        // AmbientStatePool itself is internal by design (see AmbientStatePool.cs).
        var viewContext = new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Contains("\"config\":{\"publicApiUrl\":\"https://api.example.com\"", output.Content.GetContent());
    }

    [Fact]
    public async Task TypedConfigAmbientStateMiddleware_NoTypedConfigRegistered_SeedsNothing()
    {
        var services = new ServiceCollection();
        var provider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext { RequestServices = provider };
        var middleware = new TypedConfigAmbientStateMiddleware(
            _ => Task.CompletedTask,
            provider.GetServices<ClientExposedConfigProjection>());

        await middleware.InvokeAsync(httpContext);

        var viewContext = new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Null(output.TagName);
    }
}
