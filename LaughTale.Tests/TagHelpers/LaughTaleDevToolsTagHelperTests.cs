using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.TagHelpers.DevTools;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Security;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

[Collection(LaughTale.Tests.LaughTaleEnvironmentCollection.Name)]
public class LaughTaleDevToolsTagHelperTests : IDisposable
{
    public LaughTaleDevToolsTagHelperTests()
    {
        LaughTaleEnvironment.SetDevelopment(true);
    }

    public void Dispose()
    {
        LaughTaleEnvironment.SetDevelopment(null);
    }

    private class FakeCspNonceProvider : ICspNonceProvider
    {
        public string GetNonce() => "test-nonce-123";
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public void Development_NoCspProvider_EmitsScriptWithNoNonce()
    {
        var tagHelper = new LaughTaleDevToolsTagHelper();
        var (context, output) = CreateTagHelperContext("laughtale-devtools");
        // The real usage is always the self-closing <laughtale-devtools /> - Razor constructs the
        // TagHelperOutput with TagMode.SelfClosing to match that source syntax. Reproduced explicitly
        // here since it's what exposed a real bug: left as SelfClosing, the final HTML serializes as
        // "<script />" with Content silently discarded (confirmed live in the Showcase app) - a plain
        // TagHelperOutput.Content assertion alone does not catch this, only a TagMode assertion does.
        output.TagMode = TagMode.SelfClosing;

        tagHelper.Process(context, output);

        Assert.Equal("script", output.TagName);
        Assert.Equal(TagMode.StartTagAndEndTag, output.TagMode);
        Assert.Contains("window.__LAUGHTALE_DEV__ = true;", output.Content.GetContent());
        Assert.False(output.Attributes.ContainsName("nonce"));
    }

    [Fact]
    public void Development_WithCspProvider_EmitsNonceAttribute()
    {
        var tagHelper = new LaughTaleDevToolsTagHelper(new FakeCspNonceProvider());
        var (context, output) = CreateTagHelperContext("laughtale-devtools");

        tagHelper.Process(context, output);

        Assert.True(output.Attributes.ContainsName("nonce"));
        Assert.Equal("test-nonce-123", output.Attributes["nonce"].Value);
    }

    [Fact]
    public void Production_SuppressesOutput()
    {
        LaughTaleEnvironment.SetDevelopment(false);

        var tagHelper = new LaughTaleDevToolsTagHelper();
        var (context, output) = CreateTagHelperContext("laughtale-devtools");

        tagHelper.Process(context, output);

        Assert.Null(output.TagName);
        Assert.Equal(string.Empty, output.Content.GetContent());
    }
}
