using Microsoft.AspNetCore.Mvc.RazorPages;
using SoftMax.LaughTale.Components.Models;

namespace SoftMax.LaughTale.Showcase.Pages;

public class EnterpriseModel : PageModel
{
    public List<StepperStep> StepperSteps { get; set; } = new()
    {
        new("step-1", "Personal Identity", "Biometric verification", "1"),
        new("step-2", "Department Assignment", "Organizational unit", "2"),
        new("step-3", "Security Clearance", "Audit review & sign-off", "3")
    };

    public List<TimelineItem> AuditEvents { get; set; } = new()
    {
        new("1", "TLS 1.3 Handshake Established", "Zero-Trust session authenticated via OAuth2 Bearer token.", "14:45:12", "completed", "Gateway-Proxy-01", "🔒"),
        new("2", "Biometric Facial Recognition", "Face geometry match 99.4% confidence score.", "14:46:05", "completed", "Camera-Engine", "📸"),
        new("3", "Department Role Allocation", "Security clearance escalated to Level 4 Tier.", "14:48:30", "in_progress", "Auth-Worker-03", "⚡"),
        new("4", "Cryptographic Sign-Off", "Awaiting HSM hardware certificate validation.", "14:50:00", "warning", "HSM-Cluster", "⏳")
    };

    public List<DataGridCol> GridColumns { get; set; } = new()
    {
        new("id", "ID", true),
        new("name", "Operator Name", true),
        new("role", "Access Role", true),
        new("status", "Status", true),
        new("latency", "Latency", true)
    };

    public List<object> GridRecords { get; set; } = new()
    {
        new { id = "USR-101", name = "Alice Montgomery", role = "Security Architect", status = "Active", latency = "4ms" },
        new { id = "USR-102", name = "David Vance", role = "Cloud Engineer", status = "Active", latency = "8ms" },
        new { id = "USR-103", name = "Elena Rostova", role = "Database Lead", status = "Idle", latency = "12ms" },
        new { id = "USR-104", name = "Marcus Thorne", role = "Site Reliability Eng", status = "Active", latency = "2ms" },
        new { id = "USR-105", name = "Sarah Jenkins", role = "Cryptographer", status = "Offline", latency = "95ms" },
        new { id = "USR-106", name = "Thomas Wright", role = "SecOps Lead", status = "Active", latency = "5ms" }
    };

    public List<TreeNode> DepartmentTree { get; set; } = new()
    {
        new("dept-1", "Executive Command", "HQ-01", new()
        {
            new("dept-1-1", "Strategic Governance", "HQ-01-A"),
            new("dept-1-2", "Global Compliance", "HQ-01-B")
        }),
        new("dept-2", "Core Infrastructure", "ENG-02", new()
        {
            new("dept-2-1", "Kernel & Runtime", "ENG-02-A"),
            new("dept-2-2", "Zero-Trust Security", "ENG-02-B"),
            new("dept-2-3", "High-Availability Storage", "ENG-02-C")
        })
    };

    public List<SelectButtonItem> Periods { get; set; } = new()
    {
        new("Daily", "daily"),
        new("Weekly", "weekly"),
        new("Monthly", "monthly"),
        new("Annual", "annual")
    };

    public List<MeterValue> StorageMetrics { get; set; } = new()
    {
        new("OS Kernel", 35, "#10b981"),
        new("Database", 30, "#3b82f6"),
        new("Encrypted Logs", 20, "#f59e0b"),
        new("Available", 15, "#94a3b8")
    };

    public List<AvatarItem> TeamAvatars { get; set; } = new()
    {
        new("AM", null, "Alice Montgomery", "#059669"),
        new("DV", null, "David Vance", "#2563eb"),
        new("ER", null, "Elena Rostova", "#7c3aed"),
        new("MT", null, "Marcus Thorne", "#d97706"),
        new("SJ", null, "Sarah Jenkins", "#dc2626"),
        new("TW", null, "Thomas Wright", "#475569")
    };

    public List<SpeedDialAction> QuickActions { get; set; } = new()
    {
        new("Sync Cluster", null, "sync"),
        new("Export Audit Logs", null, "export"),
        new("Trigger Backup", null, "backup")
    };

    public void OnGet()
    {
    }
}
