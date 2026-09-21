using System.ComponentModel.DataAnnotations;
using LaughTale.Core.Configuration;

namespace LaughTale.Showcase.Configuration;

/// <summary>
/// ROADMAP.v5.md Part F "Typed config & sessions" live demo config. Bound from the "ShowcaseApp"
/// section of appsettings.json via AddLaughTaleTypedConfig - <see cref="AdminApiKey"/> stays
/// server-only (no [ClientExposed]), <see cref="PublicApiBaseUrl"/> and <see cref="FeatureFlagName"/>
/// are dehydrated into the browser's ctx.state('config').
/// </summary>
public class ShowcaseAppConfig
{
    [Required]
    public string AdminApiKey { get; set; } = "";

    [Required]
    [ClientExposed]
    public string PublicApiBaseUrl { get; set; } = "";

    [ClientExposed]
    public string FeatureFlagName { get; set; } = "";
}
