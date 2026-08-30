namespace LaughTale.Core.Serialization;

/// <summary>
/// Exception thrown when Island props serialization fails due to recursion depth violations or cyclic model constraints.
/// </summary>
public class IslandSerializationException : Exception
{
    /// <summary>
    /// The runtime type of the props object being serialized.
    /// </summary>
    public Type? PropsType { get; }

    public IslandSerializationException(string message, Type? propsType = null, Exception? innerException = null)
        : base(message, innerException)
    {
        PropsType = propsType;
    }
}
