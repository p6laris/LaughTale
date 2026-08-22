using Microsoft.AspNetCore.Mvc.RazorPages;
using SoftMax.LaughTale.Components.Models;

namespace SoftMax.LaughTale.Showcase.Pages;

public class DashboardModel : PageModel
{
    public List<MeterValue> SystemHealthMeters { get; set; } = new()
    {
        new("CPU Cluster", 42.5, "#10b981"),
        new("Memory Pool", 68.0, "#3b82f6"),
        new("I/O Throughput", 24.1, "#f59e0b"),
        new("Network Ingress", 12.8, "#8b5cf6")
    };

    public List<DataGridCol> AuditCols { get; set; } = new()
    {
        new("id", "Transaction ID", true),
        new("actor", "Security Principal", true),
        new("action", "Operation", true),
        new("status", "Result", true),
        new("timestamp", "Execution Time", true)
    };

    public List<Dictionary<string, object>> AuditRows { get; set; } = new()
    {
        new() { { "id", "TX-9021" }, { "actor", "sec-admin@softmax.dev" }, { "action", "Rotate HMAC Signing Key" }, { "status", "Success" }, { "timestamp", "1 min ago" } },
        new() { { "id", "TX-9022" }, { "actor", "gateway-worker-04" }, { "action", "Batch Token Issuance" }, { "status", "Success" }, { "timestamp", "3 mins ago" } },
        new() { { "id", "TX-9023" }, { "actor", "audit-crawler" }, { "action", "Vulnerability Scan" }, { "status", "Completed" }, { "timestamp", "12 mins ago" } },
        new() { { "id", "TX-9024" }, { "actor", "devops-lead@softmax.dev" }, { "action", "Deploy Net10 Islands Node" }, { "status", "Success" }, { "timestamp", "24 mins ago" } }
    };

    public List<CommandPaletteItem> CommandItems { get; set; } = new()
    {
        new("dash", "Open Enterprise Dashboard", "Navigation", "bar-chart", "G D", "/dashboard"),
        new("showcase", "Showcase Components Suite", "Navigation", "layers", "G S", "/enterprise"),
        new("docs", "Documentation Portal", "Navigation", "file-text", "G P", "/doc/01-getting-started"),
        new("studio", "Launch TweakAura Theme Studio", "Theme & Customization", "palette", "T S", null, "open-studio"),
        new("theme-toggle", "Toggle Dark / Light Mode", "Theme & Customization", "moon", "T D", null, "toggle-dark"),
        new("export", "Export CSS Variables", "Theme & Customization", "copy", null, null, "export-css")
    };

    public void OnGet()
    {
    }
}
