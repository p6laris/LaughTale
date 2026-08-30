using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Core.TagHelpers;

/// <summary>
/// Provides Visual Studio, Rider, and Razor compiler Intellisense for LaughTale Declarative Directives.
/// </summary>
[HtmlTargetElement("*", Attributes = "l-state")]
[HtmlTargetElement("*", Attributes = "l-bind")]
[HtmlTargetElement("*", Attributes = "l-model")]
[HtmlTargetElement("*", Attributes = "l-show")]
[HtmlTargetElement("*", Attributes = "l-hide")]
[HtmlTargetElement("*", Attributes = "l-class")]
[HtmlTargetElement("*", Attributes = "l-style")]
[HtmlTargetElement("*", Attributes = "l-get")]
[HtmlTargetElement("*", Attributes = "l-post")]
[HtmlTargetElement("*", Attributes = "l-put")]
[HtmlTargetElement("*", Attributes = "l-delete")]
[HtmlTargetElement("*", Attributes = "l-target")]
[HtmlTargetElement("*", Attributes = "l-swap")]
[HtmlTargetElement("*", Attributes = "l-trigger")]
[HtmlTargetElement("*", Attributes = "l-indicator")]
[HtmlTargetElement("*", Attributes = "l-mask")]
[HtmlTargetElement("*", Attributes = "l-copy")]
[HtmlTargetElement("*", Attributes = "l-feedback")]
[HtmlTargetElement("*", Attributes = "l-toggle")]
[HtmlTargetElement("*", Attributes = "l-emit")]
public class LaughTaleDirectiveTagHelper : TagHelper
{
    [HtmlAttributeName("l-state")]
    public string? State { get; set; }

    [HtmlAttributeName("l-bind")]
    public string? Bind { get; set; }

    [HtmlAttributeName("l-model")]
    public string? Model { get; set; }

    [HtmlAttributeName("l-show")]
    public string? Show { get; set; }

    [HtmlAttributeName("l-hide")]
    public string? Hide { get; set; }

    [HtmlAttributeName("l-class")]
    public string? ClassName { get; set; }

    [HtmlAttributeName("l-style")]
    public string? StyleBinding { get; set; }

    [HtmlAttributeName("l-get")]
    public string? Get { get; set; }

    [HtmlAttributeName("l-post")]
    public string? Post { get; set; }

    [HtmlAttributeName("l-put")]
    public string? Put { get; set; }

    [HtmlAttributeName("l-delete")]
    public string? Delete { get; set; }

    [HtmlAttributeName("l-target")]
    public string? Target { get; set; }

    [HtmlAttributeName("l-swap")]
    public string? Swap { get; set; }

    [HtmlAttributeName("l-trigger")]
    public string? Trigger { get; set; }

    [HtmlAttributeName("l-indicator")]
    public string? Indicator { get; set; }

    [HtmlAttributeName("l-mask")]
    public string? Mask { get; set; }

    [HtmlAttributeName("l-copy")]
    public string? Copy { get; set; }

    [HtmlAttributeName("l-feedback")]
    public string? Feedback { get; set; }

    [HtmlAttributeName("l-toggle")]
    public string? Toggle { get; set; }

    [HtmlAttributeName("l-emit")]
    public string? Emit { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Directives are parsed client-side; TagHelper enables full IDE Intellisense and C# compilation passes.
    }
}
