using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Models;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise Tabs Component Container TagHelper (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-tabs", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tabs", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTabsTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "0";

    [HtmlAttributeName("scrollable")]
    public bool Scrollable { get; set; } = false;

    [HtmlAttributeName("select-on-focus")]
    public bool SelectOnFocus { get; set; } = false;

    [HtmlAttributeName("lazy")]
    public bool Lazy { get; set; } = false;

    [HtmlAttributeName("tabs")]
    public List<TabItem>? Tabs { get; set; }

    [HtmlAttributeName("active-index")]
    public int ActiveIndex { get; set; } = 0;

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var baseClass = "p-tabs p-component";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        output.Attributes.SetAttribute("data-island", "tabs");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("data-value", Value);
        if (Scrollable) output.Attributes.SetAttribute("data-scrollable", "true");
        if (SelectOnFocus) output.Attributes.SetAttribute("data-select-on-focus", "true");
        if (Lazy) output.Attributes.SetAttribute("data-lazy", "true");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var props = new
        {
            value = Value,
            scrollable = Scrollable,
            selectOnFocus = SelectOnFocus,
            lazy = Lazy,
            tabs = Tabs,
            activeIndex = ActiveIndex,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent(childContent.GetContent());
        }
        else if (Tabs != null && Tabs.Count > 0)
        {
            var tabHeaders = new List<string>();
            var tabPanels = new List<string>();

            for (int i = 0; i < Tabs.Count; i++)
            {
                var tab = Tabs[i];
                var tabVal = string.IsNullOrWhiteSpace(tab.Id) ? i.ToString() : tab.Id;
                var isActive = i == ActiveIndex || tabVal == Value;
                var activeClass = isActive ? " p-tab-active" : "";
                var disabledAttr = tab.Disabled ? " disabled aria-disabled=\"true\"" : "";
                var iconHtml = string.IsNullOrEmpty(tab.Icon) ? "" : "<span class=\"p-tab-icon\">" + tab.Icon + "</span>";

                tabHeaders.Add("<button type=\"button\" class=\"p-tab" + activeClass + "\" role=\"tab\" data-value=\"" + tabVal + "\" value=\"" + tabVal + "\" aria-selected=\"" + (isActive ? "true" : "false") + "\"" + disabledAttr + ">" + iconHtml + "<span class=\"p-tab-title\">" + tab.Header + "</span></button>");

                var panelActiveClass = isActive ? " p-tabpanel-active" : "";
                tabPanels.Add("<div class=\"p-tabpanel" + panelActiveClass + "\" role=\"tabpanel\" data-value=\"" + tabVal + "\" value=\"" + tabVal + "\">" + tab.Content + "</div>");
            }

            var html = "<div class=\"p-tablist\" role=\"tablist\"><div class=\"p-tablist-content\"><ul class=\"p-tablist-tab-list\">" + string.Join("\n", tabHeaders) + "</ul></div></div><div class=\"p-tabpanels\">" + string.Join("\n", tabPanels) + "</div>";
            output.Content.SetHtmlContent(html);
        }
    }
}

/// <summary>
/// TagHelper for <island-tablist> / <p-tablist>
/// </summary>
[HtmlTargetElement("island-tablist", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-tab-list", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tablist", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tab-list", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTabListTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "tablist");

        var baseClass = "p-tablist";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        if (innerHtml.Contains("p-tablist-content"))
        {
            output.Content.SetHtmlContent(innerHtml);
        }
        else
        {
            output.Content.SetHtmlContent("<div class=\"p-tablist-content\"><ul class=\"p-tablist-tab-list\">" + innerHtml + "</ul></div>");
        }
    }
}

/// <summary>
/// TagHelper for <island-tab> / <p-tab>
/// </summary>
[HtmlTargetElement("island-tab", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tab", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTabTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "0";

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("as")]
    public string As { get; set; } = "button";

    [HtmlAttributeName("as-child")]
    public bool AsChild { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = As;
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "tab");
        output.Attributes.SetAttribute("data-value", Value);
        output.Attributes.SetAttribute("value", Value);
        if (As == "button") output.Attributes.SetAttribute("type", "button");
        if (Disabled)
        {
            output.Attributes.SetAttribute("disabled", "disabled");
            output.Attributes.SetAttribute("aria-disabled", "true");
        }

        var baseClass = "p-tab";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

/// <summary>
/// TagHelper for <island-tabpanels> / <p-tabpanels>
/// </summary>
[HtmlTargetElement("island-tabpanels", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-tab-panels", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tabpanels", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tab-panels", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTabPanelsTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var baseClass = "p-tabpanels";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

/// <summary>
/// TagHelper for <island-tabpanel> / <p-tabpanel>
/// </summary>
[HtmlTargetElement("island-tabpanel", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-tab-panel", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tabpanel", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-tab-panel", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTabPanelTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "0";

    [HtmlAttributeName("lazy")]
    public bool Lazy { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "tabpanel");
        output.Attributes.SetAttribute("data-value", Value);
        output.Attributes.SetAttribute("value", Value);

        var baseClass = "p-tabpanel";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}
