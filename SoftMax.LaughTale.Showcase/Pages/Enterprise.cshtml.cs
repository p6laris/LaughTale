using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Forms;
using SoftMax.LaughTale.Components.Models;

namespace SoftMax.LaughTale.Showcase.Pages;

public class OperatorRegistrationDto
{
    [Required]
    [Display(Name = "Full Name", Prompt = "e.g. Alice Montgomery")]
    public string FullName { get; set; } = "Alice Montgomery";

    [Required]
    [EmailAddress]
    [Display(Name = "Corporate Email", Prompt = "operator@zero-trust.io")]
    public string Email { get; set; } = "alice@zero-trust.io";

    [Required]
    [DataType(DataType.Password)]
    [StringLength(100, MinimumLength = 8)]
    [Display(Name = "HSM Master Key", Description = "Minimum 8 characters with cryptographic complexity")]
    public string MasterKey { get; set; } = "";

    [Range(1, 10)]
    [Display(Name = "Clearance Tier (1-10)", Description = "Level 4 required for kernel write access")]
    public int ClearanceTier { get; set; } = 4;

    [Display(Name = "Zero-Trust Enforcement", Description = "Enforce continuous mutual TLS 1.3 re-authentication")]
    public bool EnforceMtls { get; set; } = true;
}

public class EnterpriseModel : PageModel
{
    public DynamicFormSchema RegistrationFormSchema { get; set; } = 
        DynamicFormSchemaGenerator.FromModel<OperatorRegistrationDto>(new OperatorRegistrationDto(), "Zero-Trust Operator Registration");

    public List<SelectButtonItem> MultiSelectSkills { get; set; } = new()
    {
        new("C# / .NET 10", "dotnet"),
        new("TypeScript", "ts"),
        new("Tailwind CSS v4", "tailwind"),
        new("Zero-Trust Security", "security"),
        new("Docker & K8s", "containers")
    };

    public List<CascadeSelectNode> CascadeRegions { get; set; } = new()
    {
        new("Kurdistan Region", "kurdistan", new()
        {
            new("Erbil HQ", "erbil", new()
            {
                new("Datacenter Alpha", "ebl-dc-1"),
                new("Datacenter Beta", "ebl-dc-2")
            }),
            new("Sulaymaniyah Branch", "sul", new()
            {
                new("Primary Node", "sul-dc-1")
            })
        }),
        new("Global Regions", "international", new()
        {
            new("Europe West (Frankfurt)", "eu-west", new()
            {
                new("Edge Point 1", "fra-01"),
                new("Edge Point 2", "fra-02")
            })
        })
    };

    public List<SelectButtonItem> ListboxDatabases { get; set; } = new()
    {
        new("PostgreSQL Cluster", "postgres"),
        new("Redis Sentinel", "redis"),
        new("SQL Server Enterprise", "mssql"),
        new("ClickHouse Analytics", "clickhouse"),
        new("CockroachDB Distributed", "cockroach")
    };

    public List<PickListItem> PickListSource { get; set; } = new()
    {
        new("sec-1", "mTLS Encryption", "Active session certificate"),
        new("sec-2", "YubiKey 5 FIDO2", "Hardware token active"),
        new("sec-3", "Biometric Retina Scan", "Passkey identity matched"),
        new("sec-4", "IP Geofencing", "Within corporate subnet")
    };

    public List<PickListItem> PickListTarget { get; set; } = new()
    {
        new("sec-5", "HSM Root Key", "FIPS 140-3 L4 Hardware Key")
    };

    public List<OrderListItem> OrderListTasks { get; set; } = new()
    {
        new("t-1", "Step 1: TLS 1.3 Handshake", "Security", 1),
        new("t-2", "Step 2: OAuth 2.1 Grant", "Auth", 2),
        new("t-3", "Step 3: RBAC Evaluation", "Policy", 3),
        new("t-4", "Step 4: Audit Log Append", "Ledger", 4)
    };

    public OrgChartNode OrgChartRoot { get; set; } = new("root", "CEO Office", "Elena Rostova (Command Lead)", null, new()
    {
        new("eng", "Core Infrastructure", "David Vance (VP)", null, new()
        {
            new("kernel", "Kernel & Islands", "Alice Montgomery (Lead)"),
            new("secops", "Zero-Trust & HSM", "Thomas Wright (Lead)")
        }),
        new("ops", "SecOps Operations", "Marcus Thorne (VP)", null, new()
        {
            new("cloud", "Cluster Reliability", "Sarah Jenkins (Lead)")
        })
    });

    public List<SplitButtonItem> SplitButtonActions { get; set; } = new()
    {
        new("Export PDF Report", "📄", "export_pdf"),
        new("Trigger Cloud Backup", "💾", "backup"),
        new("Revoke Access Tokens", "🔒", "revoke")
    };

    public List<GalleriaItem> GalleriaImages { get; set; } = new()
    {
        new("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=160&auto=format&fit=crop&q=60", "Data Center Server Rack", "Cluster Primary Region"),
        new("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=160&auto=format&fit=crop&q=60", "Matrix Cryptographic Terminal", "Zero-Trust Mesh"),
        new("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=160&auto=format&fit=crop&q=60", "Real-time Telemetry Dashboard", "Observability Engine")
    };

    public List<DockItem> DockItems { get; set; } = new()
    {
        new("CLI Terminal", "⚡", "/enterprise"),
        new("HSM Security", "🔒", "/enterprise"),
        new("Telemetry", "📊", "/enterprise"),
        new("Theme Studio", "🎨", "/enterprise"),
        new("Configuration", "⚙️", "/enterprise")
    };

    public List<StepperStep> StepperSteps { get; set; } = new()
    {
        new("step-1", "Personal Identity", "Biometric verification", "1"),
        new("step-2", "Department Assignment", "Organizational unit", "2"),
        new("step-3", "Security Clearance", "Audit review & sign-off", "3")
    };

    public List<TimelineItem> AuditEvents { get; set; } = new()
    {
        new("1", "TLS 1.3 Handshake Established", "Zero-Trust session authenticated via OAuth2 Bearer token.", DateTimeOffset.UtcNow.AddMinutes(-15), TimelineStatus.Completed, "Gateway-Proxy-01", "🔒"),
        new("2", "Biometric Facial Recognition", "Face geometry match 99.4% confidence score.", DateTimeOffset.UtcNow.AddMinutes(-10), TimelineStatus.Completed, "Camera-Engine", "📸"),
        new("3", "Department Role Allocation", "Security clearance escalated to Level 4 Tier.", DateTimeOffset.UtcNow.AddMinutes(-5), TimelineStatus.InProgress, "Auth-Worker-03", "⚡"),
        new("4", "Cryptographic Sign-Off", "Awaiting HSM hardware certificate validation.", DateTimeOffset.UtcNow, TimelineStatus.Warning, "HSM-Cluster", "⏳")
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

    public List<MenuItem> HeaderMenuItems { get; set; } = new()
    {
        new("Overview", "home", false, false, "#overview"),
        new("Form Controls", "fileText", false, false, "#sec-inputs-otp"),
        new("Data & Tables", "database", false, false, "#sec-datagrid"),
        new("Navigation", "compass", false, false, "#sec-menus-nav"),
        new("Overlays", "layers", false, false, "#sec-overlays-popovers"),
        new("Media", "image", false, false, "#sec-carousel-dropzone")
    };

    public List<SidebarItem> ComponentSidebarItems { get; set; } = new()
    {
        new("Dynamic Forms", "fileSpreadsheet", "#sec-dynamic-form", true, null, "Reflect"),
        new("Splitter Panels", "columns3", "#sec-splitter"),
        new("Advanced Selects", "listFilter", "#sec-advanced-selects"),
        new("PickList & Transfer", "arrowLeftRight", "#sec-transfer-lists"),
        new("Hierarchy & Terminal", "terminal", "#sec-hierarchy-terminal"),
        new("Galleria & Dock", "layoutGrid", "#sec-galleria-dock"),
        new("Form Inputs & OTP", "shieldAlert", "#sec-inputs-otp"),
        new("Enhanced Inputs & Masks", "edit3", "#sec-enhanced-inputs"),
        new("Panels, Tabs & Accordion", "folderTree", "#sec-panels-tabs"),
        new("Security DataGrid", "table2", "#sec-datagrid"),
        new("DataView & Paginator", "grid", "#sec-dataview-paginator"),
        new("Carousel & Dropzone", "galleryThumbnails", "#sec-carousel-dropzone"),
        new("TreeSelect & Meters", "gauge", "#sec-treeselect-meters"),
        new("Progress & Skeleton", "loader2", "#sec-progress-skeleton"),
        new("Overlays, Popovers & Dialogs", "messageSquare", "#sec-overlays-popovers"),
        new("Navigation, Menus & Dock", "menu", "#sec-menus-nav")
    };

    public void OnGet()
    {
    }
}
