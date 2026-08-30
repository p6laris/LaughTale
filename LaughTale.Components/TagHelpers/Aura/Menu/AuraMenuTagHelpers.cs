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
/// TagHelper for <island-breadcrumb /> and <p-breadcrumb />
/// PrimeVue 4 Aura Design System compliant hierarchical navigation component.
/// </summary>
[HtmlTargetElement("island-breadcrumb")]
[HtmlTargetElement("p-breadcrumb")]
public class IslandBreadcrumbTagHelper : TagHelper
{
    [HtmlAttributeName("items")]
    public List<BreadcrumbItem>? Items { get; set; }

    [HtmlAttributeName("home-url")]
    public string HomeUrl { get; set; } = "/";

    [HtmlAttributeName("home-icon")]
    public string? HomeIcon { get; set; }

    [HtmlAttributeName("home-label")]
    public string? HomeLabel { get; set; }

    [HtmlAttributeName("separator")]
    public string Separator { get; set; } = "chevron";

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "breadcrumb");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Items ?? new(),
            homeUrl = HomeUrl,
            homeIcon = HomeIcon,
            homeLabel = HomeLabel,
            separator = Separator
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
/// TagHelper for <island-speed-dial />
/// Floating action button with popup action items, compliant with Aura Design System.
/// </summary>
[HtmlTargetElement("island-speed-dial")]
public class IslandSpeedDialTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<SpeedDialAction> Model { get; set; } = new();

    [HtmlAttributeName("actions")]
    public List<SpeedDialAction> Actions { get; set; } = new();

    [HtmlAttributeName("direction")]
    public string Direction { get; set; } = "up";

    [HtmlAttributeName("type")]
    public string Type { get; set; } = "linear";

    [HtmlAttributeName("radius")]
    public int? Radius { get; set; }

    [HtmlAttributeName("transition-delay")]
    public int TransitionDelay { get; set; } = 30;

    [HtmlAttributeName("mask")]
    public bool Mask { get; set; } = false;

    [HtmlAttributeName("show-icon")]
    public string ShowIcon { get; set; } = "plus";

    [HtmlAttributeName("hide-icon")]
    public string HideIcon { get; set; } = "times";

    [HtmlAttributeName("rotate-animation")]
    public bool RotateAnimation { get; set; } = true;

    [HtmlAttributeName("button-props")]
    public SpeedDialButtonProps? ButtonProps { get; set; }

    [HtmlAttributeName("button-severity")]
    public string? ButtonSeverity { get; set; }

    [HtmlAttributeName("tooltip-options")]
    public SpeedDialTooltipOptions? TooltipOptions { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; } = "Speed Dial Options";

    [HtmlAttributeName("template")]
    public string? Template { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "speed-dial");
        output.Attributes.SetAttribute("data-hydrate", "load");

        if (context.AllAttributes.TryGetAttribute("mask", out var mAttr))
        {
            if (bool.TryParse(mAttr.Value?.ToString(), out var m)) Mask = m;
            else if (mAttr.Value != null) Mask = true;
        }

        var items = (Model != null && Model.Count > 0) ? Model : Actions;
        var btnProps = ButtonProps ?? new SpeedDialButtonProps(
            Severity: ButtonSeverity ?? "primary",
            Rounded: true,
            IconOnly: true
        );

        if (!string.IsNullOrEmpty(ButtonSeverity) && btnProps.Severity != ButtonSeverity)
        {
            btnProps = btnProps with { Severity = ButtonSeverity };
        }

        var props = new
        {
            model = items,
            direction = Direction,
            type = Type,
            radius = Radius,
            transitionDelay = TransitionDelay,
            mask = Mask,
            showIcon = ShowIcon,
            hideIcon = HideIcon,
            rotateAnimation = RotateAnimation,
            buttonProps = btnProps,
            tooltipOptions = TooltipOptions,
            ariaLabel = AriaLabel,
            template = Template
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-render
        var sev = (btnProps.Severity ?? "primary").ToLowerInvariant();
        var sevClass = sev != "primary" ? $"p-button-{sev}" : "p-button-primary";
        var roundedClass = btnProps.Rounded ? "p-button-rounded" : "";
        var iconOnlyClass = btnProps.IconOnly ? "p-button-icon-only" : "";
        var customClass = btnProps.StyleClass ?? "";

        var preRenderHtml = $@"
            <div class=""p-speeddial p-component p-speeddial-direction-{Direction} p-speeddial-{Type}"" style=""position: absolute;"">
                <button type=""button"" class=""p-speeddial-button p-button {sevClass} {roundedClass} {iconOnlyClass} {customClass}"" aria-haspopup=""true"" aria-expanded=""false"" aria-label=""{AriaLabel}"">
                    <span class=""p-speeddial-icon"">{LucideIcons.Get(ShowIcon ?? "plus", 20)}</span>
                </button>
            </div>";

        output.Content.SetHtmlContent(preRenderHtml);
    }
}

/// <summary>
/// TagHelper for <island-split-button /> / <island-splitbutton /> (Aura SplitButton)
/// </summary>
[HtmlTargetElement("island-split-button")]
[HtmlTargetElement("island-splitbutton")]
public class IslandSplitButtonTagHelper : TagHelper
{
    public string Label { get; set; } = "Save";
    public string? Icon { get; set; }
    public string? DropdownIcon { get; set; }
    public List<SplitButtonItem>? Model { get; set; }
    public ButtonSeverity Severity { get; set; } = ButtonSeverity.Primary;
    public bool Raised { get; set; } = false;
    public bool Rounded { get; set; } = false;
    public bool Text { get; set; } = false;
    public bool Outlined { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Disabled { get; set; } = false;
    public bool Fluid { get; set; } = false;
    public object? ButtonProps { get; set; }
    public object? MenuButtonProps { get; set; }
    public string? AppendTo { get; set; }
    public string? Action { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "split-button");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            label = Label,
            icon = Icon,
            dropdownIcon = DropdownIcon,
            model = Model ?? new(),
            severity = Severity.ToString().ToLowerInvariant(),
            raised = Raised,
            rounded = Rounded,
            text = Text,
            outlined = Outlined,
            size = Size.ToString().ToLowerInvariant(),
            disabled = Disabled,
            fluid = Fluid,
            buttonProps = ButtonProps,
            menuButtonProps = MenuButtonProps,
            appendTo = AppendTo,
            action = Action
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

// ─── Aura v2: New Components ────────────────────────────────────────────────

/// <summary>
/// TagHelper for <island-menubar />, <p-menubar />, and <island-menu-bar />
/// PrimeVue 4 Aura Design System compliant horizontal navigation menubar.
/// </summary>
[HtmlTargetElement("island-menubar")]
[HtmlTargetElement("p-menubar")]
[HtmlTargetElement("island-menu-bar")]
public class IslandMenubarTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "menubar");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            customTemplate = CustomTemplate,
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
/// TagHelper for <island-menu />, <p-menu />, and <island-navigation-menu />
/// PrimeVue 4 Aura Design System compliant navigation and command menu.
/// </summary>
[HtmlTargetElement("island-menu")]
[HtmlTargetElement("p-menu")]
[HtmlTargetElement("island-navigation-menu")]
public class IslandMenuTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("popup")]
    public bool Popup { get; set; } = false;

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("trigger-text")]
    public string? TriggerText { get; set; }

    [HtmlAttributeName("trigger-icon")]
    public string? TriggerIcon { get; set; }

    [HtmlAttributeName("trigger-variant")]
    public string? TriggerVariant { get; set; } = "outlined";

    [HtmlAttributeName("trigger-severity")]
    public string? TriggerSeverity { get; set; } = "secondary";

    [HtmlAttributeName("trigger-icon-only")]
    public bool TriggerIconOnly { get; set; } = false;

    [HtmlAttributeName("expanded-keys")]
    public Dictionary<string, bool>? ExpandedKeys { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "menu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            popup = Popup,
            triggerId = TriggerId,
            triggerText = TriggerText,
            triggerIcon = TriggerIcon,
            triggerVariant = TriggerVariant,
            triggerSeverity = TriggerSeverity,
            triggerIconOnly = TriggerIconOnly,
            expandedKeys = ExpandedKeys ?? new(),
            customTemplate = CustomTemplate,
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
/// TagHelper for <island-contextmenu />, <p-contextmenu />, and <island-context-menu />
/// PrimeVue 4 Aura Design System compliant overlay ContextMenu.
/// </summary>
[HtmlTargetElement("island-contextmenu")]
[HtmlTargetElement("p-contextmenu")]
[HtmlTargetElement("island-context-menu")]
public class IslandContextMenuTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("target-selector")]
    public string? TargetSelector { get; set; }

    [HtmlAttributeName("global")]
    public bool Global { get; set; } = false;

    [HtmlAttributeName("breakpoint")]
    public string Breakpoint { get; set; } = "960px";

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
        output.Attributes.SetAttribute("data-island", "contextmenu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            items = Items ?? Model ?? new(),
            target = Target ?? TargetSelector,
            targetSelector = TargetSelector ?? Target,
            global = Global,
            breakpoint = Breakpoint,
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
/// TagHelper for <island-tieredmenu />, <p-tieredmenu />, and <island-tiered-menu />
/// PrimeVue 4 Aura Design System compliant hierarchical tiered menu with flyout submenus.
/// </summary>
[HtmlTargetElement("island-tieredmenu")]
[HtmlTargetElement("p-tieredmenu")]
[HtmlTargetElement("island-tiered-menu")]
public class IslandTieredMenuTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("popup")]
    public bool Popup { get; set; } = false;

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("trigger-text")]
    public string? TriggerText { get; set; }

    [HtmlAttributeName("trigger-icon")]
    public string? TriggerIcon { get; set; }

    [HtmlAttributeName("trigger-variant")]
    public string? TriggerVariant { get; set; } = "outlined";

    [HtmlAttributeName("trigger-severity")]
    public string? TriggerSeverity { get; set; } = "primary";

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("breakpoint")]
    public string? Breakpoint { get; set; } = "960px";

    [HtmlAttributeName("auto-z-index")]
    public bool AutoZIndex { get; set; } = true;

    [HtmlAttributeName("base-z-index")]
    public int BaseZIndex { get; set; } = 0;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "tieredmenu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            popup = Popup,
            triggerId = TriggerId,
            triggerText = TriggerText,
            triggerIcon = TriggerIcon,
            triggerVariant = TriggerVariant,
            triggerSeverity = TriggerSeverity,
            customTemplate = CustomTemplate,
            breakpoint = Breakpoint,
            autoZIndex = AutoZIndex,
            baseZIndex = BaseZIndex,
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
/// TagHelper for <island-dock />
/// </summary>
[HtmlTargetElement("island-dock")]
public class IslandDockTagHelper : TagHelper
{
    public List<DockItem>? Items { get; set; }
    public string Position { get; set; } = "bottom";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "dock");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Items ?? new(),
            position = Position
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}
