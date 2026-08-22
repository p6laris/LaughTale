using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SoftMax.Islands.Core.Serialization;

/// <summary>
/// High-performance JSON serializer optimized for Island HTML attribute injection.
/// </summary>
public static class IslandJson
{
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.Default,
        WriteIndented = false
    };

    /// <summary>
    /// Serializes props into an HTML-safe JSON string for data-props attributes.
    /// </summary>
    public static string SerializeProps(object? props)
    {
        if (props == null) return "{}";
        return JsonSerializer.Serialize(props, Options);
    }
}
