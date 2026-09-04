namespace LaughTale.Core.Attributes;

/// <summary>
/// Defines the wire shape of a form control value: Single, Multiple, or Boolean.
/// </summary>
public enum FormCardinality
{
    Single,
    Multiple,
    Boolean
}

/// <summary>
/// Defines whether the field element is a client-hidden element or an existing native input/textarea/select.
/// </summary>
public enum FormFieldKind
{
    Hidden,
    Native
}

/// <summary>
/// Marks a component props record as contributing one or more named values to an enclosing form.
/// Triggers Roslyn source generation for asp-for / name model binding and server-rendered field emission.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct, AllowMultiple = false, Inherited = false)]
public sealed class FormControlAttribute : Attribute
{
    /// <summary>
    /// Name of the property on the props record that holds the value to server-render. Default is "Value".
    /// </summary>
    public string ValueProperty { get; set; } = "Value";

    /// <summary>
    /// Wire shape for the form value: Single, Multiple, or Boolean.
    /// </summary>
    public FormCardinality Cardinality { get; set; } = FormCardinality.Single;

    /// <summary>
    /// Hidden (the widget is client-drawn) or Native (the control renders a native input element).
    /// </summary>
    public FormFieldKind FieldKind { get; set; } = FormFieldKind.Hidden;

    public FormControlAttribute() { }

    public FormControlAttribute(FormCardinality cardinality)
    {
        Cardinality = cardinality;
    }
}
