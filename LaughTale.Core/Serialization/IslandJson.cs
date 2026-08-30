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
    /// and excludes properties decorated with [IslandIgnore].
    /// </summary>
    public static readonly JsonSerializerOptions Options = CreateDefaultOptions();

    private static JsonSerializerOptions CreateDefaultOptions()
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

        return new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            Encoder = JavaScriptEncoder.Default,
            WriteIndented = false,
            MaxDepth = 32,
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            TypeInfoResolver = resolver
        };
    }

    /// <summary>
    /// Serializes props into an HTML-safe JSON string for data-props attributes.
    /// </summary>
    /// <param name="props">The props object or viewmodel to serialize.</param>
    /// <returns>HTML-safe JSON string.</returns>
    /// <exception cref="IslandSerializationException">Thrown when serialization fails due to depth or structure constraints.</exception>
    public static string SerializeProps(object? props)
    {
        if (props == null) return "{}";
        try
        {
            return JsonSerializer.Serialize(props, Options);
        }
        catch (JsonException ex)
        {
            var typeName = props.GetType().FullName ?? props.GetType().Name;
            throw new IslandSerializationException(
                $"Failed to serialize island props for model '{typeName}'. Ensure the object graph depth does not exceed {Options.MaxDepth} levels and circular references are resolved. Detail: {ex.Message}",
                props.GetType(),
                ex);
        }
    }
}
