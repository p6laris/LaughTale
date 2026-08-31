// ----------------------------------------------------------------------
//   Modularized Aura TagHelpers
// ----------------------------------------------------------------------

using LaughTale.Core.Serialization;
using LaughTale.Core.Enums;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Enums;
using LaughTale.Components.Models;
using LaughTale.Components.Icons;
using System.Text.Json;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-compare />, <p-compare />, and <island-image-compare />
/// LaughTale Aura Design System side-by-side comparison slider.
/// </summary>
[HtmlTargetElement("island-compare")]
[HtmlTargetElement("p-compare")]
[HtmlTargetElement("island-image-compare")]
public class IslandImageCompareTagHelper : TagHelper
{
    [HtmlAttributeName("model-value")]
    public double? ModelValue { get; set; }

    [HtmlAttributeName("value")]
    public double? Value { get; set; }

    [HtmlAttributeName("min")]
    public double Min { get; set; } = 0;

    [HtmlAttributeName("max")]
    public double Max { get; set; } = 100;

    [HtmlAttributeName("step")]
    public double Step { get; set; } = 1;

    [HtmlAttributeName("orientation")]
    public string Orientation { get; set; } = "horizontal";

    [HtmlAttributeName("slide-on-hover")]
    public bool SlideOnHover { get; set; } = false;

    [HtmlAttributeName("custom-handle")]
    public bool CustomHandle { get; set; } = false;

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("readonly")]
    public bool Readonly { get; set; } = false;

    [HtmlAttributeName("before-image")]
    public string? BeforeImage { get; set; }

    [HtmlAttributeName("after-image")]
    public string? AfterImage { get; set; }

    [HtmlAttributeName("before-label")]
    public string? BeforeLabel { get; set; }

    [HtmlAttributeName("after-label")]
    public string? AfterLabel { get; set; }

    [HtmlAttributeName("demo-type")]
    public string? DemoType { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "compare");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            modelValue = ModelValue ?? Value ?? 50,
            value = Value ?? ModelValue ?? 50,
            min = Min,
            max = Max,
            step = Step,
            orientation = Orientation,
            slideOnHover = SlideOnHover,
            customHandle = CustomHandle,
            disabled = Disabled,
            @readonly = Readonly,
            beforeImage = BeforeImage,
            afterImage = AfterImage,
            beforeLabel = BeforeLabel,
            afterLabel = AfterLabel,
            demoType = DemoType,
            ariaLabel = AriaLabel,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}

/// <summary>
/// TagHelper for <island-galleria />
/// </summary>
[HtmlTargetElement("island-galleria")]
public class IslandGalleriaTagHelper : TagHelper
{
    public List<GalleriaItem>? Value { get; set; }
    public bool AutoPlay { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "galleria");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value ?? new(),
            autoPlay = AutoPlay
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-carousel /> and <p-carousel /> — LaughTale Aura Content Slider
/// </summary>
[HtmlTargetElement("island-carousel")]
[HtmlTargetElement("p-carousel")]
public class IslandCarouselTagHelper : TagHelper
{
    public List<CarouselItem>? Items { get; set; }

    [HtmlAttributeName("align")]
    public string Align { get; set; } = "center";

    [HtmlAttributeName("orientation")]
    public string Orientation { get; set; } = "horizontal";

    [HtmlAttributeName("slides-per-page")]
    public double? SlidesPerPage { get; set; }

    [HtmlAttributeName("loop")]
    public bool Loop { get; set; } = false;

    [HtmlAttributeName("auto-size")]
    public bool AutoSize { get; set; } = false;

    [HtmlAttributeName("spacing")]
    public int Spacing { get; set; } = 16;

    [HtmlAttributeName("slide")]
    public int? Slide { get; set; }

    [HtmlAttributeName("num-visible")]
    public int NumVisible { get; set; } = 1;

    [HtmlAttributeName("num-scroll")]
    public int NumScroll { get; set; } = 1;

    [HtmlAttributeName("autoplay")]
    public bool Autoplay { get; set; } = false;

    [HtmlAttributeName("autoplay-interval")]
    public int AutoplayInterval { get; set; } = 5000;

    [HtmlAttributeName("circular")]
    public bool Circular { get; set; } = false;

    [HtmlAttributeName("show-indicators")]
    public bool ShowIndicators { get; set; } = true;

    [HtmlAttributeName("show-navigators")]
    public bool ShowNavigators { get; set; } = true;

    [HtmlAttributeName("demo-type")]
    public string? DemoType { get; set; }

    [HtmlAttributeName("gallery-images")]
    public List<string>? GalleryImages { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "carousel");
        output.Attributes.SetAttribute("data-hydrate", "visible");

        var props = new
        {
            items = Items,
            align = Align,
            orientation = Orientation,
            slidesPerPage = SlidesPerPage,
            loop = Loop,
            autoSize = AutoSize,
            spacing = Spacing,
            slide = Slide,
            numVisible = NumVisible,
            numScroll = NumScroll,
            autoplay = Autoplay,
            autoplayInterval = AutoplayInterval,
            circular = Circular,
            showIndicators = ShowIndicators,
            showNavigators = ShowNavigators,
            demoType = DemoType,
            galleryImages = GalleryImages,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}
