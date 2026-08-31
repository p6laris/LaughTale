using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Showcase.Models;

namespace LaughTale.Showcase.Pages;

public record ShowcaseOrder(int Id, string Customer, string Product, decimal Amount, string Status);

public class IndexModel : PageModel
{
    public List<DepartmentNode> Departments { get; set; } = new();
    public List<ShowcaseOrder> SampleOrders { get; set; } = new();

    public void OnGet()
    {
        SampleOrders = new List<ShowcaseOrder>
        {
            new(101, "Alice Morgan", "MacBook Pro M3", 2499.00m, "Completed"),
            new(102, "Braden Vance", "UltraWide 49\" Monitor", 1199.50m, "Processing"),
            new(103, "Darya Karimi", "Mechanical Keyboard", 189.00m, "Shipped"),
            new(104, "Soran Ahmed", "Cloud Database Node", 850.00m, "Completed")
        };
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
