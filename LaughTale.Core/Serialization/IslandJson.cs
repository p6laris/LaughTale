using System.Collections.Concurrent;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using LaughTale.Core.Attributes;

namespace LaughTale.Core.Serialization;

/// <summary>
/// High-performance JSON serializer optimized for Island HTML attribute injection with bounded depth and cycle handling.
/// </summary>
public static class IslandJson
{
    /// <summary>
    /// Strict, secure serializer options for client-side island props injection.
    /// Enforces a maximum recursion depth of 32, ignores circular object references,
    /// omits properties whose value equals the CLR default for their declared type (so unset/default-valued
    /// props never bloat the wire payload), and excludes properties decorated with [IslandIgnore].
    /// </summary>
    public static readonly JsonSerializerOptions Options = CreateDefaultOptions();

    /// <summary>
    /// Cache of one combined JsonSerializerOptions per distinct additional resolver instance passed to
    /// <see cref="SerializeProps(object?, IJsonTypeInfoResolver?)"/>, keyed by resolver reference so a
    /// process using a small, stable set of resolver singletons (e.g. hand-written JsonSerializerContexts)
    /// never rebuilds options per call.
    /// </summary>
    private static readonly ConcurrentDictionary<IJsonTypeInfoResolver, JsonSerializerOptions> CombinedOptionsCache = new();

    private static JsonSerializerOptions CreateDefaultOptions()
    {
        return new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault,
            Encoder = JavaScriptEncoder.Default,
            WriteIndented = false,
            MaxDepth = 32,
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            TypeInfoResolver = CreateReflectionResolver(),
            Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
        };
    }

    /// <summary>
    /// Builds the reflection-based fallback resolver that excludes [IslandIgnore]-tagged properties. Extracted
    /// so it can be reused both for the default <see cref="Options"/> and as the fallback link of a combined
    /// resolver chain built in <see cref="GetCombinedOptions"/> (each JsonTypeInfoResolver instance must only
    /// ever be attached to one JsonSerializerOptions, so the combined chain needs its own fresh instance).
    /// </summary>
    private static DefaultJsonTypeInfoResolver CreateReflectionResolver()
    {
        var resolver = new DefaultJsonTypeInfoResolver();
        resolver.Modifiers.Add(static typeInfo =>
        {
            if (typeInfo.Kind != JsonTypeInfoKind.Object) return;
            foreach (var prop in typeInfo.Properties)
            {
                if (prop.AttributeProvider?.IsDefined(typeof(IslandIgnoreAttribute), true) == true)
                {
                    prop.ShouldSerialize = static (_, _) => false;
                }
            }
        });
        return resolver;
    }

    /// <summary>
    /// Serializes props into an HTML-safe JSON string for data-props attributes.
    /// </summary>
    /// <param name="props">The props object or viewmodel to serialize.</param>
    /// <returns>HTML-safe JSON string.</returns>
    /// <exception cref="IslandSerializationException">Thrown when serialization fails due to depth or structure constraints.</exception>
    public static string SerializeProps(object? props) => SerializeProps(props, additionalResolver: null);

    /// <summary>
    /// Serializes props into an HTML-safe JSON string for data-props attributes, optionally resolving type
    /// metadata through <paramref name="additionalResolver"/> first (ahead of the default reflection-based
    /// resolver). This is the seam a caller in another assembly (e.g. LaughTale.Components) can use to plug
    /// in its own source-generated JsonSerializerContext for specific, statically-known types without
    /// LaughTale.Core ever referencing that assembly directly: Core stays generic and just accepts any
    /// <see cref="IJsonTypeInfoResolver"/> the caller hands it, per-call, with no shared mutable static state
    /// and no dependency on DI-registration ordering. Types the additional resolver doesn't know about still
    /// fall through to the reflection-based resolver, so this composes safely with dynamic/arbitrary values.
    /// </summary>
    /// <remarks>
    /// ROADMAP.v5.md Part J: this overload exists but is not currently exercised by any caller with a real,
    /// working resolver. The natural candidate - LaughTale.Components combining in the JsonSerializerContext
    /// it generates for its per-island "WireProps" record types (see LaughTale.Generators.IslandGenerator) -
    /// does not work: System.Text.Json's own [JsonSerializable] source generator cannot fully introspect a
    /// type produced by a different Roslyn generator, confirmed empirically (SYSLIB1030 for every such type,
    /// even when the JsonSerializerContext class itself was moved to hand-written, checked-in source). It
    /// would work for a context built entirely from hand-written types with no generator involvement at all
    /// (verified with a throwaway probe type) - see IslandJsonTests.cs for a regression test proving the
    /// combining mechanism itself is correct given such a resolver.
    /// </remarks>
    /// <param name="props">The props object or viewmodel to serialize.</param>
    /// <param name="additionalResolver">
    /// An optional resolver (typically a source-generated JsonSerializerContext) tried before the default
    /// reflection-based resolver. Pass null to use <see cref="Options"/> unchanged.
    /// </param>
    /// <exception cref="IslandSerializationException">Thrown when serialization fails due to depth or structure constraints.</exception>
    public static string SerializeProps(object? props, IJsonTypeInfoResolver? additionalResolver)
    {
        if (props == null) return "{}";
        var options = additionalResolver is null ? Options : GetCombinedOptions(additionalResolver);
        try
        {
            return JsonSerializer.Serialize(props, options);
        }
        catch (JsonException ex)
        {
            var typeName = props.GetType().FullName ?? props.GetType().Name;
            throw new IslandSerializationException(
                $"Failed to serialize island props for model '{typeName}'. Ensure the object graph depth does not exceed {options.MaxDepth} levels and circular references are resolved. Detail: {ex.Message}",
                props.GetType(),
                ex);
        }
    }

    private static JsonSerializerOptions GetCombinedOptions(IJsonTypeInfoResolver additionalResolver)
    {
        return CombinedOptionsCache.GetOrAdd(additionalResolver, static resolver =>
        {
            // Copy-construct from Options to inherit every other setting (naming policy, encoder, depth,
            // cycle handling, converters) and only swap the resolver chain: the additional resolver first,
            // falling back to a fresh reflection resolver for anything it doesn't recognize.
            return new JsonSerializerOptions(Options)
            {
                TypeInfoResolver = JsonTypeInfoResolver.Combine(resolver, CreateReflectionResolver())
            };
        });
    }
}
