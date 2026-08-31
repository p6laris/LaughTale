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
/// TagHelper for <island-drawer /> and <p-drawer />
/// LaughTale Aura Design System edge overlay drawer component.
/// </summary>
[HtmlTargetElement("island-drawer")]
[HtmlTargetElement("p-drawer")]
public class IslandDrawerTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string Id { get; set; } = $"drawer-{System.Guid.NewGuid():N}";

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("title")]
    public string? Title { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "left";

    [HtmlAttributeName("visible")]
    public bool Visible { get; set; } = false;

    [HtmlAttributeName("modal")]
    public bool Modal { get; set; } = true;

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = true;

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    [HtmlAttributeName("drawer-width")]
    public string? DrawerWidth { get; set; }

    [HtmlAttributeName("drawer-height")]
    public string? DrawerHeight { get; set; }

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
        output.Attributes.SetAttribute("data-island", "drawer");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("style", "display: contents;");

        var displayHeader = Header ?? Title;
        var cleanPos = (Position ?? "left").ToLowerInvariant().Trim();
        if (cleanPos != "left" && cleanPos != "right" && cleanPos != "top" && cleanPos != "bottom" && cleanPos != "full")
        {
            cleanPos = "left";
        }

        var props = new
        {
            id = Id,
            header = displayHeader,
            position = cleanPos,
            visible = Visible,
            modal = Modal,
            dismissableMask = DismissableMask,
            closable = Closable,
            closeOnEscape = CloseOnEscape,
            width = DrawerWidth,
            height = DrawerHeight
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        var maskClasses = $"p-drawer-mask p-drawer-{cleanPos}";
        if (Modal) maskClasses += " p-drawer-mask-modal";
        if (Visible) maskClasses += " p-drawer-mask-active";

        var drawerStyle = "";
        if (!string.IsNullOrWhiteSpace(DrawerWidth)) drawerStyle += $"width: {DrawerWidth};";
        if (!string.IsNullOrWhiteSpace(DrawerHeight)) drawerStyle += $"height: {DrawerHeight};";
        if (!string.IsNullOrWhiteSpace(Style)) drawerStyle += $" {Style}";

        var childContent = await output.GetChildContentAsync();

        var headerCloseButton = Closable ? @"
            <button type=""button"" class=""p-drawer-close-button"" aria-label=""Close"">
                <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""18"" y1=""6"" x2=""6"" y2=""18""/><line x1=""6"" y1=""6"" x2=""18"" y2=""18""/></svg>
            </button>" : "";

        var headerHtml = !string.IsNullOrWhiteSpace(displayHeader) ? $@"
            <div class=""p-drawer-header"">
                <h3 class=""p-drawer-title"">{displayHeader}</h3>
                <div class=""p-drawer-header-actions"">
                    {headerCloseButton}
                </div>
            </div>" : "";

        var drawerClasses = "p-drawer p-component";
        if (!string.IsNullOrWhiteSpace(Class)) drawerClasses += $" {Class}";

        output.Content.SetHtmlContent($@"
            <div class=""{maskClasses}"">
                <div class=""{drawerClasses}"" role=""complementary"" aria-modal=""{Modal.ToString().ToLowerInvariant()}"" style=""{drawerStyle}"">
                    {headerHtml}
                    {childContent.GetContent()}
                </div>
            </div>
        ");
    }
}

/// <summary>
/// TagHelper for <island-confirm-popup />
/// </summary>
[HtmlTargetElement("island-confirm-popup")]
public class IslandConfirmPopupTagHelper : TagHelper
{
    public string TargetSelector { get; set; } = string.Empty;
    public string Message { get; set; } = "Are you sure you want to proceed?";
    public string AcceptText { get; set; } = "Confirm";
    public string RejectText { get; set; } = "Cancel";
    public string? ActionName { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "confirm-popup");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetSelector = TargetSelector,
            message = Message,
            acceptText = AcceptText,
            rejectText = RejectText,
            actionName = ActionName
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-popover />, <p-popover />, and <p-overlay-panel />
/// LaughTale Aura Design System anchored floating popover container.
/// </summary>
[HtmlTargetElement("island-popover")]
[HtmlTargetElement("p-popover")]
[HtmlTargetElement("p-overlay-panel")]
public class IslandPopoverTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string Id { get; set; } = $"popover-{System.Guid.NewGuid():N}";

    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("placement")]
    public string Placement { get; set; } = "bottom";

    [HtmlAttributeName("show-arrow")]
    public bool ShowArrow { get; set; } = true;

    [HtmlAttributeName("dismissable")]
    public bool Dismissable { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

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
        output.Attributes.SetAttribute("data-island", "popover");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("style", "display: contents;");

        var effectiveTarget = Target ?? TriggerId;
        var cleanPlacement = (Placement ?? "bottom").ToLowerInvariant().Trim();

        var props = new
        {
            id = Id,
            target = effectiveTarget,
            placement = cleanPlacement,
            showArrow = ShowArrow,
            dismissable = Dismissable,
            closeOnEscape = CloseOnEscape
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        var popoverClasses = "p-popover p-component";
        if (!string.IsNullOrWhiteSpace(Class)) popoverClasses += $" {Class}";

        var arrowHtml = ShowArrow ? @"<div class=""p-popover-arrow p-popover-arrow-top""></div>" : "";
        var childContent = await output.GetChildContentAsync();

        var popoverStyle = !string.IsNullOrWhiteSpace(Style) ? $" style=\"{Style}\"" : "";

        output.Content.SetHtmlContent($@"
            <div class=""{popoverClasses}"" role=""dialog"" aria-modal=""false""{popoverStyle}>
                {arrowHtml}
                <div class=""p-popover-content"">
                    {childContent.GetContent()}
                </div>
            </div>
        ");
    }
}

/// <summary>
/// TagHelper for <island-tooltip /> and <p-tooltip />
/// LaughTale Aura Design System advisory tooltip component.
/// </summary>
[HtmlTargetElement("island-tooltip")]
[HtmlTargetElement("p-tooltip")]
public class IslandTooltipTagHelper : TagHelper
{
    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("text")]
    public string? Text { get; set; }

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "top";

    [HtmlAttributeName("show-delay")]
    public int ShowDelay { get; set; } = 0;

    [HtmlAttributeName("hide-delay")]
    public int HideDelay { get; set; } = 0;

    [HtmlAttributeName("event")]
    public string Event { get; set; } = "hover";

    [HtmlAttributeName("auto-hide")]
    public bool AutoHide { get; set; } = true;

    [HtmlAttributeName("escape")]
    public bool Escape { get; set; } = true;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var childContent = await output.GetChildContentAsync();
        var content = childContent.GetContent();
        var effectiveText = Value ?? Text;

        if (!string.IsNullOrWhiteSpace(Target))
        {
            output.TagName = "div";
            output.TagMode = TagMode.StartTagAndEndTag;
            output.Attributes.SetAttribute("data-island", "tooltip-component");
            output.Attributes.SetAttribute("data-hydrate", "load");
            output.Attributes.SetAttribute("style", "display: none;");

            var props = new
            {
                target = Target,
                value = effectiveText ?? content,
                position = Position,
                showDelay = ShowDelay,
                hideDelay = HideDelay,
                @event = Event,
                autoHide = AutoHide,
                escape = Escape
            };
            output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
            output.Content.SetHtmlContent(content);
        }
        else
        {
            output.TagName = null;
            output.Content.SetHtmlContent(content);
        }
    }
}

/// <summary>
/// TagHelper for <island-sidebar />, <p-sidebar />, and <island-sidebar-layout />
/// LaughTale Aura Design System compound navigation panel system.
/// </summary>
[HtmlTargetElement("island-sidebar")]
[HtmlTargetElement("p-sidebar")]
[HtmlTargetElement("island-sidebar-layout")]
public class IslandSidebarTagHelper : TagHelper
{
    [HtmlAttributeName("variant")]
    public string Variant { get; set; } = "sidebar";

    [HtmlAttributeName("collapsible")]
    public string Collapsible { get; set; } = "icon";

    [HtmlAttributeName("side")]
    public string Side { get; set; } = "left";

    [HtmlAttributeName("overlay")]
    public bool Overlay { get; set; } = false;

    [HtmlAttributeName("open-on-hover")]
    public bool OpenOnHover { get; set; } = false;

    [HtmlAttributeName("backdrop")]
    public bool Backdrop { get; set; } = false;

    [HtmlAttributeName("open")]
    public bool Open { get; set; } = true;

    [HtmlAttributeName("width")]
    public string Width { get; set; } = "16rem";

    [HtmlAttributeName("icon-width")]
    public string IconWidth { get; set; } = "3.5rem";

    [HtmlAttributeName("demo-type")]
    public string DemoType { get; set; } = "variants";

    [HtmlAttributeName("groups")]
    public List<SidebarGroupModel>? Groups { get; set; }

    [HtmlAttributeName("items")]
    public List<SidebarItem>? Items { get; set; }

    [HtmlAttributeName("header-title")]
    public string? HeaderTitle { get; set; }

    [HtmlAttributeName("header-logo")]
    public string? HeaderLogo { get; set; }

    [HtmlAttributeName("header-color")]
    public string? HeaderColor { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "sidebar");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            variant = Variant,
            collapsible = Collapsible,
            side = Side,
            overlay = Overlay,
            openOnHover = OpenOnHover,
            backdrop = Backdrop,
            open = Open,
            width = Width,
            iconWidth = IconWidth,
            demoType = DemoType,
            groups = Groups,
            items = Items,
            headerTitle = HeaderTitle,
            headerLogo = HeaderLogo,
            headerColor = HeaderColor,
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
