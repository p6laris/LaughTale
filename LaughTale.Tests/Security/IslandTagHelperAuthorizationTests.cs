using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.Configuration;
using LaughTale.Core.Extensions;
using LaughTale.Core.Security;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Security;

public class IslandTagHelperAuthorizationTests
{
    [Island("financial-metrics")]
    [IslandAuthorize("FinancialAdmin")]
    public record FinancialMetricsProps(decimal Revenue, decimal Profit);

    private (IServiceProvider Services, ViewContext ViewContext) CreateContext(ClaimsPrincipal user, Action<LaughTaleOptions>? configure = null)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("FinancialAdmin", policy => policy.RequireRole("CFO"));
        });
        services.AddLaughTale(options =>
        {
            options.Refresh.RequirePolicy("admin-dashboard", "AdminOnly");
            configure?.Invoke(options);
        });

        var provider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext
        {
            RequestServices = provider,
            User = user
        };

        var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
            httpContext,
            new Microsoft.AspNetCore.Routing.RouteData(),
            new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());

        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        var viewContext = new ViewContext(
            actionContext,
            Microsoft.Extensions.Options.Options.Create(new MockView()).Value,
            viewData,
            new TempDataDictionary(httpContext, new MockTempDataProvider()),
            new System.IO.StringWriter(),
            new HtmlHelperOptions());

        return (provider, viewContext);
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString()
        );

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent())
        );

        return (context, output);
    }

    [Fact]
    public async Task InitialRender_CoreTagHelper_AuthorizedUser_RendersContainerAndProps()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Alice"),
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        var (services, viewContext) = CreateContext(user);

        var helper = new IslandTagHelper
        {
            ViewContext = viewContext,
            Name = "admin-dashboard",
            Props = new { metrics = 42 }
        };

        var (context, output) = CreateTagHelperContext("island");
        await helper.ProcessAsync(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("admin-dashboard", output.Attributes["data-island"].Value);
        Assert.Contains("42", output.Attributes["data-props"].Value.ToString());
    }

    [Fact]
    public async Task InitialRender_CoreTagHelper_UnauthorizedUser_SuppressesAllOutput()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Bob"),
            new Claim(ClaimTypes.Role, "Guest")
        }, "TestAuth"));

        var (services, viewContext) = CreateContext(user);

        var helper = new IslandTagHelper
        {
            ViewContext = viewContext,
            Name = "admin-dashboard",
            Props = new { secretMetric = "confidential-123" }
        };

        var (context, output) = CreateTagHelperContext("island");
        await helper.ProcessAsync(context, output);

        // Assert zero trace of the island: TagName suppressed, no HTML or props leaked
        Assert.Null(output.TagName);
        Assert.True(output.Content.IsEmptyOrWhiteSpace);
    }

    [Fact]
    public async Task InitialRender_GeneratedTagHelper_AuthorizedUser_Renders()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Alice"),
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        var (services, viewContext) = CreateContext(user);

        var helper = new IslandInputTextTagHelper
        {
            ViewContext = viewContext,
            Policy = "AdminOnly",
            Value = "Secret Admin Input"
        };

        var (context, output) = CreateTagHelperContext("island-input-text");
        await helper.ProcessAsync(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("input-text", output.Attributes["data-island"].Value);
        Assert.Contains("Secret Admin Input", output.Attributes["data-props"].Value.ToString());
    }

    [Fact]
    public async Task InitialRender_GeneratedTagHelper_UnauthorizedUser_SuppressesAllOutput()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Bob"),
            new Claim(ClaimTypes.Role, "Guest")
        }, "TestAuth"));

        var (services, viewContext) = CreateContext(user);

        var helper = new IslandInputTextTagHelper
        {
            ViewContext = viewContext,
            Policy = "AdminOnly",
            Value = "Secret Admin Input"
        };

        var (context, output) = CreateTagHelperContext("island-input-text");
        await helper.ProcessAsync(context, output);

        // Assert completely suppressed output
        Assert.Null(output.TagName);
        Assert.True(output.Content.IsEmptyOrWhiteSpace);
    }

    [Fact]
    public async Task InitialRender_PropsDecoratedWithIslandAuthorize_AutomaticallyEnforcesPolicy()
    {
        var unauthorizedUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Eve"),
            new Claim(ClaimTypes.Role, "StandardUser")
        }, "TestAuth"));

        var (services1, viewContext1) = CreateContext(unauthorizedUser);

        var props = new FinancialMetricsProps(1000000m, 250000m);

        var unauthHelper = new IslandTagHelper
        {
            ViewContext = viewContext1,
            Name = "financial-metrics",
            Props = props
        };

        var (context1, output1) = CreateTagHelperContext("island");
        await unauthHelper.ProcessAsync(context1, output1);

        // Unauthorized: zero output
        Assert.Null(output1.TagName);
        Assert.True(output1.Content.IsEmptyOrWhiteSpace);

        // Authorized CFO
        var cfoUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Carol"),
            new Claim(ClaimTypes.Role, "CFO")
        }, "TestAuth"));

        var (services2, viewContext2) = CreateContext(cfoUser);

        var authHelper = new IslandTagHelper
        {
            ViewContext = viewContext2,
            Name = "financial-metrics",
            Props = props
        };

        var (context2, output2) = CreateTagHelperContext("island");
        await authHelper.ProcessAsync(context2, output2);

        // Authorized: rendered correctly
        Assert.Equal("div", output2.TagName);
        Assert.Equal("financial-metrics", output2.Attributes["data-island"].Value);
        Assert.Contains("1000000", output2.Attributes["data-props"].Value.ToString());
    }

    [Fact]
    public void IslandAuthorizationRegistry_DiscoversPolicyFromIslandAuthorizeAttribute()
    {
        var registry = new IslandAuthorizationRegistry();
        
        // Scan current test assembly
        registry.RegisterPoliciesFromAttributes(typeof(IslandTagHelperAuthorizationTests).Assembly);

        var policy = registry.GetPolicy("financial-metrics");
        Assert.Equal("FinancialAdmin", policy);
    }

    private class MockView : IView
    {
        public string Path => "test.cshtml";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(HttpContext context, IDictionary<string, object> values) { }
    }
}
