using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.State;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.State;

/// <summary>
/// ROADMAP.v5.md Part F "Ambient state pool": verifies IslandStateScriptTagHelper renders the
/// dehydrated blob only when something was registered, enforces no-store when any entry is private,
/// and folds duplicate keys last-write-wins.
/// </summary>
public class IslandStateScriptTagHelperTests
{
    [IslandPrivate]
    private record PrivateUserContext(string UserId);

    private static ViewContext CreateViewContext()
    {
        var httpContext = new DefaultHttpContext();
        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        return new ViewContext { HttpContext = httpContext, ViewData = viewData };
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
            (useCachedResult, encoder) => System.Threading.Tasks.Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public void Process_NothingRegistered_SuppressesOutput()
    {
        var viewContext = CreateViewContext();
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Null(output.TagName);
        Assert.Equal(string.Empty, output.Content.GetContent());
    }

    [Fact]
    public void Process_RegisteredEntries_RendersScriptTagWithJsonPayload()
    {
        var viewContext = CreateViewContext();
        viewContext.HttpContext.SetAmbientState("cartCount", 3);
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Equal("script", output.TagName);
        Assert.Equal("__LAUGHTALE_STATE__", output.Attributes["id"].Value);
        Assert.Equal("application/json", output.Attributes["type"].Value);
        Assert.Contains("\"cartCount\":3", output.Content.GetContent());
    }

    [Fact]
    public void Process_DuplicateKey_LastRegistrationWins()
    {
        var viewContext = CreateViewContext();
        viewContext.HttpContext.SetAmbientState("theme", "light");
        viewContext.HttpContext.SetAmbientState("theme", "dark");
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Contains("\"theme\":\"dark\"", output.Content.GetContent());
        Assert.DoesNotContain("light", output.Content.GetContent());
    }

    [Fact]
    public void Process_ExplicitPrivateFlag_EnforcesNoStore()
    {
        var viewContext = CreateViewContext();
        viewContext.HttpContext.SetAmbientState("userId", "u-1", isPrivate: true);
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Equal("no-store, no-cache, private", viewContext.HttpContext.Response.Headers.CacheControl.ToString());
    }

    [Fact]
    public void Process_IslandPrivateAttributeOnValueType_EnforcesNoStore()
    {
        var viewContext = CreateViewContext();
        viewContext.HttpContext.SetAmbientState("ctx", new PrivateUserContext("u-1"));
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Equal("no-store, no-cache, private", viewContext.HttpContext.Response.Headers.CacheControl.ToString());
    }

    [Fact]
    public void Process_NoPrivateEntries_DoesNotTouchCacheControl()
    {
        var viewContext = CreateViewContext();
        viewContext.HttpContext.SetAmbientState("cartCount", 3);
        var helper = new IslandStateScriptTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Equal(string.Empty, viewContext.HttpContext.Response.Headers.CacheControl.ToString());
    }
}
