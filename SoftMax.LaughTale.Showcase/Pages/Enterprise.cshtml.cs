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
        new("Kurdistan Region", "kurdistan", "shield", null, false, new()
        {
            new("Erbil HQ", "erbil", "server", null, false, new()
            {
                new("Datacenter Alpha", "ebl-dc-1", "hardDrive"),
                new("Datacenter Beta", "ebl-dc-2", "hardDrive")
            }),
            new("Sulaymaniyah Branch", "sul", "server", null, false, new()
            {
                new("Primary Node", "sul-dc-1", "hardDrive")
            })
        }),
        new("Global Regions", "international", "globe", null, false, new()
        {
            new("Europe West (Frankfurt)", "eu-west", "server", null, false, new()
            {
                new("Edge Point 1", "fra-01", "cpu"),
                new("Edge Point 2", "fra-02", "cpu")
            })
        })
    };

    public List<CascadeSelectNode> CascadeCountries { get; set; } = new()
    {
        new("Australia", "AU", "globe", null, false, new()
        {
            new("New South Wales", "NSW", "mapPin", null, false, new()
            {
                new("Sydney", "A-SY", "mapPin"),
                new("Newcastle", "A-NE", "mapPin"),
                new("Wollongong", "A-WO", "mapPin")
            }),
            new("Queensland", "QLD", "mapPin", null, false, new()
            {
                new("Brisbane", "A-BR", "mapPin"),
                new("Townsville", "A-TO", "mapPin")
            })
        }),
        new("Canada", "CA", "globe", null, false, new()
        {
            new("Quebec", "QC", "mapPin", null, false, new()
            {
                new("Montreal", "C-MO", "mapPin"),
                new("Quebec City", "C-QU", "mapPin")
            }),
            new("Ontario", "ON", "mapPin", null, false, new()
            {
                new("Ottawa", "C-OT", "mapPin"),
                new("Toronto", "C-TO", "mapPin")
            })
        }),
        new("United States", "US", "globe", null, false, new()
        {
            new("California", "CA_US", "mapPin", null, false, new()
            {
                new("Los Angeles", "US-LA", "mapPin"),
                new("San Diego", "US-SD", "mapPin"),
                new("San Francisco", "US-SF", "mapPin")
            }),
            new("Florida", "FL_US", "mapPin", null, false, new()
            {
                new("Jacksonville", "US-JA", "mapPin"),
                new("Miami", "US-MI", "mapPin"),
                new("Tampa", "US-TA", "mapPin"),
                new("Orlando", "US-OR", "mapPin")
            }),
            new("Texas", "TX_US", "mapPin", null, false, new()
            {
                new("Austin", "US-AU", "mapPin"),
                new("Dallas", "US-DA", "mapPin"),
                new("Houston", "US-HO", "mapPin")
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

    public List<ListboxOptionItem> ListboxCities { get; set; } = new()
    {
        new("New York", "NY", Code: "NY"),
        new("Rome", "RM", Code: "RM"),
        new("London", "LDN", Code: "LDN"),
        new("Istanbul", "IST", Code: "IST"),
        new("Paris", "PRS", Code: "PRS")
    };

    public List<ListboxOptionItem> ListboxAirports { get; set; } = new()
    {
        new("John F. Kennedy", "JFK", Code: "JFK", Flag: "🇺🇸"),
        new("Heathrow", "LHR", Code: "LHR", Flag: "🇬🇧"),
        new("Charles de Gaulle", "CDG", Code: "CDG", Flag: "🇫🇷"),
        new("Frankfurt", "FRA", Code: "FRA", Flag: "🇩🇪"),
        new("Schiphol", "AMS", Code: "AMS", Flag: "🇳🇱"),
        new("Istanbul", "IST", Code: "IST", Flag: "🇹🇷"),
        new("Dubai", "DXB", Code: "DXB", Flag: "🇦🇪"),
        new("Changi", "SIN", Code: "SIN", Flag: "🇸🇬"),
        new("Haneda", "HND", Code: "HND", Flag: "🇯🇵")
    };

    public List<ListboxOptionItem> ListboxCountries { get; set; } = new()
    {
        new("Australia", "AU", Code: "AU", Flag: "🇦🇺"),
        new("Brazil", "BR", Code: "BR", Flag: "🇧🇷"),
        new("China", "CN", Code: "CN", Flag: "🇨🇳"),
        new("Egypt", "EG", Code: "EG", Flag: "🇪🇬"),
        new("France", "FR", Code: "FR", Flag: "🇫🇷"),
        new("Germany", "DE", Code: "DE", Flag: "🇩🇪"),
        new("India", "IN", Code: "IN", Flag: "🇮🇳"),
        new("Japan", "JP", Code: "JP", Flag: "🇯🇵"),
        new("Spain", "ES", Code: "ES", Flag: "🇪🇸"),
        new("United States", "US", Code: "US", Flag: "🇺🇸")
    };

    public List<ListboxOptionItem> ListboxGroupedCities { get; set; } = new()
    {
        new("Germany", "de", Flag: "🇩🇪", Items: new()
        {
            new("Berlin", "Berlin"),
            new("Frankfurt", "Frankfurt"),
            new("Hamburg", "Hamburg"),
            new("Munich", "Munich")
        }),
        new("USA", "us", Flag: "🇺🇸", Items: new()
        {
            new("Chicago", "Chicago"),
            new("Los Angeles", "Los Angeles"),
            new("New York", "New York"),
            new("San Francisco", "San Francisco")
        }),
        new("Japan", "jp", Flag: "🇯🇵", Items: new()
        {
            new("Kyoto", "Kyoto"),
            new("Osaka", "Osaka"),
            new("Tokyo", "Tokyo"),
            new("Yokohama", "Yokohama")
        })
    };

    public List<ListboxOptionItem> ListboxDisabledCities { get; set; } = new()
    {
        new("New York", "NY"),
        new("Rome", "RM"),
        new("London", "LDN", Disabled: true),
        new("Istanbul", "IST"),
        new("Paris", "PRS", Disabled: true)
    };

    public List<RadioButtonOption> DeploymentRegions { get; set; } = new()
    {
        new("US East — Virginia", "us-east", Flag: "🇺🇸", Description: "Low latency, auto-scaling enabled."),
        new("EU West — Frankfurt", "eu-west", Flag: "🇩🇪", Description: "CI/CD pipeline, daily backups."),
        new("EU East — Poland", "eu-east", Flag: "🇵🇱", Description: "GDPR compliant, secure.")
    };

    public List<RadioButtonOption> PricingPlans { get; set; } = new()
    {
        new("Starter", "starter", Price: "$0/month", Description: "For solo developers exploring the platform."),
        new("Pro", "pro", Badge: "Popular", Price: "$29/month", Description: "For growing teams shipping in production."),
        new("Enterprise", "enterprise", Price: "Custom", Description: "For large organizations with custom needs.")
    };

    public List<string> CategoryOptions { get; set; } = new()
    {
        "Accounting", "Marketing", "Production", "Research"
    };

    public List<string> PizzaIngredients { get; set; } = new()
    {
        "Cheese", "Mushroom", "Pepper", "Onion"
    };

    public List<RadioButtonOption> FruitOptions { get; set; } = new()
    {
        new("Strawberry", "strawberry", Flag: "🍓"),
        new("Banana", "banana", Flag: "🍌"),
        new("Watermelon", "watermelon", Flag: "🍉")
    };

    public List<ListboxOptionItem> SelectLanguages { get; set; } = new()
    {
        new("English", "en", Flag: "🇺🇸"),
        new("Deutsch", "de", Flag: "🇩🇪"),
        new("Español", "es", Flag: "🇪🇸"),
        new("Français", "fr", Flag: "🇫🇷"),
        new("Italiano", "it", Flag: "🇮🇹"),
        new("Português", "pt", Flag: "🇵🇹"),
        new("Polski", "pl", Flag: "🇵🇱"),
        new("Türkçe", "tr", Flag: "🇹🇷"),
        new("日本語", "ja", Flag: "🇯🇵"),
        new("中文", "zh", Flag: "🇨🇳")
    };

    public List<string> SelectToppings { get; set; } = new()
    {
        "Pepperoni", "Mushrooms", "Onions", "Black Olives", "Green Peppers", "Mozzarella", "Basil", "Tomatoes"
    };

    public List<ListboxOptionItem> SelectThemes { get; set; } = new()
    {
        new("Light", "light", Icon: "☀️", Description: "Clean and bright interface"),
        new("Dark", "dark", Icon: "🌙", Description: "Easy on the eyes"),
        new("System", "system", Icon: "💻", Description: "Match your device settings"),
        new("High Contrast", "high-contrast", Icon: "◐", Description: "Maximum readability")
    };

    public List<ListboxOptionItem> SelectTeamMembers { get; set; } = new()
    {
        new("Sarah Chen", "sc", Description: "Engineering Lead", Badge: "SC", StatusClass: "bg-amber-400"),
        new("Alex Rivera", "ar", Description: "Senior Developer", Badge: "AR", StatusClass: "bg-green-400"),
        new("Jordan Kim", "jk", Description: "UX Designer", Badge: "JK", StatusClass: "bg-amber-400"),
        new("Taylor Morgan", "tm", Description: "Product Manager", Badge: "TM", StatusClass: "bg-zinc-400"),
        new("Morgan Lee", "ml", Description: "DevOps Engineer", Badge: "ML", StatusClass: "bg-green-400"),
        new("Casey Jones", "cj", Description: "QA Engineer", Badge: "CJ", StatusClass: "bg-red-400")
    };

    public List<ListboxOptionItem> SelectCategories { get; set; } = new()
    {
        new("Electronics", "electronics", Badge: "1247"),
        new("Clothing", "clothing", Badge: "856"),
        new("Garden", "home", Badge: "634"),
        new("Sports", "sports", Badge: "421"),
        new("Books", "books", Badge: "2103"),
        new("Toys", "toys", Badge: "312")
    };

    public List<ListboxOptionItem> SelectJobGroups { get; set; } = new()
    {
        new("Engineering", "eng", Items: new()
        {
            new("Frontend Developer", "frontend"),
            new("Backend Developer", "backend"),
            new("Full Stack Developer", "fullstack"),
            new("DevOps Engineer", "devops"),
            new("QA Engineer", "qa")
        }),
        new("Design", "design", Items: new()
        {
            new("UI Designer", "ui"),
            new("UX Designer", "ux"),
            new("Product Designer", "product-design"),
            new("Brand Designer", "brand")
        }),
        new("Product", "product", Items: new()
        {
            new("Product Manager", "pm"),
            new("Product Owner", "po"),
            new("Business Analyst", "ba")
        })
    };

    public List<ListboxOptionItem> SelectButtonStateOptions { get; set; } = new()
    {
        new("One-Way", "one-way"),
        new("Return", "return")
    };

    public List<ListboxOptionItem> SelectButtonPaymentOptions { get; set; } = new()
    {
        new("Option 1", "1"),
        new("Option 2", "2"),
        new("Option 3", "3")
    };

    public List<ListboxOptionItem> SelectButtonJustifyOptions { get; set; } = new()
    {
        new("Left", "left", Icon: "align-left"),
        new("Center", "center", Icon: "align-center"),
        new("Right", "right", Icon: "align-right"),
        new("Justify", "justify", Icon: "align-justify")
    };

    public List<string> SelectButtonSkillLevels { get; set; } = new()
    {
        "Beginner", "Expert"
    };

    public List<ListboxOptionItem> SelectButtonDisabledOptions { get; set; } = new()
    {
        new("Option 1", "1"),
        new("Option 2 (Disabled)", "2", Disabled: true),
        new("Option 3", "3")
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

    public List<CarouselItem> CarouselSlides { get; set; } = new()
    {
        new("1", "Cluster Alpha Overview", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60", "Active datacenter deployment"),
        new("2", "Security Mesh Matrix", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60", "Cryptographic key distribution"),
        new("3", "Telemetry Metrics", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60", "Observability pipeline stream")
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

    public List<TreeNode> DocumentsTree { get; set; } = new()
    {
        new("0", "Documents", "docs", new()
        {
            new("0-0", "Work", "work", new()
            {
                new("0-0-0", "Expenses.doc", "exp"),
                new("0-0-1", "Resume.doc", "res")
            }),
            new("0-1", "Home", "home", new()
            {
                new("0-1-0", "Invoices.txt", "inv")
            })
        }),
        new("1", "Events", "events", new()
        {
            new("1-0", "Meeting", "meet"),
            new("1-1", "Product Launch", "launch"),
            new("1-2", "Report Review", "review")
        }),
        new("2", "Movies", "movies", new()
        {
            new("2-0", "Al Pacino", "pacino", new()
            {
                new("2-0-0", "Scarface", "scar"),
                new("2-0-1", "Serpico", "serp")
            }),
            new("2-1", "Robert De Niro", "deniro", new()
            {
                new("2-1-0", "Goodfellas", "good"),
                new("2-1-1", "Taxi Driver", "taxi")
            })
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

    public List<AutoCompleteItem> CommandsList { get; set; } = new()
    {
        new("New File", "new_file", "File", "filePlus", "⌘N"),
        new("Open File", "open_file", "File", "folderOpen", "⌘O"),
        new("Save", "save", "File", "save", "⌘S"),
        new("Save As", "save_as", "File", "save", "⇧⌘S"),
        new("Find in Files", "find", "Edit", "search", "⌘F"),
        new("Replace", "replace", "Edit", "refreshCw", "⌘H"),
        new("Go to Line", "goto", "Navigate", "hash", "⌘G"),
        new("Toggle Sidebar", "toggle_sb", "View", "layout", "⌘B"),
        new("Split Editor", "split", "View", "columns", "⌘\\"),
        new("Close Tab", "close_tab", "Window", "x", "⌘W")
    };

    public List<AutoCompleteItem> TeamMembers { get; set; } = new()
    {
        new("Sarah Chen", "sc", null, null, null, "SC", "online", "Engineering Lead"),
        new("Alex Rivera", "ar", null, null, null, "AR", "online", "Senior Developer"),
        new("Jordan Kim", "jk", null, null, null, "JK", "away", "UX Designer"),
        new("Taylor Morgan", "tm", null, null, null, "TM", "offline", "Product Manager"),
        new("Morgan Lee", "ml", null, null, null, "ML", "online", "DevOps Engineer"),
        new("Casey Jones", "cj", null, null, null, "CJ", "away", "QA Engineer")
    };

    public List<AutoCompleteItem> GroupedTechnologies { get; set; } = new()
    {
        new("React", "react", "Frontend", null, null, null, null, "Component Framework", "Frontend"),
        new("Vue.js", "vue", "Frontend", null, null, null, null, "Progressive Framework", "Frontend"),
        new("Angular", "angular", "Frontend", null, null, null, null, "Enterprise Framework", "Frontend"),
        new("Svelte", "svelte", "Frontend", null, null, null, null, "Compiler Framework", "Frontend"),
        new("ASP.NET Core", "dotnet", "Backend", null, null, null, null, "High-Perf Runtime", "Backend"),
        new("Node.js", "nodejs", "Backend", null, null, null, null, "V8 JavaScript Engine", "Backend"),
        new("Go (Golang)", "golang", "Backend", null, null, null, null, "Cloud Microservices", "Backend"),
        new("Rust", "rust", "Backend", null, null, null, null, "Memory-Safe Systems", "Backend"),
        new("PostgreSQL", "postgres", "Database", null, null, null, null, "Relational Engine", "Database"),
        new("Redis", "redis", "Database", null, null, null, null, "In-Memory Cache", "Database"),
        new("ClickHouse", "clickhouse", "Database", null, null, null, null, "OLAP Analytics", "Database")
    };

    public List<AutoCompleteItem> ProductCategories { get; set; } = new()
    {
        new("Electronics", "electronics", null, null, null, null, null, null, null, 1247),
        new("Clothing & Apparel", "clothing", null, null, null, null, null, null, null, 856),
        new("Home & Garden", "home", null, null, null, null, null, null, null, 634),
        new("Sports & Outdoors", "sports", null, null, null, null, null, null, null, 421),
        new("Books & Media", "books", null, null, null, null, null, null, null, 2103),
        new("Toys & Games", "toys", null, null, null, null, null, null, null, 312)
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
