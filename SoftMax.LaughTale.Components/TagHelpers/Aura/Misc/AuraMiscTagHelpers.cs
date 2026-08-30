// ----------------------------------------------------------------------
//   Modularized Aura TagHelpers
// ----------------------------------------------------------------------

using SoftMax.LaughTale.Core.Serialization;
using SoftMax.LaughTale.Core.Enums;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Components.Icons;
using System.Text.Json;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-meter-group />
/// </summary>
[HtmlTargetElement("island-meter-group")]
public class IslandMeterGroupTagHelper : TagHelper
{
    public List<MeterValue> Values { get; set; } = new();
    public string? Title { get; set; }
    public bool InteractiveSize { get; set; } = false;
    public bool ShowLabels { get; set; } = true;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "meter-group");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            values = Values,
            title = Title,
            interactiveSize = InteractiveSize,
            showLabels = ShowLabels
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-avatar-group />
/// </summary>
[HtmlTargetElement("island-avatar-group")]
public class IslandAvatarGroupTagHelper : TagHelper
{
    public List<AvatarItem> Avatars { get; set; } = new();
    public int Max { get; set; } = 4;
    public string Size { get; set; } = "md";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "avatar-group");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            avatars = Avatars,
            max = Max,
            size = Size
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-progress-bar />
/// </summary>
[HtmlTargetElement("island-progress-bar")]
public class IslandProgressBarTagHelper : TagHelper
{
    public double? Value { get; set; }
    public string Mode { get; set; } = "determinate";
    public bool ShowValue { get; set; } = true;
    public string Height { get; set; } = "0.75rem";
    public string? Color { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "progress-bar");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            mode = Mode,
            showValue = ShowValue,
            height = Height,
            color = Color
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-skeleton />
/// </summary>
[HtmlTargetElement("island-skeleton")]
public class IslandSkeletonTagHelper : TagHelper
{
    public string Shape { get; set; } = "rectangle";
    public string Width { get; set; } = "100%";
    public string Height { get; set; } = "1.25rem";
    public string? BorderRadius { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "skeleton");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            shape = Shape,
            width = Width,
            height = Height,
            borderRadius = BorderRadius
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-tag />
/// </summary>
[HtmlTargetElement("island-tag")]
public class IslandTagTagHelper : TagHelper
{
    public string Value { get; set; } = string.Empty;
    public string Severity { get; set; } = "info";
    public bool Rounded { get; set; } = false;
    public string? Icon { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "tag");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            severity = Severity,
            rounded = Rounded,
            icon = Icon
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-scroll-top />
/// </summary>
[HtmlTargetElement("island-scroll-top")]
public class IslandScrollTopTagHelper : TagHelper
{
    public int Threshold { get; set; } = 200;
    public string Behavior { get; set; } = "smooth";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "scroll-top");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            threshold = Threshold,
            behavior = Behavior
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-inplace />
/// </summary>
[HtmlTargetElement("island-inplace")]
public class IslandInplaceTagHelper : TagHelper
{
    public string? Value { get; set; }
    public string? TargetInput { get; set; }
    public string? Placeholder { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "inplace");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            targetInputName = TargetInput,
            placeholder = Placeholder,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-commandmenu />, <p-commandmenu />, and <island-command />
/// PrimeVue 4 Aura Design System compliant search-driven CommandMenu component.
/// </summary>
[HtmlTargetElement("island-commandmenu")]
[HtmlTargetElement("island-command-menu")]
[HtmlTargetElement("p-commandmenu")]
[HtmlTargetElement("island-command")]
[HtmlTargetElement("island-command-palette")]
public class IslandCommandTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<CommandMenuGroup>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<CommandPaletteItem>? Items { get; set; }

    [HtmlAttributeName("placeholder")]
    public string? Placeholder { get; set; } = "Search for commands...";

    [HtmlAttributeName("search")]
    public string? Search { get; set; }

    [HtmlAttributeName("filter")]
    public string? Filter { get; set; } = "default";

    [HtmlAttributeName("with-dialog")]
    public bool WithDialog { get; set; } = false;

    [HtmlAttributeName("hotkey")]
    public string? Hotkey { get; set; } = "ctrl+l, meta+l";

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("empty-message")]
    public string? EmptyMessage { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "commandmenu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        // Convert flat legacy items if model not provided
        var groups = Model;
        if (groups == null && Items != null && Items.Count > 0)
        {
            var dict = new Dictionary<string, List<CommandMenuItem>>();
            foreach (var it in Items)
            {
                var g = it.Group ?? "General";
                if (!dict.ContainsKey(g)) dict[g] = new();
                dict[g].Add(new CommandMenuItem(it.Label, it.Icon, null, null, null, it.Shortcut, it.Url, it.Action, it.Disabled));
            }

            groups = new();
            foreach (var kv in dict)
            {
                groups.Add(new CommandMenuGroup(kv.Key, kv.Value));
            }
        }

        var props = new
        {
            model = groups ?? new(),
            placeholder = Placeholder,
            search = Search,
            filter = Filter,
            withDialog = WithDialog,
            hotkey = Hotkey,
            customTemplate = CustomTemplate,
            emptyMessage = EmptyMessage
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
/// TagHelper for <island-theme-studio /> (TweakAura Live Theme Editor)
/// </summary>
[HtmlTargetElement("island-theme-studio")]
public class IslandThemeStudioTagHelper : TagHelper
{
    public bool DefaultOpen { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "theme-studio");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            defaultOpen = DefaultOpen
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-terminal />
/// </summary>
[HtmlTargetElement("island-terminal")]
public class IslandTerminalTagHelper : TagHelper
{
    public string? WelcomeMessage { get; set; }
    public string Prompt { get; set; } = "admin@softmax:~$";
    public Dictionary<string, string>? Commands { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "terminal");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            welcomeMessage = WelcomeMessage,
            prompt = Prompt,
            commands = Commands ?? new()
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-blockui />
/// </summary>
[HtmlTargetElement("island-blockui")]
public class IslandBlockUITagHelper : TagHelper
{
    public bool Blocked { get; set; } = true;
    public string? Message { get; set; } = "Processing...";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "blockui");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            blocked = Blocked,
            message = Message
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-message />, <p-message />, and <island-inline-message />
/// PrimeVue 4 Aura Design System compliant inline and contextual message notification.
/// </summary>
[HtmlTargetElement("island-message")]
[HtmlTargetElement("p-message")]
[HtmlTargetElement("island-inline-message")]
[HtmlTargetElement("p-inlinemessage")]
public class IslandMessageTagHelper : TagHelper
{
    [HtmlAttributeName("severity")]
    public string Severity { get; set; } = "info";

    [HtmlAttributeName("variant")]
    public string? Variant { get; set; }

    [HtmlAttributeName("size")]
    public string? Size { get; set; }

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = false;

    [HtmlAttributeName("life")]
    public int? Life { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("avatar")]
    public string? Avatar { get; set; }

    [HtmlAttributeName("spin")]
    public bool Spin { get; set; } = false;

    [HtmlAttributeName("text")]
    public string? Text { get; set; }

    [HtmlAttributeName("content")]
    public string? Content { get; set; }

    [HtmlAttributeName("dynamic")]
    public bool Dynamic { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "message");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        var props = new
        {
            severity = Severity,
            variant = Variant,
            size = Size,
            closable = Closable,
            life = Life,
            icon = Icon,
            avatar = Avatar,
            spin = Spin,
            text = Text ?? Content ?? (string.IsNullOrWhiteSpace(innerHtml) ? null : innerHtml.Trim()),
            dynamic = Dynamic,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Content.SetHtmlContent(innerHtml);

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
