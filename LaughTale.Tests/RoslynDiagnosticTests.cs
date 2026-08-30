using System.Text.RegularExpressions;
using Xunit;

namespace LaughTale.Tests;

public class RoslynDiagnosticTests
{
    private static readonly Regex KebabCaseRegex = new(@"^[a-z0-9]+(-[a-z0-9]+)*$", RegexOptions.Compiled);
    private static readonly Regex SensitivePropertyPattern = new(
        @"password|secret|token|hash|apikey|connectionstring|passwd|pwd|privatekey",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly HashSet<string> BannedTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "System.Threading.CancellationToken",
        "System.IO.Stream",
        "System.IntPtr",
        "System.UIntPtr",
        "System.Delegate",
        "System.Action",
        "System.Func",
        "System.Threading.Tasks.Task",
        "System.Threading.Tasks.ValueTask"
    };

    [Theory]
    [InlineData("valid-island", true)]
    [InlineData("user-profile-widget", true)]
    [InlineData("counter", true)]
    [InlineData("InvalidCamelCase", false)]
    [InlineData("snake_case_name", false)]
    [InlineData("trailing-dash-", false)]
    [InlineData("-leading-dash", false)]
    [InlineData("double--dash", false)]
    public void SMI001_Validates_KebabCase_Island_Names(string name, bool isValid)
    {
        var match = KebabCaseRegex.IsMatch(name);
        Assert.Equal(isValid, match);
    }

    [Theory]
    [InlineData("System.Threading.CancellationToken", true)]
    [InlineData("System.IO.Stream", true)]
    [InlineData("System.Threading.Tasks.Task", true)]
    [InlineData("System.String", false)]
    [InlineData("System.Int32", false)]
    [InlineData("System.Collections.Generic.List<string>", false)]
    public void SMI002_Identifies_NonSerializable_Banned_Types(string typeFullName, bool isBanned)
    {
        var banned = BannedTypes.Contains(typeFullName);
        Assert.Equal(isBanned, banned);
    }

    [Theory]
    [InlineData("UserPassword", true)]
    [InlineData("ApiSecretToken", true)]
    [InlineData("ApiKey", true)]
    [InlineData("DbConnectionString", true)]
    [InlineData("AdminHash", true)]
    [InlineData("UserName", false)]
    [InlineData("UserEmail", false)]
    [InlineData("TotalAmount", false)]
    public void SMI004_Detects_Sensitive_Credential_Property_Names(string propertyName, bool isSensitive)
    {
        var match = SensitivePropertyPattern.IsMatch(propertyName);
        Assert.Equal(isSensitive, match);
    }
}
