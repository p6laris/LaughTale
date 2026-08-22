namespace SoftMax.LaughTale.Components.Icons;

public static class LucideIcons
{
    private static readonly Dictionary<string, string> Icons = new(StringComparer.OrdinalIgnoreCase)
    {
        ["search"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><circle cx=""11"" cy=""11"" r=""8""/><path d=""m21 21-4.3-4.3""/></svg>",
        ["check"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""M20 6 9 17l-5-5""/></svg>",
        ["x"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""M18 6 6 18""/><path d=""m6 6 12 12""/></svg>",
        ["chevron-down"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m6 9 6 6 6-6""/></svg>",
        ["chevron-up"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m18 15-6-6-6 6""/></svg>",
        ["chevron-left"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m15 18-6-6 6-6""/></svg>",
        ["chevron-right"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m9 18 6-6-6-6""/></svg>",
        ["alert-circle"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><circle cx=""12"" cy=""12"" r=""10""/><line x1=""12"" x2=""12"" y1=""8"" y2=""12""/><line x1=""12"" x2=""12.01"" y1=""16"" y2=""16""/></svg>",
        ["key"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><circle cx=""7.5"" cy=""15.5"" r=""5.5""/><path d=""m21 2-9.6 9.6""/><path d=""m15.5 7.5 3 3L22 7l-3-3""/></svg>",
        ["mail"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><rect width=""20"" height=""16"" x=""2"" y=""4"" rx=""2""/><path d=""m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7""/></svg>",
        ["lock"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><rect width=""18"" height=""11"" x=""3"" y=""11"" rx=""2"" ry=""2""/><path d=""M7 11V7a5 5 0 0 1 10 0v4""/></svg>",
        ["user"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2""/><circle cx=""12"" cy=""7"" r=""4""/></svg>",
        ["palette"] = @"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{0}"" height=""{0}"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><circle cx=""13.5"" cy=""6.5"" r="".5"" fill=""currentColor""/><circle cx=""17.5"" cy=""10.5"" r="".5"" fill=""currentColor""/><circle cx=""8.5"" cy=""7.5"" r="".5"" fill=""currentColor""/><circle cx=""6.5"" cy=""12.5"" r="".5"" fill=""currentColor""/><path d=""M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z""/></svg>"
    };

    public static string Get(string iconName, int size = 16)
    {
        if (Icons.TryGetValue(iconName, out var template))
        {
            return string.Format(template, size);
        }

        // Fallback generic circle
        return string.Format(Icons["alert-circle"], size);
    }
}
