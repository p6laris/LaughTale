using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using LaughTale.Core.Assets;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Assets;

/// <summary>
/// ROADMAP.v5.md Part H "image optimization": ImageDimensionService resolves a real image's
/// width/height from a fake wwwroot (matching AssetIntegrityTests's own precedent), and
/// ImageOptimizationTagHelper wires that into a plain &lt;img lt-optimize&gt; tag correctly -
/// auto-stamping width/height, defaulting loading="lazy", and never overriding an author-supplied
/// width/height/loading.
/// </summary>
[Collection(LaughTale.Tests.LaughTaleEnvironmentCollection.Name)]
public class ImageOptimizationTagHelperTests : IDisposable
{
    // A real 2x3 PNG (System.Drawing-encoded, hand-verified via ImageDimensionReaderTests already) -
    // reused here as raw bytes so this suite doesn't depend on a file on disk.
    private static readonly byte[] TinyPng = Convert.FromBase64String(
        "iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAYAAAC56t6BAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAALSURBVBhXY2DACQAAGwABGrcpYwAAAABJRU5ErkJggg==");

    public ImageOptimizationTagHelperTests()
    {
        LaughTaleEnvironment.SetDevelopment(false);
    }

    public void Dispose()
    {
        LaughTaleEnvironment.SetDevelopment(null);
    }

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

    private sealed class InMemoryFileProvider : IFileProvider
    {
        private readonly Dictionary<string, byte[]> _files;
        public InMemoryFileProvider(Dictionary<string, byte[]> files) => _files = files;

        public IFileInfo GetFileInfo(string subpath)
        {
            var key = subpath.TrimStart('/');
            return _files.TryGetValue(key, out var bytes) ? new InMemoryFile(bytes) : new NotFoundFileInfo(subpath);
        }

        public IDirectoryContents GetDirectoryContents(string subpath) => throw new NotSupportedException();
        public Microsoft.Extensions.Primitives.IChangeToken Watch(string filter) => throw new NotSupportedException();
    }

    private sealed class InMemoryFile : IFileInfo
    {
        private readonly byte[] _bytes;
        public InMemoryFile(byte[] bytes) => _bytes = bytes;
        public bool Exists => true;
        public long Length => _bytes.Length;
        public string? PhysicalPath => null;
        public string Name => "file";
        public DateTimeOffset LastModified => DateTimeOffset.UtcNow;
        public bool IsDirectory => false;
        public Stream CreateReadStream() => new MemoryStream(_bytes);
    }

    private static IImageDimensionService CreateService(Dictionary<string, byte[]> files)
    {
        var provider = new InMemoryFileProvider(files);
        var services = new ServiceCollection();
        services.AddSingleton<IWebHostEnvironment>(new FakeWebHostEnvironment(provider));
        services.AddLaughTaleImageOptimization();
        return services.BuildServiceProvider().GetRequiredService<IImageDimensionService>();
    }

    [Fact]
    public void GetDimensions_RealPng_ReturnsRealWidthAndHeight()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });

        Assert.Equal((2, 3), service.GetDimensions("images/dot.png"));
    }

    [Fact]
    public void GetDimensions_MissingFile_ReturnsNull()
    {
        var service = CreateService(new());

        Assert.Null(service.GetDimensions("images/does-not-exist.png"));
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(
        string src, string? alt = "a picture", string? width = null, string? height = null, string? loading = null, bool priority = false)
    {
        var attributes = new TagHelperAttributeList { { "src", src } };
        if (alt != null) attributes.Add("alt", alt);
        if (width != null) attributes.Add("width", width);
        if (height != null) attributes.Add("height", height);
        if (loading != null) attributes.Add("loading", loading);
        attributes.Add("lt-optimize", "true");
        if (priority) attributes.Add("lt-priority", "true");

        var context = new TagHelperContext(attributes, new Dictionary<object, object>(), Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput("img", new TagHelperAttributeList(attributes),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));
        return (context, output);
    }

    [Fact]
    public void Process_LocalImage_StampsRealWidthAndHeight()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png");

        helper.Process(context, output);

        Assert.Equal("2", output.Attributes["width"]!.Value);
        Assert.Equal("3", output.Attributes["height"]!.Value);
    }

    [Fact]
    public void Process_DefaultsToLazyLoading()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png");

        helper.Process(context, output);

        Assert.Equal("lazy", output.Attributes["loading"]!.Value);
    }

    [Fact]
    public void Process_Priority_UsesEagerLoadingAndHighFetchPriority()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true, Priority = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png", priority: true);

        helper.Process(context, output);

        Assert.Equal("eager", output.Attributes["loading"]!.Value);
        Assert.Equal("high", output.Attributes["fetchpriority"]!.Value);
    }

    [Fact]
    public void Process_AuthorSuppliedWidthHeight_AreNeverOverwritten()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png", width: "999", height: "888");

        helper.Process(context, output);

        Assert.Equal("999", output.Attributes["width"]!.Value);
        Assert.Equal("888", output.Attributes["height"]!.Value);
    }

    [Fact]
    public void Process_AuthorSuppliedLoading_IsNeverOverwritten()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png", loading: "eager");

        helper.Process(context, output);

        Assert.Equal("eager", output.Attributes["loading"]!.Value);
    }

    [Fact]
    public void Process_RemoteUrl_SkipsDimensionLookup_ButStillDefaultsLazy()
    {
        var service = CreateService(new());
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("https://images.example.com/photo.jpg");

        helper.Process(context, output);

        Assert.Null(output.Attributes["width"]);
        Assert.Null(output.Attributes["height"]);
        Assert.Equal("lazy", output.Attributes["loading"]!.Value);
    }

    [Fact]
    public void Process_MissingLocalFile_LeavesWidthHeightUnset_NoException()
    {
        var service = CreateService(new());
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/does-not-exist.png");

        var ex = Record.Exception(() => helper.Process(context, output));

        Assert.Null(ex);
        Assert.Null(output.Attributes["width"]);
    }

    [Fact]
    public void Process_Disabled_SkipsEntirely()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = false };
        var (context, output) = CreateTagHelperContext("/images/dot.png");

        helper.Process(context, output);

        Assert.Null(output.Attributes["width"]);
        Assert.Null(output.Attributes["loading"]);
    }

    [Fact]
    public void Process_RemovesItsOwnAttributes_FromFinalOutput()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png");

        helper.Process(context, output);

        Assert.Null(output.Attributes["lt-optimize"]);
        Assert.Null(output.Attributes["lt-priority"]);
    }

    [Fact]
    public void Process_MissingAlt_InDevelopment_AddsWarningAttribute()
    {
        LaughTaleEnvironment.SetDevelopment(true);
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png", alt: null);

        helper.Process(context, output);

        Assert.NotNull(output.Attributes["data-laughtale-warning-alt"]);
    }

    [Fact]
    public void Process_MissingAlt_InProduction_NoWarningAttribute()
    {
        var service = CreateService(new() { ["images/dot.png"] = TinyPng });
        var helper = new ImageOptimizationTagHelper(service) { Enabled = true };
        var (context, output) = CreateTagHelperContext("/images/dot.png", alt: null);

        helper.Process(context, output);

        Assert.Null(output.Attributes["data-laughtale-warning-alt"]);
    }
}
