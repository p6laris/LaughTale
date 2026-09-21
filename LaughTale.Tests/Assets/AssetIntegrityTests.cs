using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using LaughTale.Core.Assets;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Assets;

/// <summary>
/// ROADMAP.v5.md Part B "Asset pipeline" (integrity manifest): AssetIntegrityService computes a real
/// SHA-384 hash from the file actually on disk (via a fake IWebHostEnvironment, not a real wwwroot),
/// and AssetIntegrityTagHelper wires that into script/link tags correctly, including stripping
/// asp-append-version's own query string before resolving the file.
/// </summary>
public class AssetIntegrityTests
{
    private sealed class FakeWebHostEnvironment : IWebHostEnvironment
    {
        public FakeWebHostEnvironment(IFileProvider webRootFileProvider) => WebRootFileProvider = webRootFileProvider;
        public IFileProvider WebRootFileProvider { get; set; }
        public string WebRootPath { get; set; } = "";
        public IFileProvider ContentRootFileProvider { get; set; } = default!;
        public string ContentRootPath { get; set; } = "";
        public string EnvironmentName { get; set; } = "Development";
        public string ApplicationName { get; set; } = "Test";
    }

    private static IAssetIntegrityService CreateService(Dictionary<string, string> files)
    {
        var provider = new InMemoryFileProvider(files);
        var services = new ServiceCollection();
        services.AddSingleton<IWebHostEnvironment>(new FakeWebHostEnvironment(provider));
        services.AddLaughTaleAssetIntegrity();
        return services.BuildServiceProvider().GetRequiredService<IAssetIntegrityService>();
    }

    private sealed class InMemoryFileProvider : IFileProvider
    {
        private readonly Dictionary<string, string> _files;
        public InMemoryFileProvider(Dictionary<string, string> files) => _files = files;

        public IFileInfo GetFileInfo(string subpath)
        {
            var key = subpath.TrimStart('/');
            if (_files.TryGetValue(key, out var content))
            {
                return new InMemoryFile(content);
            }
            return new NotFoundFileInfo(subpath);
        }

        public IDirectoryContents GetDirectoryContents(string subpath) => throw new NotSupportedException();
        public Microsoft.Extensions.Primitives.IChangeToken Watch(string filter) => throw new NotSupportedException();
    }

    private sealed class InMemoryFile : IFileInfo
    {
        private readonly byte[] _bytes;
        public InMemoryFile(string content) => _bytes = Encoding.UTF8.GetBytes(content);
        public bool Exists => true;
        public long Length => _bytes.Length;
        public string? PhysicalPath => null;
        public string Name => "file";
        public DateTimeOffset LastModified => DateTimeOffset.UtcNow;
        public bool IsDirectory => false;
        public Stream CreateReadStream() => new MemoryStream(_bytes);
    }

    [Fact]
    public void GetIntegrityHash_ExistingFile_ReturnsRealSha384Hash()
    {
        var service = CreateService(new() { ["js/main.js"] = "console.log('hi');" });

        var hash = service.GetIntegrityHash("js/main.js");

        var expectedBytes = SHA384.HashData(Encoding.UTF8.GetBytes("console.log('hi');"));
        var expected = "sha384-" + Convert.ToBase64String(expectedBytes);
        Assert.Equal(expected, hash);
    }

    [Fact]
    public void GetIntegrityHash_MissingFile_ReturnsNull()
    {
        var service = CreateService(new());

        Assert.Null(service.GetIntegrityHash("js/does-not-exist.js"));
    }

    [Fact]
    public void GetIntegrityHash_LeadingSlash_ResolvesSamePathAsWithout()
    {
        var service = CreateService(new() { ["js/main.js"] = "x" });

        Assert.Equal(service.GetIntegrityHash("js/main.js"), service.GetIntegrityHash("/js/main.js"));
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName, string attrName, string attrValue, bool ltIntegrity = true)
    {
        var attributes = new TagHelperAttributeList { { attrName, attrValue } };
        if (ltIntegrity)
        {
            attributes.Add("lt-integrity", "true");
        }

        var context = new TagHelperContext(attributes, new Dictionary<object, object>(), Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput(tagName, new TagHelperAttributeList(attributes),
            (useCachedResult, encoder) => System.Threading.Tasks.Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));
        return (context, output);
    }

    [Fact]
    public void Process_ScriptTag_SetsIntegrityAndCrossorigin()
    {
        var service = CreateService(new() { ["js/main.js"] = "content" });
        var helper = new AssetIntegrityTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("script", "src", "/js/main.js");

        helper.Process(context, output);

        Assert.NotNull(output.Attributes["integrity"]);
        Assert.Equal("sha384-", output.Attributes["integrity"]!.Value.ToString()!.Substring(0, 7));
        Assert.Equal("anonymous", output.Attributes["crossorigin"]!.Value);
        Assert.Null(output.Attributes["lt-integrity"]);
    }

    [Fact]
    public void Process_StripsAspAppendVersionQueryString_BeforeResolvingFile()
    {
        var service = CreateService(new() { ["js/main.js"] = "content" });
        var helper = new AssetIntegrityTagHelper(service) { Enabled = true };
        // Simulates asp-append-version already having rewritten the url before this TagHelper runs.
        var (context, output) = CreateTagHelperContext("script", "src", "/js/main.js?v=abc123");

        helper.Process(context, output);

        Assert.NotNull(output.Attributes["integrity"]);
    }

    [Fact]
    public void Process_LinkTag_UsesHrefAttribute()
    {
        var service = CreateService(new() { ["css/site.css"] = "body{}" });
        var helper = new AssetIntegrityTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("link", "href", "/css/site.css");

        helper.Process(context, output);

        Assert.NotNull(output.Attributes["integrity"]);
    }

    [Fact]
    public void Process_MissingFile_LeavesTagWithoutIntegrityAttribute()
    {
        var service = CreateService(new());
        var helper = new AssetIntegrityTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("script", "src", "/js/does-not-exist.js");

        helper.Process(context, output);

        Assert.Null(output.Attributes["integrity"]);
    }

    [Fact]
    public void Process_CrossOriginUrl_IsLeftAlone()
    {
        var service = CreateService(new());
        var helper = new AssetIntegrityTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("script", "src", "https://cdn.example.com/lib.js");

        helper.Process(context, output);

        Assert.Null(output.Attributes["integrity"]);
    }

    [Fact]
    public void Process_Disabled_SkipsEntirely()
    {
        var service = CreateService(new() { ["js/main.js"] = "content" });
        var helper = new AssetIntegrityTagHelper(service) { Enabled = false };
        var (context, output) = CreateTagHelperContext("script", "src", "/js/main.js");

        helper.Process(context, output);

        Assert.Null(output.Attributes["integrity"]);
    }
}
