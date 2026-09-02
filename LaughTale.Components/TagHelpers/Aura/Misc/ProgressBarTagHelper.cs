using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Misc;

/// <summary>
/// LaughTale: Aura ProgressBar TagHelper (<island-progress-bar> and <p-progressbar>).
/// </summary>
[HtmlTargetElement("island-progress-bar")]
[HtmlTargetElement("p-progressbar")]
public class ProgressBarTagHelper : IslandTagHelperBase
{
    public override string IslandName => "progress-bar";

    [HtmlAttributeName("value")]
    public double? Value { get; set; }

    [HtmlAttributeName("mode")]
    public string Mode { get; set; } = "determinate";

    [HtmlAttributeName("show-value")]
    public bool ShowValue { get; set; } = true;

    [HtmlAttributeName("height")]
    public string? Height { get; set; }

    [HtmlAttributeName("color")]
    public string? Color { get; set; }

    [HtmlAttributeName("unit")]
    public string Unit { get; set; } = "%";

    protected override object? BuildProps()
    {
        return new
        {
            value = Value,
            mode = Mode,
            showValue = ShowValue,
            height = Height,
            color = Color,
            unit = Unit,
            @class = Class,
            style = Style,
            id = Id
        };
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        await base.ProcessAsync(context, output);

        var isIndeterminate = Mode.Equals("indeterminate", System.StringComparison.OrdinalIgnoreCase) || !Value.HasValue;
        var val = System.Math.Clamp(Value ?? 0, 0, 100);
        var resolvedHeight = !string.IsNullOrWhiteSpace(Height) ? Height : (ShowValue && !isIndeterminate ? "1.25rem" : "0.5rem");

        var customStyle = !string.IsNullOrWhiteSpace(Style) ? Style : "";
        var heightStyle = $"height: {resolvedHeight};";
        var combinedStyle = string.Join(" ", new[] { heightStyle, customStyle }.Where(s => !string.IsNullOrWhiteSpace(s)));

        output.Attributes.RemoveAll("style");
        output.Attributes.SetAttribute("style", "display: contents;");

        var valueStyle = $"width: {val}%;" + (!string.IsNullOrWhiteSpace(Color) ? $" background: {Color};" : "");

        if (isIndeterminate)
        {
            output.Content.SetHtmlContent($@"
                <div class=""p-progressbar p-component p-progressbar-indeterminate {Class}"" role=""progressbar"" aria-valuemin=""0"" aria-valuemax=""100"" style=""{combinedStyle}"">
                    <div class=""p-progressbar-indeterminate-container"">
                        <div class=""p-progressbar-value p-progressbar-value-animate"" style=""{(!string.IsNullOrWhiteSpace(Color) ? $"background: {Color};" : "")}""></div>
                    </div>
                </div>
            ");
        }
        else
        {
            var labelHtml = ShowValue
                ? $@"<div class=""p-progressbar-label"">{val}{Unit}</div>"
                : "";

            output.Content.SetHtmlContent($@"
                <div class=""p-progressbar p-component {Class}"" role=""progressbar"" aria-valuemin=""0"" aria-valuemax=""100"" aria-valuenow=""{val}"" style=""{combinedStyle}"">
                    <div class=""p-progressbar-value p-progressbar-value-animate"" style=""{valueStyle}"">
                        {labelHtml}
                    </div>
                </div>
            ");
        }
    }
}
