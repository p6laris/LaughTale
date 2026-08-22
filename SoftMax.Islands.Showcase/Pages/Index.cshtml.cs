using Microsoft.AspNetCore.Mvc.RazorPages;
using SoftMax.Islands.Showcase.Models;

namespace SoftMax.Islands.Showcase.Pages;

public class IndexModel : PageModel
{
    public List<DepartmentNode> Departments { get; set; } = new();

    public void OnGet()
    {
        Departments = new List<DepartmentNode>
        {
            new("eng", "Engineering & Product", new List<DepartmentNode>
            {
                new("eng-core", "Core Architecture", new List<DepartmentNode>
                {
                    new("eng-compiler", "Roslyn Generator Team"),
                    new("eng-runtime", "Client Hydration Runtime")
                }),
                new("eng-platform", "Platform Services", new List<DepartmentNode>
                {
                    new("eng-gateway", "API Gateway & Edge"),
                    new("eng-security", "Identity & Access")
                })
            }),
            new("data", "Data & Machine Learning", new List<DepartmentNode>
            {
                new("data-infra", "Streaming Infrastructure"),
                new("data-analytics", "Real-Time Telemetry")
            }),
            new("design", "Design Systems", new List<DepartmentNode>
            {
                new("design-tokens", "Aura Component Library"),
                new("design-accessibility", "WCAG 2.2 Standards")
            })
        };
    }
}
