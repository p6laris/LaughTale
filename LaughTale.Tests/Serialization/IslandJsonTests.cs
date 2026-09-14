using System.Text.Json;
using System.Text.Json.Serialization;
using LaughTale.Core.Attributes;
using LaughTale.Core.Serialization;
using Xunit;

namespace LaughTale.Tests.Serialization;

// Fully hand-written type + context (no Roslyn generator involvement of any kind, and top-level rather than
// nested so the source generator doesn't additionally require every containing type to be partial) used to
// prove IslandJson.SerializeProps(object?, IJsonTypeInfoResolver?)'s combining mechanism itself is correct -
// see that method's <remarks> in IslandJson.cs for why a generator-emitted type can't be used for this
// instead.
internal sealed record HandWrittenWireProps
{
    public string Value { get; init; } = default!;
    public bool Disabled { get; init; }
    public object? Extra { get; init; }
}

[JsonSerializable(typeof(HandWrittenWireProps))]
internal partial class HandWrittenJsonContext : JsonSerializerContext
{
}

public class IslandJsonTests
{
    private class SimpleProps
    {
        public string Title { get; set; } = "Hello";
        public int Count { get; set; } = 42;
    }

    private class CyclicNode
    {
        public string Name { get; set; } = "Root";
        public CyclicNode? Next { get; set; }
    }

    private class SensitiveUserProps
    {
        public string Username { get; set; } = "johndoe";
        public string Email { get; set; } = "john@example.com";

        [IslandIgnore]
        public string PasswordHash { get; set; } = "$2a$12$e8h1l4SecretHashedValue";

        [IslandIgnore]
        public string ApiSecretKey { get; set; } = "sk_live_987654321";
    }

    private class DeepNode
    {
        public string Value { get; set; } = "Level";
        public DeepNode? Child { get; set; }
    }

    [Fact]
    public void SerializeProps_WithSimpleObject_ReturnsExpectedJson()
    {
        var props = new SimpleProps { Title = "Dashboard", Count = 100 };
        var json = IslandJson.SerializeProps(props);

        Assert.Contains("\"title\":\"Dashboard\"", json);
        Assert.Contains("\"count\":100", json);
    }

    [Fact]
    public void SerializeProps_WithNull_ReturnsEmptyJsonObject()
    {
        var json = IslandJson.SerializeProps(null);
        Assert.Equal("{}", json);
    }

    [Fact]
    public void SerializeProps_WithCyclicReference_IgnoresCycleWithoutCrashing()
    {
        var node1 = new CyclicNode { Name = "Node 1" };
        var node2 = new CyclicNode { Name = "Node 2" };
        node1.Next = node2;
        node2.Next = node1; // Circular loop

        var json = IslandJson.SerializeProps(node1);

        Assert.NotNull(json);
        Assert.Contains("\"name\":\"Node 1\"", json);
        Assert.Contains("\"name\":\"Node 2\"", json);
    }

    [Fact]
    public void SerializeProps_WithIslandIgnoreAttribute_ExcludesIgnoredProperties()
    {
        var user = new SensitiveUserProps();
        var json = IslandJson.SerializeProps(user);

        Assert.Contains("\"username\":\"johndoe\"", json);
        Assert.Contains("\"email\":\"john@example.com\"", json);
        Assert.DoesNotContain("passwordHash", json);
        Assert.DoesNotContain("SecretHashedValue", json);
        Assert.DoesNotContain("apiSecretKey", json);
        Assert.DoesNotContain("sk_live_987654321", json);
    }

    [Fact]
    public void SerializeProps_ExceedingMaxDepth_ThrowsDescriptiveIslandSerializationException()
    {
        // Build a graph deeper than 32 levels (MaxDepth = 32)
        var root = new DeepNode { Value = "L0" };
        var current = root;
        for (int i = 1; i <= 35; i++)
        {
            var next = new DeepNode { Value = $"L{i}" };
            current.Child = next;
            current = next;
        }

        var ex = Assert.Throws<IslandSerializationException>(() => IslandJson.SerializeProps(root));
        Assert.NotNull(ex.PropsType);
        Assert.Equal(typeof(DeepNode), ex.PropsType);
        Assert.Contains("DeepNode", ex.Message);
        Assert.Contains("depth", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void SerializeProps_WithAdditionalResolver_UsesItForKnownTypeAndOmitsDefaults()
    {
        var props = new HandWrittenWireProps { Value = "hello", Disabled = false };

        var json = IslandJson.SerializeProps(props, HandWrittenJsonContext.Default);

        Assert.Contains("\"value\":\"hello\"", json);
        // Disabled == default(bool) (false): WhenWritingDefault must still apply through the combined
        // resolver's JsonSerializerOptions, not just through the reflection-only Options path.
        Assert.DoesNotContain("disabled", json);
    }

    [Fact]
    public void SerializeProps_WithAdditionalResolver_FallsBackToReflectionForUnknownRuntimeType()
    {
        // Extra is object?-typed and holds an anonymous type the additional resolver has never heard of -
        // this must still resolve via the reflection-based fallback within the SAME combined options,
        // exactly like a TagHelper's pt/studio-overrides escape hatches would.
        var props = new HandWrittenWireProps { Value = "hello", Extra = new { nested = new[] { 1, 2, 3 } } };

        var json = IslandJson.SerializeProps(props, HandWrittenJsonContext.Default);

        Assert.Contains("\"nested\":[1,2,3]", json);
    }

    [Fact]
    public void SerializeProps_WithAdditionalResolver_ReusesCachedCombinedOptionsForSameResolverInstance()
    {
        // Not directly observable from outside, but calling twice with the same resolver instance must not
        // throw (e.g. from attempting to reuse an already-locked JsonTypeInfoResolver chain) and must
        // produce identical output both times.
        var props = new HandWrittenWireProps { Value = "hello" };

        var json1 = IslandJson.SerializeProps(props, HandWrittenJsonContext.Default);
        var json2 = IslandJson.SerializeProps(props, HandWrittenJsonContext.Default);

        Assert.Equal(json1, json2);
    }
}
