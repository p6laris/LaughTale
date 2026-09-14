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
    private const string FormControlAttributeName = "LaughTale.Core.Attributes.FormControlAttribute";

    /// <summary>
    /// Explicit (props-record type name, property name) -> ILaughTaleLocalizer key map for the
    /// previously-hardcoded English UI-copy defaults on generator-emitted island props. When a
    /// prop appears here, BuildProps() falls back to the localizer's resolution of the given key
    /// (which itself falls back to English via LaughTale.Components' built-in locale seeding)
    /// instead of leaving the value null/empty when the caller doesn't set it explicitly.
    /// A small hardcoded map is used deliberately instead of a generic naming convention, since
    /// the concept each property maps to isn't reliably inferable from its name alone.
    /// </summary>
    private static readonly IReadOnlyDictionary<(string TypeName, string PropertyName), string> LocalizedPropDefaults =
        new Dictionary<(string, string), string>
        {
            [("SelectProps", "Placeholder")] = "selectPlaceholder",
            [("SelectProps", "FilterPlaceholder")] = "searchPlaceholder",
            [("AutoCompleteProps", "Placeholder")] = "searchPlaceholder",
            [("CascadeSelectProps", "Placeholder")] = "selectCategoryPlaceholder",
            [("InputPasswordProps", "PromptLabel")] = "passwordPrompt",
            [("InputPasswordProps", "WeakLabel")] = "weak",
            [("InputPasswordProps", "MediumLabel")] = "medium",
            [("InputPasswordProps", "StrongLabel")] = "strong",
            [("InputTagsProps", "Placeholder")] = "addTagPlaceholder",
            [("ListboxProps", "FilterPlaceholder")] = "filterItemsPlaceholder",
            [("MultiSelectProps", "Placeholder")] = "selectItemsPlaceholder",
            [("MultiSelectProps", "SelectedItemsLabel")] = "selectionMessage",
            [("MultiSelectProps", "FilterPlaceholder")] = "searchPlaceholder",
            [("ToggleButtonProps", "OnLabel")] = "accept",
            [("ToggleButtonProps", "OffLabel")] = "reject",
            [("TreeSelectProps", "Placeholder")] = "selectItemPlaceholder",
            [("TreeSelectProps", "FilterPlaceholder")] = "filterPlaceholder",
            [("DataViewProps", "EmptyMessage")] = "emptyMessage",
            [("OrderListProps", "FilterPlaceholder")] = "filterItemsPlaceholder",
            [("PickListProps", "SourceHeader")] = "available",
            [("PickListProps", "TargetHeader")] = "selected",
            [("TreeProps", "FilterPlaceholder")] = "filterTreeNodesPlaceholder",
            [("FileUploadProps", "ChooseLabel")] = "choose",
            [("FileUploadProps", "UploadLabel")] = "upload",
            [("FileUploadProps", "CancelLabel")] = "cancel",
            [("DropzoneProps", "Message")] = "dropzoneMessage",
            [("InplaceProps", "Placeholder")] = "inplaceEditPlaceholder",
        };

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

    private static readonly DiagnosticDescriptor MissingFormControlNameRule = new(
        id: "LTI005",
        title: "Missing Name Property on FormControl",
        messageFormat: "Props record '{0}' is marked with [FormControl] but does not declare a name-bearing property ('Name', 'TargetInputName', or 'TargetInput')",
        category: "LaughTale.FormAssociation",
        defaultSeverity: DiagnosticSeverity.Warning,
        isEnabledByDefault: true
    );

    private static readonly Regex SensitivePropertyPattern = new(
        @"password|secret|token|hash|apikey|connectionstring|passwd|pwd|privatekey",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    // These 14 island names already have a hand-written TagHelper subclassing
    // LaughTale.Components.TagHelpers.IslandTagHelperBase directly (ToastTagHelper, TieredMenuTagHelper,
    // TimelineTagHelper, StepperTagHelper, ConfirmDialogTagHelper, SidebarTagHelper, ConfirmPopupTagHelper,
    // DialogTagHelper, DrawerTagHelper, ContextMenuTagHelper, BreadcrumbTagHelper, MenubarTagHelper,
    // CommandMenuTagHelper, MenuTagHelper — see LaughTale.Components/TagHelpers/Aura/{Menu,Messages,Misc,Overlay}).
    // Skip generating a second TagHelper for these: it would carry the identical [HtmlTargetElement] tags as
    // the hand-written class, so Razor would apply both TagHelpers to the same element and two independent
    // TagHelper instances would write into the same TagHelperOutput. ("message" has a hand-written
    // MessageTagHelper too, but no matching [Island("message")] props record exists, so it never collided.)
    private static readonly ImmutableHashSet<string> HandWrittenIslandNames = ImmutableHashSet.Create(
        "toast", "tieredmenu", "timeline", "stepper", "confirm-dialog", "sidebar", "confirm-popup",
        "dialog", "drawer", "context-menu", "breadcrumb", "menubar", "command", "menu");

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

            // See HandWrittenIslandNames: avoid emitting a duplicate TagHelper for the same tag.
            if (HandWrittenIslandNames.Contains(result.Model.IslandName)) return;

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

        var authAttr = symbol.GetAttributes().FirstOrDefault(a =>
            a.AttributeClass?.ToDisplayString() is "LaughTale.Core.Attributes.IslandAuthorizeAttribute" or "IslandAuthorizeAttribute" or "IslandAuthorize");
        string? policy = null;
        if (authAttr != null)
        {
            if (authAttr.ConstructorArguments.Length > 0 && authAttr.ConstructorArguments[0].Value is string ctorPolicy)
            {
                policy = ctorPolicy;
            }
            else
            {
                var namedPolicy = authAttr.NamedArguments.FirstOrDefault(na => na.Key == "Policy").Value.Value as string;
                policy = namedPolicy;
            }
        }

        var formControlAttr = symbol.GetAttributes().FirstOrDefault(a =>
            a.AttributeClass?.ToDisplayString() is FormControlAttributeName or "FormControlAttribute" or "FormControl" or "LaughTale.Core.Attributes.FormControl");

        FormControlModel? formControl = null;
        if (formControlAttr != null)
        {
            var cardinality = "Single";
            var fieldKind = "Hidden";
            var valueProperty = "Value";

            if (formControlAttr.ConstructorArguments.Length > 0)
            {
                var val = formControlAttr.ConstructorArguments[0].Value;
                if (val is int cInt)
                {
                    cardinality = cInt switch { 1 => "Multiple", 2 => "Boolean", _ => "Single" };
                }
                else if (val != null)
                {
                    cardinality = val.ToString();
                }
            }

            foreach (var named in formControlAttr.NamedArguments)
            {
                if (named.Key == "Cardinality")
                {
                    if (named.Value.Value is int cInt)
                        cardinality = cInt switch { 1 => "Multiple", 2 => "Boolean", _ => "Single" };
                    else if (named.Value.Value != null)
                        cardinality = named.Value.Value.ToString();
                }
                else if (named.Key == "FieldKind")
                {
                    if (named.Value.Value is int kInt)
                        fieldKind = kInt switch { 1 => "Native", _ => "Hidden" };
                    else if (named.Value.Value != null)
                        fieldKind = named.Value.Value.ToString();
                }
                else if (named.Key == "ValueProperty" && named.Value.Value is string vp && !string.IsNullOrWhiteSpace(vp))
                {
                    valueProperty = vp;
                }
            }

            var hasNameProperty = symbol.GetMembers().OfType<IPropertySymbol>().Any(m =>
                m.Name is "Name" or "TargetInputName" or "TargetInput");

            if (!hasNameProperty)
            {
                var syntaxRef = symbol.DeclaringSyntaxReferences.FirstOrDefault();
                var loc = syntaxRef?.GetSyntax().GetLocation() ?? ctx.TargetNode.GetLocation();
                propertyDiagnostics.Add(Diagnostic.Create(
                    MissingFormControlNameRule,
                    loc,
                    symbol.Name
                ));
            }

            formControl = new FormControlModel(valueProperty, cardinality, fieldKind);
        }

        var model = new IslandModel(
            Namespace: symbol.ContainingNamespace.ToDisplayString(),
            TypeName: symbol.Name,
            IslandName: islandName,
            Properties: properties.ToImmutableArray(),
            Policy: policy,
            FormControl: formControl
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
        var baseName = model.TypeName.EndsWith("Props") ? model.TypeName.Substring(0, model.TypeName.Length - 5) : model.TypeName;
        var tagHelperName = $"Island{baseName}TagHelper";
        var tagName = $"{model.IslandName}-island";
        var targetNs = model.Namespace.EndsWith(".Models") ? model.Namespace.Substring(0, model.Namespace.Length - 7) + ".TagHelpers" : $"{model.Namespace}.TagHelpers";
        var islandDataName = model.IslandName == "number" ? "input-number" : model.IslandName;

        sb.AppendLine("// <auto-generated/>");
        sb.AppendLine("#nullable enable");
        sb.AppendLine("using System;");
        sb.AppendLine("using System.Threading.Tasks;");
        sb.AppendLine("using Microsoft.AspNetCore.Mvc.ViewFeatures;");
        sb.AppendLine("using Microsoft.AspNetCore.Razor.TagHelpers;");
        sb.AppendLine("using Microsoft.Extensions.DependencyInjection;");
        sb.AppendLine("using LaughTale.Components.TagHelpers;");
        sb.AppendLine();
        sb.AppendLine($"namespace {targetNs};");
        sb.AppendLine();
        sb.AppendLine($"[HtmlTargetElement(\"{tagName}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        sb.AppendLine($"[HtmlTargetElement(\"island-{model.IslandName}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        sb.AppendLine($"[HtmlTargetElement(\"lt-{model.IslandName}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        sb.AppendLine($"[HtmlTargetElement(\"aura-{model.IslandName}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        if (model.IslandName.Contains("-"))
        {
            var noHyphen = model.IslandName.Replace("-", "");
            sb.AppendLine($"[HtmlTargetElement(\"island-{noHyphen}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
            sb.AppendLine($"[HtmlTargetElement(\"lt-{noHyphen}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
            sb.AppendLine($"[HtmlTargetElement(\"aura-{noHyphen}\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        }
        if (model.IslandName == "input-number")
        {
            sb.AppendLine("[HtmlTargetElement(\"island-number\", TagStructure = TagStructure.NormalOrSelfClosing)]");
            sb.AppendLine("[HtmlTargetElement(\"island-currency\", TagStructure = TagStructure.NormalOrSelfClosing)]");
        }
        // Marker so reflection-based tests (e.g. the hierarchy boundary test) can distinguish an
        // IslandGenerator-emitted TagHelper from hand-written ones and from CompoundTagHelpers.cs,
        // which otherwise share the same namespace and an "Island*TagHelper" naming convention.
        sb.AppendLine("[System.CodeDom.Compiler.GeneratedCode(\"LaughTale.Generators.IslandGenerator\", \"1.0.0\")]");
        sb.AppendLine($"public partial class {tagHelperName} : LaughTale.Components.TagHelpers.IslandTagHelperBase");
        sb.AppendLine("{");
        sb.AppendLine($"    public override string IslandName => \"{islandDataName}\";");
        sb.AppendLine();

        // ViewContext, Hydrate, Media, Persist, Class and Style are all inherited unchanged from
        // IslandTagHelperBase. Policy is inherited too, but the base has no default value, so a
        // per-island default (from [IslandAuthorize] on the props record) is applied in a constructor.
        if (model.Policy != null)
        {
            sb.AppendLine($"    public {tagHelperName}()");
            sb.AppendLine("    {");
            sb.AppendLine($"        Policy = \"{model.Policy}\";");
            sb.AppendLine("    }");
            sb.AppendLine();
        }

        sb.AppendLine("    [HtmlAttributeName(\"pt\")]");
        sb.AppendLine("    public object? Pt { get; set; }");
        sb.AppendLine();
        sb.AppendLine("    [HtmlAttributeName(\"studio-overrides\")]");
        sb.AppendLine("    public object? StudioOverrides { get; set; }");
        sb.AppendLine();

        if (model.FormControl != null)
        {
            sb.AppendLine("    [HtmlAttributeName(\"asp-for\")]");
            sb.AppendLine("    public ModelExpression? AspFor { get; set; }");
            sb.AppendLine();
            if (!model.Properties.Any(p => p.Name == "Name"))
            {
                sb.AppendLine("    [HtmlAttributeName(\"name\")]");
                sb.AppendLine("    public string? Name { get; set; }");
                sb.AppendLine();
            }
        }

        // Generate properties for each props member
        foreach (var prop in model.Properties)
        {
            var htmlAttrName = ToKebabCase(prop.Name);
            if (!htmlAttrName.StartsWith("data-"))
            {
                sb.AppendLine($"    [HtmlAttributeName(\"{htmlAttrName}\")]");
            }
            sb.AppendLine($"    public {prop.TypeName} {prop.Name} {{ get; set; }} = default!;");
            sb.AppendLine();
        }

        if (model.FormControl != null)
        {
            // BuildProps() (inherited signature, no TagHelperContext parameter) needs to know whether
            // the value-property HTML attribute was explicitly written on the tag, which requires the
            // TagHelperContext captured here during ProcessAsync.
            sb.AppendLine("    private TagHelperContext? _ltContext;");
            sb.AppendLine();
            sb.AppendLine("    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)");
            sb.AppendLine("    {");
            sb.AppendLine("        _ltContext = context;");
            sb.AppendLine("        await base.ProcessAsync(context, output);");
            sb.AppendLine("    }");
            sb.AppendLine();
        }

        sb.AppendLine("    protected override object? BuildProps()");
        sb.AppendLine("    {");
        if (model.FormControl != null)
        {
            sb.AppendLine("        var context = _ltContext!;");
        }
        sb.AppendLine("        return new");
        sb.AppendLine("        {");
        if (model.FormControl != null)
        {
            var nameExpr = model.Properties.Any(p => p.Name == "TargetInput")
                ? "Name ?? AspFor?.Name ?? TargetInput"
                : (model.Properties.Any(p => p.Name == "TargetInputName")
                    ? "Name ?? AspFor?.Name ?? TargetInputName"
                    : "Name ?? AspFor?.Name");
            sb.AppendLine($"            Name = {nameExpr},");
            sb.AppendLine($"            TargetInputName = {nameExpr},");
        }
        foreach (var prop in model.Properties)
        {
            if (model.FormControl != null && prop.Name is "Name" or "TargetInputName" or "TargetInput")
            {
                continue;
            }
            if (prop.Name == "TargetInput")
            {
                sb.AppendLine("            TargetInputName = TargetInput,");
            }
            else if (model.FormControl != null && prop.Name == model.FormControl.ValueProperty)
            {
                var valAttr = ToKebabCase(prop.Name);
                sb.AppendLine($"            {prop.Name} = (context.AllAttributes.ContainsName(\"{valAttr}\") ? (object?){prop.Name} : null) ?? AspFor?.Model ?? (object?){prop.Name},");
            }
            else if (LocalizedPropDefaults.TryGetValue((model.TypeName, prop.Name), out var localeKey))
            {
                sb.AppendLine($"            {prop.Name} = {prop.Name} ?? ViewContext?.HttpContext?.RequestServices?.GetService<LaughTale.Core.Localization.ILaughTaleLocalizer>()?[\"{localeKey}\"],");
            }
            else
            {
                sb.AppendLine($"            {prop.Name},");
            }
        }
        sb.AppendLine("            Pt,");
        sb.AppendLine("            StudioOverrides");
        sb.AppendLine("        };");
        sb.AppendLine("    }");

        if (model.FormControl != null)
        {
            sb.AppendLine();
            sb.AppendLine("    protected override string? BuildSsrHtml(TagHelperContext context, TagHelperOutput output)");
            sb.AppendLine("    {");
            var resolvedNameExpr = model.Properties.Any(p => p.Name == "TargetInput")
                ? "Name ?? AspFor?.Name ?? TargetInput"
                : (model.Properties.Any(p => p.Name == "TargetInputName")
                    ? "Name ?? AspFor?.Name ?? TargetInputName"
                    : "Name ?? AspFor?.Name");
            sb.AppendLine($"        var resolvedName = {resolvedNameExpr};");
            sb.AppendLine("        if (string.IsNullOrWhiteSpace(resolvedName))");
            sb.AppendLine("        {");
            sb.AppendLine("            return null;");
            sb.AppendLine("        }");
            sb.AppendLine("        var encodedName = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(resolvedName);");
            var valProp = model.FormControl.ValueProperty;
            var valAttr2 = ToKebabCase(valProp);
            var hasValProp = model.Properties.Any(p => p.Name == valProp);
            if (hasValProp)
            {
                sb.AppendLine($"        var rawValue = (context.AllAttributes.ContainsName(\"{valAttr2}\") ? (object?){valProp} : null) ?? AspFor?.Model ?? (object?){valProp};");
            }
            else
            {
                sb.AppendLine("        var rawValue = AspFor?.Model;");
            }

            var hasDisabledProp = model.Properties.Any(p => p.Name == "Disabled");
            if (hasDisabledProp)
            {
                sb.AppendLine("        var isDisabled = Disabled;");
            }
            else
            {
                sb.AppendLine("        var isDisabled = false;");
            }
            sb.AppendLine("        var disabledAttr = isDisabled ? \" disabled=\\\"disabled\\\"\" : \"\";");

            if (model.FormControl.FieldKind == "Native")
            {
                if (model.IslandName == "textarea")
                {
                    sb.AppendLine("        var encodedVal = rawValue != null ? System.Text.Encodings.Web.HtmlEncoder.Default.Encode(rawValue.ToString() ?? \"\") : \"\";");
                    sb.AppendLine("        return $\"<textarea name=\\\"{encodedName}\\\" data-lt-field{disabledAttr}>{encodedVal}</textarea>\";");
                }
                else if (model.IslandName == "dropzone")
                {
                    sb.AppendLine("        return $\"<input type=\\\"file\\\" name=\\\"{encodedName}\\\" data-lt-field{disabledAttr} />\";");
                }
                else if (model.IslandName == "toggle-switch")
                {
                    sb.AppendLine("        var isChecked = rawValue is bool b ? b : (bool.TryParse(rawValue?.ToString(), out var parsedB) && parsedB);");
                    sb.AppendLine("        var checkedAttr = isChecked ? \" checked=\\\"checked\\\"\" : \"\";");
                    sb.AppendLine("        var companionHtml = $\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"false\\\" data-lt-field-companion{disabledAttr} />\";");
                    sb.AppendLine("        return $\"{companionHtml}<input type=\\\"checkbox\\\" name=\\\"{encodedName}\\\" value=\\\"true\\\" data-lt-field{checkedAttr}{disabledAttr} />\";");
                }
                else
                {
                    sb.AppendLine("        var encodedVal = rawValue != null ? System.Text.Encodings.Web.HtmlEncoder.Default.Encode(rawValue.ToString() ?? \"\") : \"\";");
                    sb.AppendLine("        return $\"<input name=\\\"{encodedName}\\\" value=\\\"{encodedVal}\\\" data-lt-field{disabledAttr} />\";");
                }
            }
            else // FieldKind == Hidden
            {
                if (model.FormControl.Cardinality == "Boolean")
                {
                    if (model.IslandName == "radio-button")
                    {
                        sb.AppendLine("        var isChecked = rawValue is bool b ? b : (bool.TryParse(rawValue?.ToString(), out var parsedB) ? parsedB : (rawValue != null && Value != null && rawValue.ToString() == Value.ToString()));");
                        sb.AppendLine("        var fieldVal = !string.IsNullOrEmpty(Value) ? Value : \"true\";");
                        sb.AppendLine("        var encodedFieldVal = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(fieldVal);");
                        sb.AppendLine("        var fieldDisabledAttr = (isDisabled || !isChecked) ? \" disabled=\\\"disabled\\\"\" : \"\";");
                        sb.AppendLine("        var companionHtml = $\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"false\\\" data-lt-field-companion{disabledAttr} />\";");
                        sb.AppendLine("        return $\"{companionHtml}<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"{encodedFieldVal}\\\" data-lt-field{fieldDisabledAttr} />\";");
                    }
                    else
                    {
                        sb.AppendLine("        var isChecked = rawValue is bool b ? b : (bool.TryParse(rawValue?.ToString(), out var parsedB) && parsedB);");
                        sb.AppendLine("        var fieldDisabledAttr = (isDisabled || !isChecked) ? \" disabled=\\\"disabled\\\"\" : \"\";");
                        sb.AppendLine("        var companionHtml = $\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"false\\\" data-lt-field-companion{disabledAttr} />\";");
                        sb.AppendLine("        return $\"{companionHtml}<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"true\\\" data-lt-field{fieldDisabledAttr} />\";");
                    }
                }
                else if (model.FormControl.Cardinality == "Multiple")
                {
                    sb.AppendLine("        var sbFields = new System.Text.StringBuilder();");
                    sb.AppendLine("        if (rawValue is System.Collections.IEnumerable enumerable && rawValue is not string)");
                    sb.AppendLine("        {");
                    sb.AppendLine("            foreach (var item in enumerable)");
                    sb.AppendLine("            {");
                    sb.AppendLine("                if (item != null)");
                    sb.AppendLine("                {");
                    sb.AppendLine("                    var encodedVal = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(item.ToString() ?? \"\");");
                    sb.AppendLine("                    sbFields.Append($\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"{encodedVal}\\\" data-lt-field{disabledAttr} />\");");
                    sb.AppendLine("                }");
                    sb.AppendLine("            }");
                    sb.AppendLine("        }");
                    sb.AppendLine("        else if (rawValue != null)");
                    sb.AppendLine("        {");
                    sb.AppendLine("            var strVal = rawValue.ToString();");
                    sb.AppendLine("            if (!string.IsNullOrEmpty(strVal))");
                    sb.AppendLine("            {");
                    sb.AppendLine("                var encodedVal = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(strVal);");
                    sb.AppendLine("                sbFields.Append($\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"{encodedVal}\\\" data-lt-field{disabledAttr} />\");");
                    sb.AppendLine("            }");
                    sb.AppendLine("        }");
                    sb.AppendLine("        return sbFields.Length > 0 ? sbFields.ToString() : null;");
                }
                else // Single
                {
                    if (islandDataName == "input-password")
                    {
                        sb.AppendLine("        return $\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"\\\" data-lt-field{disabledAttr} />\";");
                    }
                    else
                    {
                        sb.AppendLine("        var strVal = rawValue?.ToString() ?? \"\";");
                        sb.AppendLine("        var encodedVal = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(strVal);");
                        sb.AppendLine("        return $\"<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"{encodedVal}\\\" data-lt-field{disabledAttr} />\";");
                    }
                }
            }
            sb.AppendLine("    }");
        }

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
    ImmutableArray<PropertyModel> Properties,
    string? Policy = null,
    FormControlModel? FormControl = null
);

internal record FormControlModel(
    string ValueProperty,
    string Cardinality,
    string FieldKind
);

internal record PropertyModel(
    string Name,
    string TypeName,
    string TsTypeName,
    bool IsNullable
);
