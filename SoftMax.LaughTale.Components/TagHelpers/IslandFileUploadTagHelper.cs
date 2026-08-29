using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-fileupload />, <p-fileupload />, and <island-file-upload />
/// PrimeVue 4 Aura Design System compliant advanced file uploader component.
/// </summary>
[HtmlTargetElement("island-fileupload")]
[HtmlTargetElement("island-file-upload")]
[HtmlTargetElement("p-fileupload")]
public class IslandFileUploadTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string Id { get; set; } = $"fileupload-{Guid.NewGuid():N}";

    [HtmlAttributeName("mode")]
    public string Mode { get; set; } = "basic";

    [HtmlAttributeName("name")]
    public string Name { get; set; } = "demo[]";

    [HtmlAttributeName("url")]
    public string? Url { get; set; }

    [HtmlAttributeName("accept")]
    public string Accept { get; set; } = "*/*";

    [HtmlAttributeName("max-file-size")]
    public long MaxFileSize { get; set; } = 1000000;

    [HtmlAttributeName("multiple")]
    public bool Multiple { get; set; } = false;

    [HtmlAttributeName("auto")]
    public bool Auto { get; set; } = false;

    [HtmlAttributeName("custom-upload")]
    public bool CustomUpload { get; set; } = false;

    [HtmlAttributeName("choose-label")]
    public string ChooseLabel { get; set; } = "Choose";

    [HtmlAttributeName("upload-label")]
    public string UploadLabel { get; set; } = "Upload";

    [HtmlAttributeName("cancel-label")]
    public string CancelLabel { get; set; } = "Cancel";

    [HtmlAttributeName("preview-images")]
    public bool PreviewImages { get; set; } = false;

    [HtmlAttributeName("empty-title")]
    public string? EmptyTitle { get; set; }

    [HtmlAttributeName("empty-subtitle")]
    public string? EmptySubtitle { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("id", Id);
        output.Attributes.SetAttribute("data-island", "fileupload");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        var cleanMode = (Mode ?? "basic").ToLowerInvariant().Trim();

        var props = new
        {
            id = Id,
            mode = cleanMode,
            name = Name,
            url = Url,
            accept = Accept,
            maxFileSize = MaxFileSize,
            multiple = Multiple,
            auto = Auto,
            customUpload = CustomUpload,
            chooseLabel = ChooseLabel,
            uploadLabel = UploadLabel,
            cancelLabel = CancelLabel,
            previewImages = PreviewImages,
            emptyTitle = EmptyTitle,
            emptySubtitle = EmptySubtitle
        };

        output.Attributes.SetAttribute("data-props", JsonSerializer.Serialize(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent(childContent.GetContent());
        }
    }
}
