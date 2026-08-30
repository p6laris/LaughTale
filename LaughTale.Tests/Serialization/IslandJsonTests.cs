using LaughTale.Core.Attributes;
using LaughTale.Core.Serialization;
using Xunit;

namespace LaughTale.Tests.Serialization;

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
}
