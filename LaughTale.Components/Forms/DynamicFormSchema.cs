using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace LaughTale.Components.Forms;

public enum FormFieldType
{
    Text,
    Password,
    Email,
    Multiline,
    Number,
    Currency,
    Switch,
    DatePicker,
    Select,
    Chips,
    ColorPicker
}

public record FormFieldOption(string Label, string Value);

public record FormFieldMetadata(
    string Name,
    string Label,
    FormFieldType FieldType,
    object? DefaultValue,
    bool IsRequired,
    string? Placeholder = null,
    string? HelpText = null,
    double? Min = null,
    double? Max = null,
    int? MinLength = null,
    int? MaxLength = null,
    string? Pattern = null,
    List<FormFieldOption>? Options = null
);

public record DynamicFormSchema(
    string Title,
    string? Description,
    List<FormFieldMetadata> Fields,
    string? SubmitUrl = null,
    string SubmitLabel = "Submit",
    string Method = "POST"
);

public static class DynamicFormSchemaGenerator
{
    public static DynamicFormSchema FromModel<T>(T? modelInstance = null, string? title = null, string? submitUrl = null) where T : class
    {
        return FromType(typeof(T), modelInstance, title, submitUrl);
    }

    public static DynamicFormSchema FromType(Type type, object? modelInstance = null, string? title = null, string? submitUrl = null)
    {
        var displayAttr = type.GetCustomAttribute<DisplayAttribute>();
        var formTitle = title ?? displayAttr?.GetName() ?? type.Name;
        var formDescription = displayAttr?.GetDescription();

        var fields = new List<FormFieldMetadata>();

        var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (var prop in properties)
        {
            if (!prop.CanRead) continue;

            var propDisplay = prop.GetCustomAttribute<DisplayAttribute>();
            var label = propDisplay?.GetName() ?? prop.Name;
            var placeholder = propDisplay?.GetPrompt();
            var helpText = propDisplay?.GetDescription();

            var isRequired = prop.GetCustomAttribute<RequiredAttribute>() != null;
            var rangeAttr = prop.GetCustomAttribute<RangeAttribute>();
            var stringLengthAttr = prop.GetCustomAttribute<StringLengthAttribute>();
            var minLengthAttr = prop.GetCustomAttribute<MinLengthAttribute>();
            var maxLengthAttr = prop.GetCustomAttribute<MaxLengthAttribute>();
            var regexAttr = prop.GetCustomAttribute<RegularExpressionAttribute>();
            var dataTypeAttr = prop.GetCustomAttribute<DataTypeAttribute>();
            var emailAttr = prop.GetCustomAttribute<EmailAddressAttribute>();

            object? defaultValue = modelInstance != null ? prop.GetValue(modelInstance) : null;

            var fieldType = DetermineFieldType(prop.PropertyType, dataTypeAttr, emailAttr);
            List<FormFieldOption>? options = null;

            var unwrappedType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
            if (unwrappedType.IsEnum)
            {
                options = Enum.GetValues(unwrappedType)
                    .Cast<Enum>()
                    .Select(e =>
                    {
                        var memInfo = unwrappedType.GetMember(e.ToString());
                        var enumDisplay = memInfo.FirstOrDefault()?.GetCustomAttribute<DisplayAttribute>();
                        return new FormFieldOption(enumDisplay?.GetName() ?? e.ToString(), e.ToString());
                    })
                    .ToList();
            }

            double? min = rangeAttr?.Minimum != null ? Convert.ToDouble(rangeAttr.Minimum) : null;
            double? max = rangeAttr?.Maximum != null ? Convert.ToDouble(rangeAttr.Maximum) : null;
            int? minLength = stringLengthAttr?.MinimumLength > 0 ? stringLengthAttr.MinimumLength : minLengthAttr?.Length;
            int? maxLength = stringLengthAttr?.MaximumLength > 0 ? stringLengthAttr.MaximumLength : maxLengthAttr?.Length;

            fields.Add(new FormFieldMetadata(
                Name: prop.Name,
                Label: label,
                FieldType: fieldType,
                DefaultValue: defaultValue,
                IsRequired: isRequired,
                Placeholder: placeholder,
                HelpText: helpText,
                Min: min,
                Max: max,
                MinLength: minLength,
                MaxLength: maxLength,
                Pattern: regexAttr?.Pattern,
                Options: options
            ));
        }

        return new DynamicFormSchema(
            Title: formTitle,
            Description: formDescription,
            Fields: fields,
            SubmitUrl: submitUrl
        );
    }

    private static FormFieldType DetermineFieldType(Type type, DataTypeAttribute? dataType, EmailAddressAttribute? email)
    {
        var unwrapped = Nullable.GetUnderlyingType(type) ?? type;

        if (email != null || dataType?.DataType == DataType.EmailAddress)
            return FormFieldType.Email;

        if (dataType?.DataType == DataType.Password)
            return FormFieldType.Password;

        if (dataType?.DataType == DataType.MultilineText)
            return FormFieldType.Multiline;

        if (dataType?.DataType == DataType.Currency)
            return FormFieldType.Currency;

        if (dataType?.DataType == DataType.Date || dataType?.DataType == DataType.DateTime ||
            unwrapped == typeof(DateTime) || unwrapped == typeof(DateOnly) || unwrapped == typeof(DateTimeOffset))
            return FormFieldType.DatePicker;

        if (unwrapped == typeof(bool))
            return FormFieldType.Switch;

        if (unwrapped == typeof(int) || unwrapped == typeof(long) || unwrapped == typeof(double) ||
            unwrapped == typeof(float) || unwrapped == typeof(decimal) || unwrapped == typeof(short))
            return FormFieldType.Number;

        if (unwrapped.IsEnum)
            return FormFieldType.Select;

        if (typeof(System.Collections.IEnumerable).IsAssignableFrom(unwrapped) && unwrapped != typeof(string))
            return FormFieldType.Chips;

        return FormFieldType.Text;
    }
}
