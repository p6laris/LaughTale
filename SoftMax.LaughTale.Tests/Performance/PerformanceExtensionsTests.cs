using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SoftMax.LaughTale.Components.TagHelpers;
using SoftMax.LaughTale.Core.Performance;
using Xunit;

namespace SoftMax.LaughTale.Tests.Performance
{
    public class PerformanceExtensionsTests
    {
        [Fact]
        public void AddLaughTaleCompression_RegistersCompressionProvidersAndMimeTypes()
        {
            var services = new ServiceCollection();
            services.AddLaughTaleCompression();

            var provider = services.BuildServiceProvider();
            var options = provider.GetRequiredService<IOptions<ResponseCompressionOptions>>().Value;

            Assert.True(options.EnableForHttps);
            Assert.Contains("application/javascript", options.MimeTypes);
            Assert.Contains("image/svg+xml", options.MimeTypes);
            Assert.Contains("text/css", options.MimeTypes);
            Assert.Equal(2, options.Providers.Count);
        }

        [Fact]
        public void PreloadTagHelper_RendersModulePreloadLinkForIsland()
        {
            var tagHelper = new PreloadTagHelper
            {
                Island = "counter"
            };

            var context = new TagHelperContext(
                new TagHelperAttributeList(),
                new System.Collections.Generic.Dictionary<object, object>(),
                Guid.NewGuid().ToString("N"));

            var output = new TagHelperOutput(
                "laughtale-preload",
                new TagHelperAttributeList(),
                (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

            tagHelper.Process(context, output);

            Assert.Equal("link", output.TagName);
            Assert.Equal("modulepreload", output.Attributes["rel"].Value);
            Assert.Equal("/dist/counter.js", output.Attributes["href"].Value);
        }

        [Fact]
        public void PreloadTagHelper_SupportsCustomHrefAndRel()
        {
            var tagHelper = new PreloadTagHelper
            {
                Href = "/icons/lucide-sprites.svg",
                Rel = "preload",
                As = "image"
            };

            var context = new TagHelperContext(
                new TagHelperAttributeList(),
                new System.Collections.Generic.Dictionary<object, object>(),
                Guid.NewGuid().ToString("N"));

            var output = new TagHelperOutput(
                "lt-preload",
                new TagHelperAttributeList(),
                (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

            tagHelper.Process(context, output);

            Assert.Equal("link", output.TagName);
            Assert.Equal("preload", output.Attributes["rel"].Value);
            Assert.Equal("/icons/lucide-sprites.svg", output.Attributes["href"].Value);
            Assert.Equal("image", output.Attributes["as"].Value);
        }
    }
}
