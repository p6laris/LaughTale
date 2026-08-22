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
        new("1", "TLS 1.3 Handshake Established", "Zero-Trust session authenticated via OAuth2 Bearer token.", DateTimeOffset.UtcNow.AddMinutes(-15), SoftMax.LaughTale.Components.Enums.TimelineStatus.Completed, "Gateway-Proxy-01", "🔒"),
        new("2", "Biometric Facial Recognition", "Face geometry match 99.4% confidence score.", DateTimeOffset.UtcNow.AddMinutes(-10), SoftMax.LaughTale.Components.Enums.TimelineStatus.Completed, "Camera-Engine", "📸"),
        new("3", "Department Role Allocation", "Security clearance escalated to Level 4 Tier.", DateTimeOffset.UtcNow.AddMinutes(-5), SoftMax.LaughTale.Components.Enums.TimelineStatus.InProgress, "Auth-Worker-03", "⚡"),
        new("4", "Cryptographic Sign-Off", "Awaiting HSM hardware certificate validation.", DateTimeOffset.UtcNow, SoftMax.LaughTale.Components.Enums.TimelineStatus.Warning, "HSM-Cluster", "⏳")
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

    public List<AccordionTab> AccordionTabs { get; set; } = new()
    {
        new("tab-1", "Zero-Trust Architecture", "Every network request and internal IPC transaction is authenticated and encrypted via mutual TLS 1.3 with ephemeral cryptographic tokens.", "🔒"),
        new("tab-2", "Islands Hydration Lifecycle", "LaughTale detects interactive islands at compile-time and only ships sub-1KB micro-bundles for the exact components on the page.", "⚡"),
        new("tab-3", "Hardware Security Module (HSM)", "FIPS 140-3 Level 4 physical tamper-resistant hardware key generation with automated annual key rotations.", "🛡️")
    };

    public List<TabItem> TabSections { get; set; } = new()
    {
        new("t-1", "Cluster Health", "All 18 core services running at nominal latency (< 5ms). Zero anomalous egress detected across all cloud regions.", "⚡"),
        new("t-2", "Threat Monitoring", "Real-time AI behavioral anomaly detection active. 0 critical vulnerabilities identified across the runtime layer.", "🛡️"),
        new("t-3", "Backup & Snapshots", "Geo-redundant automated continuous volume backups synchronized with RPO < 15s and RTO < 60s.", "💾")
    };

    public List<AutoCompleteItem> CityOptions { get; set; } = new()
    {
        new("Erbil, Kurdistan Region", "EBL", "Kurdistan"),
        new("Sulaymaniyah, Kurdistan Region", "SUL", "Kurdistan"),
        new("Duhok, Kurdistan Region", "DHK", "Kurdistan"),
        new("Baghdad, Iraq", "BGW", "Iraq"),
        new("Basra, Iraq", "BSR", "Iraq")
    };

    public List<BreadcrumbItem> Breadcrumbs { get; set; } = new()
    {
        new("Enterprise Hub", "/enterprise"),
        new("Security Clusters", "/enterprise#security"),
        new("Node Zero-Trust #01")
    };

    public void OnGet()
    {
    }
}
