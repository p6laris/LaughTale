using System.Reflection;
using LaughTale.Components.Models;
using LaughTale.Core.Attributes;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

public class FormControlCoverageTests
{
    private static readonly Type[] ExpectedFormControlProps =
    [
        // Batch 1: Text-like controls (10)
        typeof(InputTextProps),
        typeof(TextareaProps),
        typeof(InputPasswordProps),
        typeof(InputNumberProps),
        typeof(InputMaskProps),
        typeof(InputOtpProps),
        typeof(InputTagsProps),
        typeof(ColorPickerProps),
        typeof(KnobProps),
        typeof(RatingProps),

        // Batch 2: Choice controls (10)
        typeof(CheckboxProps),
        typeof(RadioButtonProps),
        typeof(ToggleSwitchProps),
        typeof(ToggleButtonProps),
        typeof(SelectButtonProps),
        typeof(SelectProps),
        typeof(MultiSelectProps),
        typeof(ListboxProps),
        typeof(CascadeSelectProps),
        typeof(TreeSelectProps),

        // Batch 3: Composite & Collection controls (9)
        typeof(AutoCompleteProps),
        typeof(DatePickerProps),
        typeof(SliderProps),
        typeof(OrderListProps),
        typeof(PickListProps),
        typeof(OrgChartProps),
        typeof(PaginatorProps),
        typeof(DropzoneProps),
        typeof(InplaceProps)
    ];

    [Fact]
    public void ExactlyTwentyNinePropsRecords_HaveFormControlAttribute()
    {
        var assembly = typeof(InputTextProps).Assembly;
        var decoratedTypes = assembly.GetTypes()
            .Where(t => t.GetCustomAttribute<FormControlAttribute>() != null)
            .ToList();

        Assert.Equal(29, decoratedTypes.Count);
    }

    [Theory]
    [MemberData(nameof(GetExpectedFormControlTypes))]
    public void ExpectedPropsRecord_HasFormControlAttributeAndNameProperty(Type propsType)
    {
        var formControlAttr = propsType.GetCustomAttribute<FormControlAttribute>();
        Assert.NotNull(formControlAttr);

        // Every FormControl record must have a name-bearing property (Name, TargetInputName, or TargetInput)
        var hasNameProp = propsType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Any(p => p.Name is "Name" or "TargetInputName" or "TargetInput");

        Assert.True(hasNameProp, $"{propsType.Name} is missing a name-bearing property (Name, TargetInputName, or TargetInput).");
    }

    public static IEnumerable<object[]> GetExpectedFormControlTypes()
    {
        foreach (var type in ExpectedFormControlProps)
        {
            yield return new object[] { type };
        }
    }
}
