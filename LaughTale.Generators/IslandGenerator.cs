using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Text;

namespace LaughTale.Generators;

/// <summary>
/// Roslyn Incremental Source Generator &amp; Diagnostic Analyzer for LaughTale.
/// Scans [Island] attributes and generates:
/// 1. Strongly-typed C# TagHelpers for seamless Razor markup
/// 2. TypeScript model contracts and island registry
/// 3. Compile-time Diagnostics (SMI001, SMI002) for type-safety and invalid island names
/// </summary>
[Generator(LanguageNames.CSharp)]
public class IslandGenerator : IIncrementalGenerator
{
    private const string IslandAttributeName = "LaughTale.Core.Attributes.IslandAttribute";
    private const string IslandIgnoreAttributeName = "LaughTale.Core.Attributes.IslandIgnoreAttribute";
    private const string JsonIgnoreAttributeName = "System.Text.Json.Serialization.JsonIgnoreAttribute";
    private const string GenerateTypeScriptAttributeName = "LaughTale.Core.Attributes.GenerateTypeScriptAttribute";

    // ── Diagnostics Descriptors ───────────────────────────────────────────────
    private static readonly DiagnosticDescriptor InvalidIslandNameRule = new(
        id: "LTI001",
        title: "Invalid Island Name",
        messageFormat: "The island name '{0}' on '{1}' is invalid (must be lowercase kebab-case)",
        category: "LaughTale.Naming",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    private static readonly DiagnosticDescriptor NonSerializableTypeRule = new(
        id: "LTI002",
        title: "Non-Serializable Property in Island Props",
        messageFormat: "Property '{0}' on island props '{1}' has non-serializable type '{2}'",
        category: "LaughTale.Serialization",
        defaultSeverity: DiagnosticSeverity.Warning,
        isEnabledByDefault: true
    );

    private static readonly DiagnosticDescriptor SensitiveCredentialExposureRule = new(
        id: "LTI004",
        title: "Sensitive Credential Property in Island Props",
        messageFormat: "Property '{0}' on island props '{1}' matches sensitive credential pattern '{2}' and will be serialized to public HTML. Decorate with [IslandIgnore] or remove from props.",
        category: "LaughTale.Security",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    private static readonly Regex SensitivePropertyPattern = new(
        @"password|secret|token|hash|apikey|connectionstring|passwd|pwd|privatekey",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly HashSet<string> BannedTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "System.Threading.CancellationToken",
        "System.IO.Stream",
        "System.IntPtr",
        "System.UIntPtr",
        "System.Action",
        "System.Func",
        "System.Delegate",
        "Microsoft.AspNetCore.Http.HttpContext",
        "Microsoft.AspNetCore.Http.HttpRequest",
        "Microsoft.AspNetCore.Http.HttpResponse"
    };

    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        // 1. Discover all types annotated with [Island]
        var islandDeclarations = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                IslandAttributeName,
                predicate: static (node, _) => node is ClassDeclarationSyntax or RecordDeclarationSyntax or StructDeclarationSyntax,
                transform: static (ctx, _) => GetIslandModel(ctx)
            );

        // 2. Report Diagnostics & Generate C# TagHelpers for each Island
        context.RegisterSourceOutput(islandDeclarations, static (spc, result) =>
        {
            if (result.Diagnostic is not null)
            {
                spc.ReportDiagnostic(result.Diagnostic);
            }

            foreach (var diag in result.PropertyDiagnostics)
            {
                spc.ReportDiagnostic(diag);
            }

            if (result.Model is null) return;

            var tagHelperSource = GenerateTagHelper(result.Model);
            spc.AddSource($"{result.Model.TypeName}IslandTagHelper.g.cs", SourceText.From(tagHelperSource, Encoding.UTF8));
        });

        // 3. Collect all models and generate TypeScript definitions
        var allIslands = islandDeclarations.Collect();
        context.RegisterSourceOutput(allIslands, static (spc, results) =>
        {
            var validModels = results
                .Where(r => r.Model is not null)
                .Select(r => r.Model!)
                .ToImmutableArray();

            if (validModels.IsEmpty) return;
            var tsSource = GenerateTypeScriptContracts(validModels);
            spc.AddSource("LaughTale.TypeScriptManifest.g.cs", SourceText.From(GenerateManifestComment(tsSource), Encoding.UTF8));
        });
    }

    private static IslandModelResult GetIslandModel(GeneratorAttributeSyntaxContext ctx)
    {
        if (ctx.TargetSymbol is not INamedTypeSymbol symbol)
        {
            return new IslandModelResult(null, null, ImmutableArray<Diagnostic>.Empty);
        }

        var islandAttr = ctx.Attributes.FirstOrDefault(a =>
            a.AttributeClass?.ToDisplayString() == IslandAttributeName);

        if (islandAttr == null || islandAttr.ConstructorArguments.Length == 0)
        {
            return new IslandModelResult(null, null, ImmutableArray<Diagnostic>.Empty);
        }

        var islandName = islandAttr.ConstructorArguments[0].Value?.ToString() ?? symbol.Name;
        Diagnostic? nameDiagnostic = null;

        // Diagnostic SMI001: Validate kebab-case name format
        if (!IsValidIslandName(islandName))
        {
            nameDiagnostic = Diagnostic.Create(
                InvalidIslandNameRule,
                ctx.TargetNode.GetLocation(),
                islandName,
                symbol.Name
            );
        }

        var propertyDiagnostics = new List<Diagnostic>();
        var properties = new List<PropertyModel>();

        foreach (var member in symbol.GetMembers().OfType<IPropertySymbol>())
        {
            if (member.DeclaredAccessibility != Accessibility.Public || member.IsStatic) continue;

            var hasIgnoreAttr = member.GetAttributes().Any(a =>
                a.AttributeClass?.ToDisplayString() is IslandIgnoreAttributeName or JsonIgnoreAttributeName or "IslandIgnore" or "JsonIgnore");

            // Diagnostic SMI004: Sensitive Credential Check
            if (!hasIgnoreAttr && SensitivePropertyPattern.IsMatch(member.Name))
            {
                var syntaxRef = member.DeclaringSyntaxReferences.FirstOrDefault();
                var loc = syntaxRef?.GetSyntax().GetLocation() ?? ctx.TargetNode.GetLocation();
                propertyDiagnostics.Add(Diagnostic.Create(
                    SensitiveCredentialExposureRule,
                    loc,
                    member.Name,
                    symbol.Name,
                    SensitivePropertyPattern.Match(member.Name).Value
                ));
            }

            // If explicitly ignored, do not expose in TagHelper attributes or TypeScript props
            if (hasIgnoreAttr) continue;

            var typeDisplay = member.Type.ToDisplayString();

            // Diagnostic SMI002: Check for non-serializable types
            if (IsNonSerializable(member.Type))
            {
                var syntaxRef = member.DeclaringSyntaxReferences.FirstOrDefault();
                var loc = syntaxRef?.GetSyntax().GetLocation() ?? ctx.TargetNode.GetLocation();
                propertyDiagnostics.Add(Diagnostic.Create(
                    NonSerializableTypeRule,
                    loc,
                    member.Name,
                    symbol.Name,
                    member.Type.Name
                ));
            }

            properties.Add(new PropertyModel(
                Name: member.Name,
                TypeName: member.Type.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat),
                TsTypeName: MapToTypeScriptType(member.Type),
                IsNullable: member.NullableAnnotation == NullableAnnotation.Annotated || member.Type.IsReferenceType
            ));
        }

        var model = new IslandModel(
            Namespace: symbol.ContainingNamespace.ToDisplayString(),
            TypeName: symbol.Name,
            IslandName: islandName,
            Properties: properties.ToImmutableArray()
        );

        return new IslandModelResult(model, nameDiagnostic, propertyDiagnostics.ToImmutableArray());
    }

    private static bool IsValidIslandName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return false;
        // Must contain only lowercase alphanumeric and dashes e.g. "cascade-tree", "counter-1"
        return Regex.IsMatch(name, "^[a-z0-9]+(-[a-z0-9]+)*$");
    }

    private static bool IsNonSerializable(ITypeSymbol type)
    {
        var fullName = type.ToDisplayString();
        if (BannedTypes.Contains(fullName)) return true;
        if (type.TypeKind == TypeKind.Delegate) return true;
        return false;
    }

    private static string GenerateTagHelper(IslandModel model)
    {
        var sb = new StringBuilder();
        var tagHelperName = $"{model.TypeName}IslandTagHelper";
        var tagName = $"{model.IslandName}-island";

        sb.AppendLine("// <auto-generated/>");
        sb.AppendLine("#nullable enable");
        sb.AppendLine("using System;");
        sb.AppendLine("using System.Threading.Tasks;");
        sb.AppendLine("using Microsoft.AspNetCore.Razor.TagHelpers;");
        sb.AppendLine("using LaughTale.Core.Enums;");
        sb.AppendLine("using LaughTale.Core.Serialization;");
        sb.AppendLine();
        sb.AppendLine($"namespace {model.Namespace}.TagHelpers;");
        sb.AppendLine();
        sb.AppendLine($"[HtmlTargetElement(\"{tagName}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        sb.AppendLine($"[HtmlTargetElement(\"island-{model.IslandName}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        sb.AppendLine($"public partial class {tagHelperName} : TagHelper");
        sb.AppendLine("{");
        sb.AppendLine("    [HtmlAttributeName(\"hydrate\")]");
        sb.AppendLine("    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"media\")]");
        sb.AppendLine("    public string? Media { get; set; }");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"persist\")]");
        sb.AppendLine("    public string? Persist { get; set; }");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"class\")]");
        sb.AppendLine("    public string? Class { get; set; }");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"style\")]");
        sb.AppendLine("    public string? Style { get; set; }");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"pt\")]");
        sb.AppendLine("    public object? Pt { get; set; }");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"studio-overrides\")]");
        sb.AppendLine("    public object? StudioOverrides { get; set; }");
        sb.AppendLine();

        // Generate properties for each props member
        foreach (var prop in model.Properties)
        {
            var htmlAttrName = ToKebabCase(prop.Name);
            sb.AppendLine($"    [HtmlAttributeName(\"{htmlAttrName}\")]");
            sb.AppendLine($"    public {prop.TypeName} {prop.Name} {{ get; set; }} = default!;");
            sb.AppendLine();
        }

        sb.AppendLine("    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)");
        sb.AppendLine("    {");
        sb.AppendLine("        output.TagName = \"div\";");
        sb.AppendLine("        output.TagMode = TagMode.StartTagAndEndTag;");
        sb.AppendLine($"        output.Attributes.SetAttribute(\"data-island\", \"{model.IslandName}\");");
        sb.AppendLine("        output.Attributes.SetAttribute(\"data-hydrate\", Hydrate.ToString().ToLowerInvariant());");
        sb.AppendLine();
        sb.AppendLine("        if (!string.IsNullOrWhiteSpace(Persist))");
        sb.AppendLine("            output.Attributes.SetAttribute(\"data-persist\", Persist);");
        sb.AppendLine("        if (!string.IsNullOrWhiteSpace(Media))");
        sb.AppendLine("            output.Attributes.SetAttribute(\"data-media\", Media);");
        sb.AppendLine("        if (!string.IsNullOrWhiteSpace(Class))");
        sb.AppendLine("            output.Attributes.SetAttribute(\"class\", Class);");
        sb.AppendLine("        if (!string.IsNullOrWhiteSpace(Style))");
        sb.AppendLine("            output.Attributes.SetAttribute(\"style\", Style);");
        sb.AppendLine();

        // Anonymous props serializer with pt & studioOverrides
        sb.AppendLine("        var propsObj = new");
        sb.AppendLine("        {");
        foreach (var prop in model.Properties)
        {
            sb.AppendLine($"            {prop.Name},");
        }
        sb.AppendLine("            Pt,");
        sb.AppendLine("            StudioOverrides");
        sb.AppendLine("        };");
        sb.AppendLine("        output.Attributes.SetAttribute(\"data-props\", IslandJson.SerializeProps(propsObj));");
        sb.AppendLine();
        sb.AppendLine("        var childContent = await output.GetChildContentAsync();");
        sb.AppendLine("        if (!childContent.IsEmptyOrWhiteSpace)");
        sb.AppendLine("        {");
        sb.AppendLine("            output.Content.SetHtmlContent($\"<div data-slot=\\\"default\\\" class=\\\"island-slot\\\">{childContent.GetContent()}</div>\");");
        sb.AppendLine("        }");
        sb.AppendLine("    }");
        sb.AppendLine("}");
        sb.AppendLine();
        sb.AppendLine("// ── AOT-Compatible JsonSerializerContext (LT-1204) ──────────────────────");
        sb.AppendLine("[System.Text.Json.Serialization.JsonSourceGenerationOptions(");
        sb.AppendLine("    PropertyNamingPolicy = System.Text.Json.Serialization.JsonKnownNamingPolicy.CamelCase,");
        sb.AppendLine("    DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull)]");
        sb.AppendLine($"[System.Text.Json.Serialization.JsonSerializable(typeof({model.TypeName}))]");
        sb.AppendLine($"internal partial class {model.TypeName}JsonSerializerContext : System.Text.Json.Serialization.JsonSerializerContext");
        sb.AppendLine("{");
        sb.AppendLine("}");

        return sb.ToString();
    }

    private static string GenerateTypeScriptContracts(ImmutableArray<IslandModel> models)
    {
        var sb = new StringBuilder();
        sb.AppendLine("/**");
        sb.AppendLine(" * Auto-generated by LaughTale.Generators");
        sb.AppendLine(" */");
        sb.AppendLine();

        foreach (var model in models)
        {
            sb.AppendLine($"export interface {model.TypeName} {{");
            foreach (var prop in model.Properties)
            {
                var tsPropName = ToCamelCase(prop.Name);
                var nullability = prop.IsNullable ? " | null" : "";
                sb.AppendLine($"    {tsPropName}?: {prop.TsTypeName}{nullability};");
            }
            sb.AppendLine("    pt?: Record<string, any>;");
            sb.AppendLine("    studioOverrides?: Record<string, any>;");
            sb.AppendLine("}");
            sb.AppendLine();
        }

        sb.AppendLine("// Island Registry Helper");
        sb.AppendLine("export const REGISTERED_ISLANDS = [");
        foreach (var model in models)
        {
            sb.AppendLine($"    '{model.IslandName}',");
        }
        sb.AppendLine("] as const;");

        return sb.ToString();
    }

    private static string GenerateManifestComment(string tsContent)
    {
        return $@"// <auto-generated/>
namespace LaughTale.Generated
{{
    internal static class TypeScriptContracts
    {{
        public const string Source = @""{tsContent.Replace("\"", "\"\"")}"";
    }}
}}";
    }

    private static string MapToTypeScriptType(ITypeSymbol type)
    {
        if (type is IArrayTypeSymbol array)
        {
            return $"{MapToTypeScriptType(array.ElementType)}[]";
        }

        if (type is INamedTypeSymbol named)
        {
            if (named.Name == "Nullable" && named.TypeArguments.Length > 0)
            {
                return MapToTypeScriptType(named.TypeArguments[0]);
            }

            if (named.Name is "List" or "IList" or "IEnumerable" or "IReadOnlyList" or "ICollection" && named.TypeArguments.Length > 0)
            {
                return $"{MapToTypeScriptType(named.TypeArguments[0])}[]";
            }

            if (named.Name == "Dictionary" && named.TypeArguments.Length == 2)
            {
                return $"Record<{MapToTypeScriptType(named.TypeArguments[0])}, {MapToTypeScriptType(named.TypeArguments[1])}>";
            }

            return named.SpecialType switch
            {
                SpecialType.System_String or SpecialType.System_Char => "string",
                SpecialType.System_Boolean => "boolean",
                SpecialType.System_Byte or SpecialType.System_Int16 or SpecialType.System_Int32 or
                SpecialType.System_Int64 or SpecialType.System_Single or SpecialType.System_Double or
                SpecialType.System_Decimal => "number",
                _ => named.Name switch
                {
                    "Guid" => "string",
                    "DateTime" or "DateTimeOffset" or "DateOnly" or "TimeOnly" => "string",
                    _ => named.Name
                }
            };
        }

        return "any";
    }

    private static string ToCamelCase(string str)
    {
        if (string.IsNullOrEmpty(str) || char.IsLower(str[0])) return str;
        return char.ToLowerInvariant(str[0]) + str.Substring(1);
    }

    private static string ToKebabCase(string str)
    {
        if (string.IsNullOrEmpty(str)) return str;
        var sb = new StringBuilder();
        for (int i = 0; i < str.Length; i++)
        {
            var c = str[i];
            if (char.IsUpper(c))
            {
                if (i > 0) sb.Append('-');
                sb.Append(char.ToLowerInvariant(c));
            }
            else
            {
                sb.Append(c);
            }
        }
        return sb.ToString();
    }
}

internal record IslandModelResult(
    IslandModel? Model,
    Diagnostic? Diagnostic,
    ImmutableArray<Diagnostic> PropertyDiagnostics
);

internal record IslandModel(
    string Namespace,
    string TypeName,
    string IslandName,
    ImmutableArray<PropertyModel> Properties
);

internal record PropertyModel(
    string Name,
    string TypeName,
    string TsTypeName,
    bool IsNullable
);
