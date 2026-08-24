using System.Text.RegularExpressions;

namespace SoftMax.LaughTale.Components.Icons;

public static class LucideIcons
{
    private static readonly Dictionary<string, string> Aliases = new(StringComparer.OrdinalIgnoreCase)
    {
        ["refresh"] = "refresh-cw",
        ["refreshcw"] = "refresh-cw",
        ["refreshccw"] = "refresh-ccw",
        ["times"] = "x",
        ["close"] = "x",
        ["sharealt"] = "share-2",
        ["share2"] = "share-2",
        ["externallink"] = "external-link",
        ["spinner"] = "loader-circle",
        ["loader2"] = "loader-circle",
        ["loader"] = "loader-circle",
        ["pencil"] = "pencil",
        ["edit"] = "pencil",
        ["trash"] = "trash-2",
        ["trash2"] = "trash-2",
        ["arrowup"] = "arrow-up",
        ["arrowdown"] = "arrow-down",
        ["arrowleft"] = "arrow-left",
        ["arrowright"] = "arrow-right",
        ["chevrondown"] = "chevron-down",
        ["chevronup"] = "chevron-up",
        ["chevronleft"] = "chevron-left",
        ["chevronright"] = "chevron-right",
        ["chevronsleft"] = "chevrons-left",
        ["chevronsright"] = "chevrons-right",
        ["chevronsup"] = "chevrons-up",
        ["chevronsdown"] = "chevrons-down",
        ["plus"] = "plus",
        ["minus"] = "minus",
        ["layers"] = "layers",
        ["check"] = "check",
        ["search"] = "search",
        ["settings"] = "settings",
        ["cog"] = "settings",
        ["eye"] = "eye",
        ["eyeoff"] = "eye-off",
        ["alertcircle"] = "circle-alert",
        ["alerttriangle"] = "triangle-alert",
        ["terminal"] = "terminal",
        ["palette"] = "palette",
        ["sliders"] = "sliders-horizontal",
        ["sun"] = "sun",
        ["moon"] = "moon",
        ["code"] = "code",
        ["heart"] = "heart",
        ["save"] = "save",
        ["print"] = "print",
        ["copy"] = "copy",
        ["upload"] = "upload",
        ["download"] = "download",
        ["user"] = "user",
        ["users"] = "users",
        ["bell"] = "bell",
        ["home"] = "home",
        ["lock"] = "lock",
        ["unlock"] = "unlock",
        ["calendar"] = "calendar",
        ["clock"] = "clock",
        ["star"] = "star",
        ["zap"] = "zap"
    };

    public static string NormalizeId(string? iconName)
    {
        if (string.IsNullOrWhiteSpace(iconName)) return "zap";
        var trimmed = iconName.Trim();
        var kebab = Regex.Replace(trimmed, @"([a-z0-9])([A-Z])", "$1-$2").ToLowerInvariant().Replace('_', '-');
        var cleanKey = kebab.Replace("-", "");

        if (Aliases.TryGetValue(cleanKey, out var aliased)) return aliased;
        if (Aliases.TryGetValue(kebab, out aliased)) return aliased;

        return kebab;
    }

    public static string Get(string iconName, int size = 16)
    {
        if (string.IsNullOrWhiteSpace(iconName)) return string.Empty;
        var iconId = NormalizeId(iconName);
        return $@"<svg class=""p-icon p-icon-{iconId}"" width=""{size}"" height=""{size}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><use href=""/icons/lucide-sprites.svg#{iconId}""></use></svg>";
    }
}
