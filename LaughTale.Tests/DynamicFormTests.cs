using System.ComponentModel.DataAnnotations;
using LaughTale.Components.Forms;
using Xunit;

namespace LaughTale.Tests;

public class TestUserProfile
{
    [Required]
    [Display(Name = "Full Legal Name", Prompt = "e.g. John Doe")]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [DataType(DataType.Password)]
    [StringLength(32, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [Range(18, 120)]
    public int Age { get; set; } = 25;

    public bool IsActive { get; set; } = true;
}

public class DynamicFormTests
{
    [Fact]
    public void DynamicFormSchemaGenerator_ExtractsPropertiesAndValidationRules()
    {
        var model = new TestUserProfile { FullName = "Alice Smith", Email = "alice@laughtale.dev", Age = 30 };
        var schema = DynamicFormSchemaGenerator.FromModel(model, "Account Registration", "/api/register");

        Assert.Equal("Account Registration", schema.Title);
        Assert.Equal("/api/register", schema.SubmitUrl);
        Assert.Equal(5, schema.Fields.Count);

        var nameField = schema.Fields.First(f => f.Name == nameof(TestUserProfile.FullName));
        Assert.Equal("Full Legal Name", nameField.Label);
        Assert.True(nameField.IsRequired);
        Assert.Equal("Alice Smith", nameField.DefaultValue);

        var emailField = schema.Fields.First(f => f.Name == nameof(TestUserProfile.Email));
        Assert.Equal(FormFieldType.Email, emailField.FieldType);
        Assert.True(emailField.IsRequired);

        var passField = schema.Fields.First(f => f.Name == nameof(TestUserProfile.Password));
        Assert.Equal(FormFieldType.Password, passField.FieldType);
        Assert.Equal(8, passField.MinLength);
        Assert.Equal(32, passField.MaxLength);

        var ageField = schema.Fields.First(f => f.Name == nameof(TestUserProfile.Age));
        Assert.Equal(FormFieldType.Number, ageField.FieldType);
        Assert.Equal(18, ageField.Min);
        Assert.Equal(120, ageField.Max);

        var activeField = schema.Fields.First(f => f.Name == nameof(TestUserProfile.IsActive));
        Assert.Equal(FormFieldType.Switch, activeField.FieldType);
    }
}
