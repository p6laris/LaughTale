using System;
using System.IO;
using System.Linq;

namespace LaughTale.Cli;

public class Program
{
    public static int Main(string[] args)
    {
        if (args.Length == 0 || args[0] is "-h" or "--help" or "help")
        {
            PrintHelp();
            return 0;
        }

        var command = args[0].ToLowerInvariant();
        return command switch
        {
            "list" or "ls" => HandleList(),
            "eject" => HandleEject(args.Skip(1).ToArray()),
            "version" or "-v" or "--version" => HandleVersion(),
            _ => HandleUnknown(command)
        };
    }

    private static void PrintHelp()
    {
        Console.WriteLine(@"
LaughTale CLI - Component Eject & Islands Tooling

USAGE:
  laughtale <command> [options]

COMMANDS:
  list                 List all 76 available LaughTale island components
  eject <component>    Eject a component's source into your project for local ownership
  version              Display LaughTale CLI version
  help                 Display this help menu

OPTIONS:
  --path, -p <dir>     Target directory for ejected component (default: ./Components)
  --force, -f          Overwrite existing component files

EXAMPLES:
  laughtale list
  laughtale eject select
  laughtale eject datatable --path ./Islands
");
    }

    private static int HandleList()
    {
        var components = GetKnownComponents();
        Console.WriteLine($"\n📦 Available LaughTale Island Components ({components.Length} total):\n");

        int colWidth = 22;
        int cols = 3;
        for (int i = 0; i < components.Length; i += cols)
        {
            var chunk = components.Skip(i).Take(cols);
            Console.WriteLine("  " + string.Join("", chunk.Select(c => c.PadRight(colWidth))));
        }

        Console.WriteLine("\nTo eject a component: laughtale eject <name>\n");
        return 0;
    }

    private static int HandleEject(string[] args)
    {
        if (args.Length == 0)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("\n❌ Please specify a component name. Example: laughtale eject select\n");
            Console.ResetColor();
            return 1;
        }

        string componentName = args[0].ToLowerInvariant().Replace(".ts", "");
        var components = GetKnownComponents();

        if (!components.Contains(componentName))
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"\n❌ Component '{componentName}' is not in the LaughTale registry.");
            Console.ResetColor();
            Console.WriteLine($"Run 'laughtale list' to see all {components.Length} available components.\n");
            return 1;
        }

        string targetDir = "./Components";
        bool force = false;

        for (int i = 1; i < args.Length; i++)
        {
            if ((args[i] is "--path" or "-p") && i + 1 < args.Length)
            {
                targetDir = args[++i];
            }
            else if (args[i] is "--force" or "-f")
            {
                force = true;
            }
        }

        Directory.CreateDirectory(targetDir);

        string pascalName = string.Join("", componentName.Split('-').Select(s => char.ToUpperInvariant(s[0]) + s[1..]));
        string tsPath = Path.Combine(targetDir, $"{componentName}.ts");
        string csPath = Path.Combine(targetDir, $"{pascalName}.cs");

        if (File.Exists(tsPath) && !force)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"\n⚠️  File '{tsPath}' already exists. Pass --force to overwrite.\n");
            Console.ResetColor();
            return 1;
        }

        // Emit C# Props Record
        string csCode = $@"using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace LaughTale.Ejected;

/// <summary>
/// Ejected LaughTale Island: {componentName}
/// Fully customizable local source component.
/// </summary>
[Island(""{componentName}"", DefaultStrategy = HydrateStrategy.Load)]
public record {pascalName}Props(
    string? Class = null,
    string? Style = null
);
";
        File.WriteAllText(csPath, csCode);

        // Emit TypeScript Mount Template
        string tsCode = $@"import {{ resolvePart, applyPart, type PassthroughRecord, type IslandContext }} from 'laughtale';

export interface {pascalName}Props {{
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}}

/**
 * Ejected Island: {componentName}
 */
export default function {pascalName}(container: HTMLElement, props: {pascalName}Props = {{}}, ctx?: IslandContext) {{
    applyPart(container, 'root', {{
        className: 'lt-{componentName}',
        style: {{ display: 'inline-block' }}
    }}, props.pt);

    container.innerHTML = `<div data-part=""body"">Ejected {pascalName} Island</div>`;
}}
";
        File.WriteAllText(tsPath, tsCode);

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n🎉 Successfully ejected '{componentName}'!");
        Console.ResetColor();
        Console.WriteLine($"  📄 TypeScript: {tsPath}");
        Console.WriteLine($"  📄 C# Model:   {csPath}");
        Console.WriteLine($"\nYou now have direct local ownership of this component.\n");
        return 0;
    }

    private static int HandleVersion()
    {
        Console.WriteLine("LaughTale CLI v1.0.0");
        return 0;
    }

    private static int HandleUnknown(string cmd)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"\n❌ Unknown command: {cmd}");
        Console.ResetColor();
        PrintHelp();
        return 1;
    }

    private static string[] GetKnownComponents() => new[]
    {
        "accordion", "autocomplete", "avatar-group", "blockui", "breadcrumb",
        "button", "carousel", "cascadeselect", "checkbox", "color-picker",
        "command", "confirm-dialog", "confirm-popup", "context-menu", "datatable",
        "dataview", "datepicker", "dialog", "divider", "drawer",
        "dropzone", "fieldset", "fileupload", "float-label", "galleria",
        "ifta-label", "image-compare", "inplace", "input-group", "input-mask",
        "input-number", "input-otp", "input-password", "input-tags", "input-text",
        "knob", "listbox", "menu", "menubar", "message",
        "meter-group", "multiselect", "orderlist", "orgchart", "paginator",
        "panel", "picklist", "popover", "progress-bar", "radio-button",
        "rating", "scroll-top", "select", "select-button", "slider",
        "speed-dial", "splitter", "stepper", "steps", "switch",
        "tabmenu", "tabs", "tag", "terminal", "textarea",
        "theme-studio", "tiered-menu", "timeline", "toast", "toggle-button",
        "toolbar", "tooltip", "tree", "treetable", "virtual-scroller"
    };
}
