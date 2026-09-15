using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;

namespace LaughTale.Generators;

/// <summary>
/// ROADMAP.v5.md Part B — "Island discovery &amp; compilation".
///
/// Consumes an external JSON manifest (<c>islands.manifest.g.json</c>) produced by a separate Node
/// build step that scans a user's own <c>Islands/**/*.tsx</c> files (see
/// LaughTale.Client/scripts/islands/discover.mjs), and emits one typed TagHelper per discovered island
/// via the SAME <see cref="IslandGenerator.GenerateTagHelper"/> used for [Island]-attributed C# props
/// records - IslandModel/PropertyModel are plain string/bool records with no ITypeSymbol dependency, so
/// a model built purely from JSON text is a first-class citizen for that method.
///
/// This file only *consumes* the manifest file when one is present as a Roslyn <see cref="AdditionalText"/>.
/// Nothing here wires the actual MSBuild &lt;AdditionalFiles&gt; item that makes a real manifest file
/// show up as one - that plumbing is a separate, later task's job (see ROADMAP.v5.md Part B notes).
/// </summary>
public partial class IslandGenerator
{
    /// <summary>
    /// Filename (not path - matched via Path.GetFileName so it works regardless of which directory the
    /// consuming project's MSBuild wiring stages it into, e.g. "obj/islands.manifest.g.json") the JS-side
    /// discovery step writes. Kept in sync by hand with LaughTale.Client/scripts/islands/shared.mjs's
    /// MANIFEST_FILE_NAME - there is no shared source of truth across the Node/C# boundary.
    /// </summary>
    private const string ManifestFileName = "islands.manifest.g.json";

    /// <summary>
    /// Synthetic namespace for manifest-sourced islands when the consuming project's RootNamespace MSBuild
    /// property isn't visible to this generator (see the manifestNamespaceProvider setup inside
    /// InitializeManifestPipeline below).
    /// </summary>
    private const string DefaultManifestNamespace = "LaughTale.Generated.Islands";

    // ── Diagnostics Descriptors (manifest-specific; LTI001 is reused as-is for an invalid manifest
    // island `name` - see BuildModelFromManifestEntry - since "not lowercase kebab-case" is identically
    // the same failure mode regardless of whether the island was declared via [Island(...)] or
    // discovered from a .tsx file). New IDs here start at LTI020 to stay clear of LTI001/LTI002/LTI004/
    // LTI005 (already used elsewhere in this file) and the LTI01x range the JS-side discovery step uses
    // for its own manifest-embedded diagnostics (see discover.mjs: LTI010/LTI011/LTI012/LTI014/LTI015). ──

    private static readonly DiagnosticDescriptor DuplicateIslandNameRule = new(
        id: "LTI020",
        title: "Duplicate Island Name From Manifest",
        messageFormat: "The manifest island '{0}' (type '{1}', source '{2}') was not generated because its name conflicts with {3}",
        category: "LaughTale.Naming",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true);

    private static readonly DiagnosticDescriptor MalformedManifestRule = new(
        id: "LTI021",
        title: "Malformed Islands Manifest",
        messageFormat: "The islands manifest '{0}' could not be parsed and was ignored: {1}",
        category: "LaughTale.Manifest",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true);

    private static readonly DiagnosticDescriptor MalformedManifestPropRule = new(
        id: "LTI022",
        title: "Malformed Manifest Prop Entry",
        messageFormat: "Prop entry #{0} on manifest island '{1}' is missing a required field ('csharpName'/'csharpType') and was skipped",
        category: "LaughTale.Manifest",
        defaultSeverity: DiagnosticSeverity.Warning,
        isEnabledByDefault: true);

    private static readonly JsonSerializerOptions ManifestJsonOptions = new()
    {
        // Permissive parsing (comments/trailing commas) costs nothing and only helps forward-compat;
        // property matching itself stays case-sensitive/exact via [JsonPropertyName] below since the
        // manifest schema is a controlled contract this generator fully specifies.
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true,
    };

    /// <summary>
    /// Wires the manifest-consumption pipeline into the SAME generator/Initialize() as the
    /// attribute-driven one (see IslandGenerator.cs Initialize(), step 4). Kept as a separate method
    /// purely for file organization - it still runs as part of this one [Generator] class's single
    /// Initialize() call, which is what actually matters: detecting a name collision between a
    /// manifest-derived island and an [Island(...)]-attributed C# type (or the HandWrittenIslandNames
    /// skip list) requires seeing both sources of island names together before emitting anything, and
    /// two independent [Generator] pipelines cannot see each other's data.
    /// </summary>
    private static void InitializeManifestPipeline(
        IncrementalGeneratorInitializationContext context,
        IncrementalValueProvider<ImmutableArray<IslandModelResult>> allIslands)
    {
        // RootNamespace flows to the generator via `build_property.rootnamespace`. Empirically confirmed
        // working with NO extra MSBuild opt-in on this repo's .NET 10 SDK (verified with a real `dotnet
        // build` loading this generator through a ProjectReference-as-analyzer, exactly how
        // LaughTale.Components.csproj/LaughTale.Docs.csproj/LaughTale.Showcase.csproj already consume
        // it, with a real manifest AdditionalText present: the emitted namespace correctly reflected the
        // probe project's own RootNamespace) - modern .NET SDKs mark a small set of common properties,
        // RootNamespace included, compiler-visible by default. An older SDK or a non-SDK-style project
        // might not, so this read stays defensive regardless: it degrades to DefaultManifestNamespace
        // whenever the property isn't visible rather than failing. If a real-world consumer ever needs
        // to force it on explicitly, that's a one-line <CompilerVisibleProperty Include="RootNamespace" />
        // in ITS OWN .csproj - a separate, later task's job (see class-level remarks above), not this
        // generator's.
        var manifestNamespaceProvider = context.AnalyzerConfigOptionsProvider.Select(static (provider, _) =>
            provider.GlobalOptions.TryGetValue("build_property.rootnamespace", out var rootNs) && !string.IsNullOrWhiteSpace(rootNs)
                ? $"{rootNs}.Islands"
                : DefaultManifestNamespace);

        var manifestEntries = context.AdditionalTextsProvider
            .Where(static t => Path.GetFileName(t.Path).Equals(ManifestFileName, StringComparison.OrdinalIgnoreCase))
            .Combine(manifestNamespaceProvider)
            .Select(static (pair, ct) => ParseManifestFile(pair.Left, pair.Right, ct))
            .Collect();

        context.RegisterSourceOutput(allIslands.Combine(manifestEntries), static (spc, pair) =>
        {
            var (attrResults, manifestFileResults) = pair;

            // First registered [Island(...)]-attributed C# type wins as the "conflicts with" target
            // named in a collision diagnostic; a duplicate NAME between two attribute-driven islands is
            // unrelated pre-existing behavior this generator has never guarded against (Razor itself
            // would reject two TagHelpers claiming the same element), so only one representative is
            // needed here.
            var attrIslandNames = new Dictionary<string, string>(StringComparer.Ordinal);
            foreach (var attrResult in attrResults)
            {
                if (attrResult.Model is null) continue;
                if (!attrIslandNames.ContainsKey(attrResult.Model.IslandName))
                {
                    attrIslandNames[attrResult.Model.IslandName] = attrResult.Model.TypeName;
                }
            }

            var seenManifestIslandNames = new Dictionary<string, string>(StringComparer.Ordinal);

            foreach (var fileResult in manifestFileResults)
            {
                foreach (var diagnostic in fileResult.Diagnostics)
                {
                    spc.ReportDiagnostic(diagnostic);
                }

                foreach (var entry in fileResult.Models)
                {
                    var model = entry.Model;
                    string? conflict = null;

                    if (HandWrittenIslandNames.Contains(model.IslandName))
                    {
                        conflict = "a hand-written TagHelper that already handles this island name";
                    }
                    else if (attrIslandNames.TryGetValue(model.IslandName, out var attrTypeName))
                    {
                        conflict = $"the existing [Island(\"{model.IslandName}\")]-attributed type '{attrTypeName}'";
                    }
                    else if (seenManifestIslandNames.TryGetValue(model.IslandName, out var firstSourcePath))
                    {
                        conflict = $"another manifest island at '{firstSourcePath}'";
                    }

                    if (conflict is not null)
                    {
                        spc.ReportDiagnostic(Diagnostic.Create(
                            DuplicateIslandNameRule,
                            CreateManifestLocation(entry.SourcePath),
                            model.IslandName,
                            model.TypeName,
                            entry.SourcePath,
                            conflict));
                        continue;
                    }

                    seenManifestIslandNames[model.IslandName] = entry.SourcePath;

                    // includeAuraAlias: false - the `aura-{name}` alias exists for the 76+ built-in Aura
                    // design-system components; it would be misleading on a user's own custom island.
                    var tagHelperSource = GenerateTagHelper(model, includeAuraAlias: false);

                    // Hint name is distinct from the attribute path's "{TypeName}IslandTagHelper.g.cs"
                    // pattern (both in the ".FromIslandsManifest." infix and by also including the
                    // island name) so that (a) a coincidental TYPE NAME collision between a hand-written
                    // props record and an unrelated manifest entry produces this file's own
                    // DuplicateIslandNameRule diagnostic instead of a cryptic Roslyn "duplicate hint name
                    // provided" crash, and (b) two manifest entries that happen to share a `typeName` but
                    // have DIFFERENT island names (plausible with a nested Islands/** layout, e.g.
                    // Islands/foo/UserCard.tsx and Islands/bar/UserCard.tsx both exporting
                    // `UserCardProps`) don't collide either - IslandName uniqueness is already enforced
                    // above via seenManifestIslandNames, so folding it into the hint name guarantees a
                    // unique hint per generated file without relying on TypeName uniqueness at all.
                    var hintName = $"{model.TypeName}.{model.IslandName}.FromIslandsManifest.IslandTagHelper.g.cs";
                    spc.AddSource(hintName, SourceText.From(tagHelperSource, Encoding.UTF8));
                }
            }
        });

        // NOTE on TypeScript-contract generation (GenerateTypeScriptContracts / allIslands second
        // RegisterSourceOutput in IslandGenerator.cs): manifest-sourced islands are deliberately NOT
        // added to that output. PropertyModel.TsTypeName IS populated for every manifest-sourced prop
        // (see BuildModelFromManifestEntry) so nothing would break if a future change folds these models
        // in too - but doing so today would be redundant at best: the canonical TypeScript shape for a
        // manifest-sourced island's props already exists as a hand-authored `*Props` interface/type in
        // the user's own .tsx file (that's literally where the JS-side discovery step read `typeName`
        // and `props[]` from). Re-deriving and re-emitting a SECOND `export interface` for the same
        // props from the C# side would invert the actual source of truth for these islands (TS-authored,
        // C#-generated - the opposite direction from [Island]-attributed C# props records, which are
        // C#-authored and need a TS interface generated FROM them) and risks a duplicate/conflicting
        // declaration if ever written into a file the user's own interface is also visible from.
    }

    /// <summary>
    /// Parses one <c>islands.manifest.g.json</c> AdditionalText into zero or more (IslandModel,
    /// sourcePath) pairs plus any diagnostics raised along the way (a top-level parse failure, or
    /// anything <see cref="BuildModelFromManifestEntry"/> reports per-entry). Never throws: a source
    /// generator that throws out of Initialize()/RegisterSourceOutput fails the ENTIRE consumer's build,
    /// not just this one feature, so every failure mode here degrades to "report a diagnostic, produce
    /// zero manifest-sourced islands" instead.
    /// </summary>
    private static ManifestFileParseResult ParseManifestFile(AdditionalText text, string manifestNamespace, CancellationToken ct)
    {
        var diagnostics = ImmutableArray.CreateBuilder<Diagnostic>();
        var models = ImmutableArray.CreateBuilder<ManifestIslandEntry>();

        string? content;
        try
        {
            content = text.GetText(ct)?.ToString();
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            diagnostics.Add(Diagnostic.Create(MalformedManifestRule, CreateManifestLocation(text.Path), text.Path, ex.Message));
            return new ManifestFileParseResult(models.ToImmutable(), diagnostics.ToImmutable());
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            // An empty/missing manifest is not itself an error - e.g. a freshly-scaffolded project with
            // zero custom islands yet may still wire up an (empty) manifest file. Nothing to diagnose or
            // generate.
            return new ManifestFileParseResult(models.ToImmutable(), diagnostics.ToImmutable());
        }

        IslandsManifestDto? dto;
        try
        {
            dto = JsonSerializer.Deserialize<IslandsManifestDto>(content!, ManifestJsonOptions);
        }
        catch (JsonException ex)
        {
            diagnostics.Add(Diagnostic.Create(MalformedManifestRule, CreateManifestLocation(text.Path), text.Path, ex.Message));
            return new ManifestFileParseResult(models.ToImmutable(), diagnostics.ToImmutable());
        }

        if (dto?.Islands is null)
        {
            // Valid JSON (e.g. "{}" or "null") that simply declares no islands - not an error.
            return new ManifestFileParseResult(models.ToImmutable(), diagnostics.ToImmutable());
        }

        foreach (var entry in dto.Islands)
        {
            ct.ThrowIfCancellationRequested();
            if (entry is null) continue;

            var model = BuildModelFromManifestEntry(entry, diagnostics, manifestNamespace, text.Path);
            if (model is not null)
            {
                var sourcePath = string.IsNullOrWhiteSpace(entry.SourcePath) ? text.Path : entry.SourcePath!;
                models.Add(new ManifestIslandEntry(model, sourcePath));
            }
        }

        return new ManifestFileParseResult(models.ToImmutable(), diagnostics.ToImmutable());
    }

    /// <summary>
    /// Validates and maps one manifest island entry into an <see cref="IslandModel"/>, or returns null
    /// (after reporting a diagnostic) when the entry can't/shouldn't be generated. Never throws.
    /// </summary>
    /// <remarks>
    /// Skip-on-error-diagnostic ambiguity (see ROADMAP.v5.md Part B / task write-up): the manifest schema
    /// only carries a `severity` string per diagnostic, not a dedicated "does this skip the whole island"
    /// flag. This method treats ANY error-severity diagnostic already present on the entry as "diagnose,
    /// don't generate" - the documented, conservative default. NOTE this is deliberately stricter than
    /// LaughTale.Client/scripts/islands/discover.mjs's OWN internal behavior as of this writing: that
    /// script's SKIP_ISLAND_CODES allowlist (LTI011/LTI012/LTI014) intentionally excludes LTI015 (a
    /// reserved-prop-name collision), which it treats as error-severity but NOT whole-island-fatal - it
    /// just drops that one prop and still emits the island. Since `skip` isn't part of the wire schema
    /// (only `code`/`severity`/`message` are - see the manifest DTOs below), this generator has no
    /// principled way to tell "this error is fatal for the whole island" apart from "this error is about
    /// one prop that's already excluded from `props[]`" other than the literal per-code allowlist the JS
    /// side uses internally - and hardcoding a copy of that PRIVATE, non-schema allowlist here would be a
    /// far more fragile cross-repo coupling than this simple, documented "any error means skip" rule
    /// (silent staleness the moment either side adds a new code, vs. this rule's worst case: an island
    /// that hits LTI015 is currently skipped entirely instead of generated minus one prop - loud, via the
    /// passed-through diagnostic, never silent). Flagged here and in the task report as a real schema gap
    /// a future revision could close by adding an explicit boolean (e.g. `"fatal": true`) per diagnostic.
    /// </remarks>
    private static IslandModel? BuildModelFromManifestEntry(
        IslandManifestEntryDto entry,
        ImmutableArray<Diagnostic>.Builder diagnosticsSink,
        string manifestNamespace,
        string manifestPath)
    {
        var location = CreateManifestLocation(string.IsNullOrWhiteSpace(entry.SourcePath) ? manifestPath : entry.SourcePath!);
        var displayTypeName = string.IsNullOrWhiteSpace(entry.TypeName) ? "(no props type)" : entry.TypeName!;

        // Surface the manifest's own per-island diagnostics (populated by the JS-side discovery step,
        // e.g. an unresolvable prop type) as real Roslyn diagnostics, in addition to anything new
        // detected below - done first so nothing is ever silently swallowed even when this entry also
        // fails the checks that follow.
        var hasErrorDiagnostic = false;
        if (entry.Diagnostics is not null)
        {
            foreach (var manifestDiagnostic in entry.Diagnostics)
            {
                if (manifestDiagnostic is null) continue;
                var severity = ParseManifestSeverity(manifestDiagnostic.Severity);
                if (severity == DiagnosticSeverity.Error)
                {
                    hasErrorDiagnostic = true;
                }
                diagnosticsSink.Add(CreatePassthroughDiagnostic(manifestDiagnostic, severity, location));
            }
        }

        // Name validity reuses the exact same rule + regex as attribute-driven islands
        // (InvalidIslandNameRule / IsValidIslandName): "not lowercase kebab-case" is the identical
        // failure mode regardless of provenance.
        if (string.IsNullOrWhiteSpace(entry.Name) || !IsValidIslandName(entry.Name!))
        {
            diagnosticsSink.Add(Diagnostic.Create(
                InvalidIslandNameRule,
                location,
                entry.Name ?? "(missing)",
                displayTypeName));
            return null;
        }

        // The JS-side discovery step may list a structurally-broken island (e.g. two conflicting *Props
        // interfaces in one file) in the manifest purely so it has somewhere to attach its diagnostic,
        // rather than omitting the entry outright - both are legal per the schema (see class remarks),
        // so treat "already carries an error-severity diagnostic" as authoritative regardless of whether
        // `props` otherwise looks usable: diagnose (already done above), don't generate.
        if (hasErrorDiagnostic)
        {
            return null;
        }

        var properties = ImmutableArray.CreateBuilder<PropertyModel>();
        if (entry.Props is not null)
        {
            for (var i = 0; i < entry.Props.Count; i++)
            {
                var prop = entry.Props[i];
                if (prop is null || string.IsNullOrWhiteSpace(prop.CsharpName) || string.IsNullOrWhiteSpace(prop.CsharpType))
                {
                    diagnosticsSink.Add(Diagnostic.Create(MalformedManifestPropRule, location, i, entry.Name));
                    continue;
                }

                properties.Add(new PropertyModel(
                    Name: prop.CsharpName!,
                    TypeName: prop.CsharpType!,
                    // Populated for TS-manifest-contract parity even though nothing downstream consumes
                    // it for manifest-sourced islands today - see the NOTE in InitializeManifestPipeline
                    // above for why these models are deliberately kept out of GenerateTypeScriptContracts.
                    TsTypeName: string.IsNullOrWhiteSpace(prop.TsType) ? "any" : prop.TsType!,
                    IsNullable: prop.Optional));
            }
        }

        // entry.TypeName is legitimately null/absent for an island with no *Props interface at all (a
        // purely presentational island - see discover.mjs: "not every island needs typed props"), not
        // just a malformed-input edge case. Synthesize a stable PascalCase name so GetGeneratedNames
        // still has something sensible to build a TagHelper class name from.
        var typeName = string.IsNullOrWhiteSpace(entry.TypeName) ? SynthesizeTypeName(entry.Name!) : entry.TypeName!;

        return new IslandModel(
            Namespace: manifestNamespace,
            TypeName: typeName,
            IslandName: entry.Name!,
            Properties: properties.ToImmutable(),
            Policy: null,
            FormControl: null);
    }

    /// <summary>
    /// PascalCases a kebab-case island name and appends "Props" (e.g. "user-card" -&gt;
    /// "UserCardProps"), mirroring the convention every manifest entry's own `typeName` already follows
    /// when one is present. Only exercised when `typeName` is null/blank.
    /// </summary>
    private static string SynthesizeTypeName(string islandName)
    {
        var sb = new StringBuilder();
        foreach (var part in islandName.Split('-'))
        {
            if (part.Length == 0) continue;
            sb.Append(char.ToUpperInvariant(part[0]));
            if (part.Length > 1) sb.Append(part.Substring(1));
        }
        sb.Append("Props");
        return sb.ToString();
    }

    private static DiagnosticSeverity ParseManifestSeverity(string? severity) =>
        string.Equals(severity, "error", StringComparison.OrdinalIgnoreCase) ? DiagnosticSeverity.Error : DiagnosticSeverity.Warning;

    /// <summary>
    /// Re-emits one manifest-embedded diagnostic (JS-side discovery step, e.g. LTI010/LTI011/...) as a
    /// real Roslyn diagnostic, using ITS OWN `code` as the diagnostic id directly rather than minting a
    /// DiagnosticDescriptor per code here - source generators report ad hoc Diagnostics freely via
    /// SourceProductionContext.ReportDiagnostic with no SupportedDiagnostics-style contract to satisfy,
    /// so this keeps the two sides' diagnostic ID ranges fully decoupled (this file never needs to know
    /// the JS side's current code list).
    /// </summary>
    private static Diagnostic CreatePassthroughDiagnostic(DiagnosticManifestEntryDto manifestDiagnostic, DiagnosticSeverity severity, Location location)
    {
        // LTI023 is a placeholder id for the pathological case of a manifest diagnostic that omits its
        // own `code` - kept clear of both this file's LTI020+ range and the JS side's documented LTI01x
        // range so it can never collide with a real code either side assigns.
        var id = string.IsNullOrWhiteSpace(manifestDiagnostic.Code) ? "LTI023" : manifestDiagnostic.Code!;
        var message = string.IsNullOrWhiteSpace(manifestDiagnostic.Message) ? "(no message provided)" : manifestDiagnostic.Message!;
        return Diagnostic.Create(
            id,
            category: "LaughTale.Manifest",
            message: message,
            severity: severity,
            defaultSeverity: severity,
            isEnabledByDefault: true,
            warningLevel: severity == DiagnosticSeverity.Error ? 0 : 1,
            location: location);
    }

    /// <summary>
    /// Builds a Location pointing at an external (non-syntax-tree) file - the manifest itself, or an
    /// island entry's own `sourcePath` (the original .tsx file) when available, which is more actionable
    /// for the user than the generated JSON manifest. Roslyn supports this via the (filePath, textSpan,
    /// lineSpan) overload, which needs no SyntaxTree.
    /// </summary>
    private static Location CreateManifestLocation(string path) =>
        Location.Create(path, TextSpan.FromBounds(0, 0), new LinePositionSpan(new LinePosition(0, 0), new LinePosition(0, 0)));
}

/// <summary>One parsed (IslandModel, sourcePath) pair from a manifest's `islands[]` array.</summary>
internal sealed record ManifestIslandEntry(IslandModel Model, string SourcePath);

/// <summary>Result of parsing a single islands.manifest.g.json AdditionalText.</summary>
internal sealed record ManifestFileParseResult(
    ImmutableArray<ManifestIslandEntry> Models,
    ImmutableArray<Diagnostic> Diagnostics
);

// ── Manifest DTOs (System.Text.Json) ────────────────────────────────────────────────────────────────
// Mirrors the schema documented in ROADMAP.v5.md Part B / produced by
// LaughTale.Client/scripts/islands/shared.mjs's createManifest(). [JsonPropertyName] pins each member
// to its exact JSON key so C#-side naming conventions (PascalCase) never need to match the wire's
// camelCase (or the "$schema" key, which isn't a legal C# identifier fragment at all).

internal sealed class IslandsManifestDto
{
    [JsonPropertyName("$schema")]
    public string? Schema { get; set; }

    [JsonPropertyName("schemaVersion")]
    public int SchemaVersion { get; set; }

    [JsonPropertyName("generatedAtUtc")]
    public string? GeneratedAtUtc { get; set; }

    [JsonPropertyName("islandsRoot")]
    public string? IslandsRoot { get; set; }

    [JsonPropertyName("islands")]
    public List<IslandManifestEntryDto>? Islands { get; set; }
}

internal sealed class IslandManifestEntryDto
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("typeName")]
    public string? TypeName { get; set; }

    [JsonPropertyName("sourcePath")]
    public string? SourcePath { get; set; }

    [JsonPropertyName("scriptKind")]
    public string? ScriptKind { get; set; }

    [JsonPropertyName("contentHash")]
    public string? ContentHash { get; set; }

    [JsonPropertyName("outputChunk")]
    public string? OutputChunk { get; set; }

    [JsonPropertyName("props")]
    public List<PropManifestEntryDto>? Props { get; set; }

    [JsonPropertyName("diagnostics")]
    public List<DiagnosticManifestEntryDto>? Diagnostics { get; set; }
}

internal sealed class PropManifestEntryDto
{
    [JsonPropertyName("tsName")]
    public string? TsName { get; set; }

    [JsonPropertyName("csharpName")]
    public string? CsharpName { get; set; }

    [JsonPropertyName("tsType")]
    public string? TsType { get; set; }

    [JsonPropertyName("csharpType")]
    public string? CsharpType { get; set; }

    [JsonPropertyName("optional")]
    public bool Optional { get; set; }
}

internal sealed class DiagnosticManifestEntryDto
{
    [JsonPropertyName("code")]
    public string? Code { get; set; }

    [JsonPropertyName("severity")]
    public string? Severity { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
