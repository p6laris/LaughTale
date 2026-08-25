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

    public List<ListboxOptionItem> VerticalEqualizerSliders { get; set; } = new()
    {
        new("Bass", 40),
        new("Mid", 70),
        new("Treble", 55)
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

    public List<PickListItem> PickListMembersSource { get; set; } = new()
    {
        new("1", "Amy Elsner", Role: "Product Manager", Avatar: "AE"),
        new("2", "Asiya Javayant", Role: "DevOps Engineer", Avatar: "AJ"),
        new("3", "Onyama Limba", Role: "Lead Architect", Avatar: "OL"),
        new("4", "Anna Fali", Role: "Frontend Developer", Avatar: "AF"),
        new("5", "Bernardo Dominic", Role: "Backend Developer", Avatar: "BD"),
        new("6", "Elwin Sharvill", Role: "QA Engineer", Avatar: "ES"),
        new("7", "Ioni Bowcher", Role: "Security Specialist", Avatar: "IB"),
        new("8", "Stephen Shaw", Role: "UI/UX Designer", Avatar: "SS"),
        new("9", "Ivan Magalhaes", Role: "Cloud Architect", Avatar: "IM"),
        new("10", "Xuxue Feng", Role: "Database Administrator", Avatar: "XF")
    };

    public List<PickListItem> PickListMembersTarget { get; set; } = new();

    public List<PickListItem> PickListProductsSource { get; set; } = new()
    {
        new("1000", "Bamboo Watch", Category: "Accessories", Price: 65, Image: "bamboo-watch.jpg"),
        new("1001", "Black Watch", Category: "Accessories", Price: 72, Image: "black-watch.jpg"),
        new("1002", "Blue Band", Category: "Fitness", Price: 79, Image: "blue-band.jpg"),
        new("1003", "Blue T-Shirt", Category: "Clothing", Price: 29, Image: "blue-t-shirt.jpg"),
        new("1004", "Bracelet", Category: "Accessories", Price: 15, Image: "bracelet.jpg"),
        new("1005", "Brown Purse", Category: "Accessories", Price: 120, Image: "brown-purse.jpg"),
        new("1006", "Chakra Bracelet", Category: "Accessories", Price: 32, Image: "chakra-bracelet.jpg"),
        new("1007", "Galaxy Earrings", Category: "Accessories", Price: 34, Image: "galaxy-earrings.jpg"),
        new("1008", "Game Controller", Category: "Electronics", Price: 99, Image: "game-controller.jpg"),
        new("1009", "Gaming Set", Category: "Electronics", Price: 299, Image: "gaming-set.jpg")
    };

    public List<PickListItem> PickListProductsTarget { get; set; } = new();

    public List<OrderListItem> OrderListMovies { get; set; } = new()
    {
        new("1", Title: "The Shawshank Redemption", Order: 1),
        new("2", Title: "Inception", Order: 2),
        new("3", Title: "Interstellar", Order: 3),
        new("4", Title: "The Dark Knight", Order: 4),
        new("5", Title: "Pulp Fiction", Order: 5),
        new("6", Title: "Baby Driver", Order: 6),
        new("7", Title: "Whiplash", Order: 7),
        new("8", Title: "Eternal Sunshine of the Spotless Mind", Order: 8),
        new("9", Title: "La La Land", Order: 9),
        new("10", Title: "Parasite", Order: 10)
    };

    public List<OrderListItem> OrderListProducts { get; set; } = new()
    {
        new("1000", Name: "Bamboo Watch", Category: "Accessories", Price: 65, Image: "bamboo-watch.jpg", Order: 1),
        new("1001", Name: "Black Watch", Category: "Accessories", Price: 72, Image: "black-watch.jpg", Order: 2),
        new("1002", Name: "Blue Band", Category: "Fitness", Price: 79, Image: "blue-band.jpg", Order: 3),
        new("1003", Name: "Blue T-Shirt", Category: "Clothing", Price: 29, Image: "blue-t-shirt.jpg", Order: 4),
        new("1004", Name: "Bracelet", Category: "Accessories", Price: 15, Image: "bracelet.jpg", Order: 5),
        new("1005", Name: "Brown Purse", Category: "Accessories", Price: 120, Image: "brown-purse.jpg", Order: 6),
        new("1006", Name: "Chakra Bracelet", Category: "Accessories", Price: 32, Image: "chakra-bracelet.jpg", Order: 7),
        new("1007", Name: "Galaxy Earrings", Category: "Accessories", Price: 34, Image: "galaxy-earrings.jpg", Order: 8),
        new("1008", Name: "Game Controller", Category: "Electronics", Price: 99, Image: "game-controller.jpg", Order: 9),
        new("1009", Name: "Gaming Set", Category: "Electronics", Price: 299, Image: "gaming-set.jpg", Order: 10)
    };

    public List<OrderListItem> OrderListTasks { get; set; } = new()
    {
        new("t-1", "Step 1: TLS 1.3 Handshake", "Security", 1),
        new("t-2", "Step 2: OAuth 2.1 Grant", "Auth", 2),
        new("t-3", "Step 3: RBAC Evaluation", "Policy", 3),
        new("t-4", "Step 4: Audit Log Append", "Ledger", 4)
    };

        public List<string> PaginatorImages { get; set; } = new()
    {
        "https://primefaces.org/cdn/primevue/images/nature/nature1.jpg",
        "https://primefaces.org/cdn/primevue/images/nature/nature2.jpg",
        "https://primefaces.org/cdn/primevue/images/nature/nature3.jpg",
        "https://primefaces.org/cdn/primevue/images/nature/nature4.jpg",
        "https://primefaces.org/cdn/primevue/images/nature/nature5.jpg",
        "https://primefaces.org/cdn/primevue/images/nature/nature6.jpg"
    };

    public OrgChartNode OrgChartBasic { get; set; } = new("0", "Founder", Children: new()
    {
        new("0-0", "Product Lead", Children: new()
        {
            new("0-0-0", "UX/UI Designer"),
            new("0-0-1", "Product Manager")
        }),
        new("0-1", "Engineering Lead", Children: new()
        {
            new("0-1-0", "Frontend Developer"),
            new("0-1-1", "Backend Developer")
        })
    });

    public OrgChartNode OrgChartCloud { get; set; } = new("0", "AWS Cloud", Description: "us-east-1", Icon: "cloud", Accent: "bg-orange-500/10 text-orange-500", Children: new()
    {
        new("0_0", "Compute", Description: "Workloads & runtime", Icon: "server", Accent: "bg-sky-500/10 text-sky-500", Children: new()
        {
            new("0_0_0", "EC2", Description: "Virtual servers", Icon: "server", Accent: "bg-sky-500/10 text-sky-500"),
            new("0_0_1", "Lambda", Description: "Serverless functions", Icon: "bolt", Accent: "bg-sky-500/10 text-sky-500")
        }),
        new("0_1", "Storage", Description: "Data persistence", Icon: "database", Accent: "bg-emerald-500/10 text-emerald-500", Children: new()
        {
            new("0_1_0", "S3", Description: "Object storage", Icon: "box", Accent: "bg-emerald-500/10 text-emerald-500"),
            new("0_1_1", "RDS", Description: "Managed databases", Icon: "database", Accent: "bg-emerald-500/10 text-emerald-500")
        }),
        new("0_2", "Networking", Description: "Edge & access", Icon: "globe", Accent: "bg-violet-500/10 text-violet-500", Children: new()
        {
            new("0_2_0", "CloudFront", Description: "Global CDN", Icon: "globe", Accent: "bg-violet-500/10 text-violet-500"),
            new("0_2_1", "IAM", Description: "Access policies", Icon: "shield", Accent: "bg-violet-500/10 text-violet-500")
        })
    });

    public OrgChartNode OrgChartAvatar { get; set; } = new("0", "Amy Elsner", Title: "Chief Executive Officer", Avatar: "AE", Children: new()
    {
        new("0-0", "Anna Fali", Title: "Chief Operating Officer", Avatar: "AF", Children: new()
        {
            new("0-0-0", "Stephen Shaw", Title: "Head of Marketing", Avatar: "SS"),
            new("0-0-1", "Ioni Bowcher", Title: "Customer Relations", Avatar: "IB")
        }),
        new("0-1", "Asiya Javayant", Title: "Chief Technology Officer", Avatar: "AJ", Children: new()
        {
            new("0-1-0", "Bernardo Dominic", Title: "VP of Engineering", Avatar: "BD"),
            new("0-1-1", "Elwin Sharvill", Title: "Principal Architect", Avatar: "ES")
        })
    });

    public OrgChartNode OrgChartRoot { get; set; } = new("root", "CEO Office", Title: "Elena Rostova (Command Lead)", Children: new()
    {
        new("eng", "Core Infrastructure", Title: "David Vance (VP)", Children: new()
        {
            new("kernel", "Kernel & Islands", Title: "Alice Montgomery (Lead)"),
            new("secops", "Zero-Trust & HSM", Title: "Thomas Wright (Lead)")
        }),
        new("ops", "SecOps Operations", Title: "Marcus Thorne (VP)", Children: new()
        {
            new("cloud", "Cluster Reliability", Title: "Sarah Jenkins (Lead)")
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

    public List<TimelineItem> TimelineBasicEvents { get; set; } = new()
    {
        new(Status: "Ordered"),
        new(Status: "Processing"),
        new(Status: "Shipped"),
        new(Status: "Delivered")
    };

    public List<TimelineItem> TimelineOppositeEvents { get; set; } = new()
    {
        new(Status: "Ordered", Date: "15/10/2026 10:30"),
        new(Status: "Processing", Date: "15/10/2026 14:00"),
        new(Status: "Shipped", Date: "15/10/2026 16:15"),
        new(Status: "Delivered", Date: "16/10/2026 10:00")
    };

    public List<string> TimelineHorizontalYears { get; set; } = new() { "2026", "2027", "2028", "2029" };

    public List<TimelineItem> TimelineCustomEvents { get; set; } = new()
    {
        new(Status: "Order Placed", Date: "Oct 15, 2026", Time: "10:30 AM", Icon: "shoppingCart", Color: "bg-blue-500", User: "JD", Description: "Your order #12345 has been confirmed and is being prepared for processing.", Details: new() { "2x Wireless Headphones", "1x Phone Case", "1x USB-C Cable" }),
        new(Status: "Payment Confirmed", Date: "Oct 15, 2026", Time: "10:32 AM", Icon: "creditCard", Color: "bg-green-500", User: "SY", Description: "Payment of $149.99 was successfully processed via Credit Card ending in 4242."),
        new(Status: "Shipped", Date: "Oct 16, 2026", Time: "02:15 PM", Icon: "truck", Color: "bg-orange-500", User: "MK", Description: "Package has been handed to the carrier and is on its way.", Tracking: "TRK-892374651"),
        new(Status: "Delivered", Date: "Oct 18, 2026", Time: "11:20 AM", Icon: "checkCircle", Color: "bg-lime-500", User: "JD", Description: "Package was delivered and signed for at the front door.")
    };

    public List<TimelineItem> TimelineInteractiveSteps { get; set; } = new()
    {
        new(Id: "1", Label: "Account Created", Icon: "userPlus"),
        new(Id: "2", Label: "Email Verified", Icon: "envelope"),
        new(Id: "3", Label: "Profile Completed", Icon: "idCard"),
        new(Id: "4", Label: "First Purchase", Icon: "shoppingBag"),
        new(Id: "5", Label: "Review Posted", Icon: "star")
    };

    public List<TimelineItem> TimelineActivities { get; set; } = new()
    {
        new(Id: "1", User: "Sarah Chen", Action: "pushed", Target: "3 commits", Repo: "main", Time: "2 minutes ago", Details: new() { "fix: resolve memory leak in useEffect", "feat: add dark mode toggle", "chore: update dependencies" }),
        new(Id: "2", User: "Alex Kumar", Action: "opened", Target: "pull request #142", Repo: "feature/auth", Time: "15 minutes ago", Description: "Implement OAuth2 authentication flow"),
        new(Id: "3", User: "Maya Johnson", Action: "commented on", Target: "issue #89", Time: "1 hour ago", Description: "I've investigated this bug and found the root cause. Working on a fix now."),
        new(Id: "4", User: "David Park", Action: "merged", Target: "pull request #138", Repo: "main", Time: "3 hours ago"),
        new(Id: "5", User: "Emma Wilson", Action: "created", Target: "release v2.4.0", Time: "5 hours ago", Description: "Performance improvements and bug fixes")
    };

    public List<TimelineItem> AuditEvents { get; set; } = new()
    {
        new("1", Title: "TLS 1.3 Handshake Established", Description: "Zero-Trust session authenticated via OAuth2 Bearer token.", Timestamp: DateTimeOffset.UtcNow.AddMinutes(-15), Status: "completed", Actor: "Gateway-Proxy-01", Icon: "🔒"),
        new("2", Title: "Biometric Facial Recognition", Description: "Face geometry match 99.4% confidence score.", Timestamp: DateTimeOffset.UtcNow.AddMinutes(-10), Status: "completed", Actor: "Camera-Engine", Icon: "📸"),
        new("3", Title: "Department Role Allocation", Description: "Security clearance escalated to Level 4 Tier.", Timestamp: DateTimeOffset.UtcNow.AddMinutes(-5), Status: "in_progress", Actor: "Auth-Worker-03", Icon: "⚡"),
        new("4", Title: "Cryptographic Sign-Off", Description: "Awaiting HSM hardware certificate validation.", Timestamp: DateTimeOffset.UtcNow, Status: "warning", Actor: "HSM-Cluster", Icon: "⏳")
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

    public List<TreeNode> FilesystemTree { get; set; } = new()
    {
        new("0", ".github", "github folder", "folder", Children: new()
        {
            new("0-0", "workflows", "workflows folder", "folder", Children: new()
            {
                new("0-0-0", "node.js.yml", "node.js.yml file", "file")
            })
        }),
        new("1", ".vscode", "vscode folder", "folder", Children: new()
        {
            new("1-0", "extensions.json", "extensions.json file", "file")
        }),
        new("2", "public", "public folder", "folder", Children: new()
        {
            new("2-0", "vite.svg", "vite.svg file", "file")
        }),
        new("3", "src", "src folder", "folder", Children: new()
        {
            new("3-0", "assets", "assets folder", "folder", Children: new()
            {
                new("3-0-0", "vue.svg", "vue.svg file", "file")
            }),
            new("3-1", "components", "components folder", "folder", Children: new()
            {
                new("3-1-0", "HelloWorld.vue", "HelloWorld.vue file", "file")
            }),
            new("3-2", "App.vue", "App.vue file", "file"),
            new("3-3", "main.js", "main.js file", "file"),
            new("3-4", "style.css", "style.css file", "file")
        }),
        new("4", "index.html", "index.html file", "file"),
        new("5", "package.json", "package.json file", "file"),
        new("6", "vite.config.js", "vite.config.js file", "file")
    };

    public List<TreeNode> LazyTreeNodes { get; set; } = new()
    {
        new("0", "Node 0", Leaf: false),
        new("1", "Node 1", Leaf: false),
        new("2", "Node 2", Leaf: false)
    };

    public List<TreeNode> EmptyTreeNodes { get; set; } = new();

    public List<TreeNode> TransferTree1 { get; set; } = new()
    {
        new("0-0", ".github", "github folder", "folder", Children: new()
        {
            new("0-0-0", "workflows", "workflows folder", "folder", Children: new()
            {
                new("0-0-0-0", "node.js.yml", "node.js.yml file", "file")
            })
        }),
        new("0-1", ".vscode", "vscode folder", "folder", Children: new()
        {
            new("0-1-0", "extensions.json", "extensions.json file", "file")
        }),
        new("0-2", "public", "public folder", "folder", Children: new()
        {
            new("0-2-0", "vite.svg", "vite.svg file", "file")
        }),
        new("0-3", "src", "src folder", "folder", Children: new()
        {
            new("0-3-0", "assets", "assets folder", "folder", Children: new()
            {
                new("0-3-0-0", "vue.svg", "vue.svg file", "file")
            }),
            new("0-3-1", "components", "components folder", "folder", Children: new()
            {
                new("0-3-1-0", "HelloWorld.vue", "HelloWorld.vue file", "file")
            }),
            new("0-3-2", "App.vue", "App.vue file", "file"),
            new("0-3-3", "main.js", "main.js file", "file"),
            new("0-3-4", "style.css", "style.css file", "file")
        }),
        new("0-4", "index.html", "index.html file", "file"),
        new("0-5", "package.json", "package.json file", "file"),
        new("0-6", "vite.config.js", "vite.config.js file", "file")
    };

    public List<TreeNode> TransferTree2 { get; set; } = new()
    {
        new("1-0", "/etc", Icon: "folder")
    };

    public List<TreeNode> TransferTree3 { get; set; } = new();

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
        new("Sync Cluster", "refresh", "sync"),
        new("Export Audit Logs", "upload", "export"),
        new("Trigger Backup", "save", "backup")
    };

    public List<SpeedDialAction> SpeedDialBasicItems { get; set; } = new()
    {
        new("Add", "pencil", "add"),
        new("Update", "refresh", "update"),
        new("Delete", "trash", "delete"),
        new("Upload", "upload", "upload"),
        new("VueJS", "externallink", "external", Url: "https://vuejs.org", Target: "_blank")
    };

    public List<SpeedDialAction> SpeedDialCircleItems { get; set; } = new()
    {
        new("Add", "pencil", "add"),
        new("Update", "refresh", "update"),
        new("Delete", "trash", "delete"),
        new("Upload", "upload", "upload"),
        new("VueJS", "externallink", "external", Url: "https://vuejs.org", Target: "_blank"),
        new("Settings", "cog", "settings"),
        new("Profile", "user", "profile"),
        new("Favorite", "heart", "favorite")
    };

    public List<SpeedDialAction> SpeedDialTemplateItems { get; set; } = new()
    {
        new("Like", "heart", "like"),
        new("Share", "sharealt", "share"),
        new("Print", "print", "print"),
        new("Save", "save", "save"),
        new("Copy", "copy", "copy")
    };

    public List<SpeedDialAction> SpeedDialTooltipItems { get; set; } = new()
    {
        new("Add", "pencil", "add", Tooltip: "Add"),
        new("Update", "refresh", "update", Tooltip: "Update"),
        new("Delete", "trash", "delete", Tooltip: "Delete"),
        new("Upload", "upload", "upload", Tooltip: "Upload"),
        new("External", "externallink", "external", Tooltip: "External", Url: "https://vuejs.org", Target: "_blank")
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

    // DataTable Showcase Datasets
    public List<DataTableColumn> DataTableProductColumns { get; set; } = new()
    {
        new("code", "Code", Sortable: true),
        new("name", "Name", Sortable: true),
        new("category", "Category", Sortable: true),
        new("price", "Price", Sortable: true),
        new("quantity", "Quantity", Sortable: true),
        new("inventoryStatus", "Status", Sortable: true)
    };

    public List<DataTableColumn> DataTableCustomerColumns { get; set; } = new()
    {
        new("name", "Name", Sortable: true),
        new("country", "Country", Sortable: true),
        new("company", "Company", Sortable: true),
        new("status", "Status", Sortable: true),
        new("balance", "Balance", Sortable: true)
    };

    public List<DataTableColumn> DataTableCheckboxColumns { get; set; } = new()
    {
        new("", "", SelectionMode: "multiple"),
        new("name", "Product", Sortable: true),
        new("category", "Category", Sortable: true),
        new("price", "Price", Sortable: true),
        new("inventoryStatus", "Status", Sortable: true)
    };

    public List<DataTableColumn> DataTableRadioColumns { get; set; } = new()
    {
        new("", "", SelectionMode: "single"),
        new("name", "Customer", Sortable: true),
        new("country", "Country", Sortable: true),
        new("company", "Company", Sortable: true),
        new("balance", "Balance", Sortable: true)
    };

    public List<DataTableColumn> DataTableExpanderColumns { get; set; } = new()
    {
        new("", "", Expander: true),
        new("name", "Product", Sortable: true),
        new("category", "Category", Sortable: true),
        new("price", "Price", Sortable: true),
        new("inventoryStatus", "Status", Sortable: true)
    };

    public List<DataTableColumn> DataTableFrozenColumns { get; set; } = new()
    {
        new("name", "Product", Frozen: true, AlignFrozen: "left", Width: "220px", Sortable: true),
        new("code", "Code", Width: "150px"),
        new("category", "Category", Width: "180px"),
        new("quantity", "Quantity", Width: "120px"),
        new("inventoryStatus", "Status", Width: "150px"),
        new("price", "Price", Frozen: true, AlignFrozen: "right", Width: "140px", Sortable: true)
    };

    public List<DataTableColumn> DataTableFilterColumns { get; set; } = new()
    {
        new("name", "Name", Sortable: true, Filterable: true, FilterPlaceholder: "Search name..."),
        new("country", "Country", Sortable: true, Filterable: true, FilterPlaceholder: "Search country..."),
        new("company", "Company", Sortable: true, Filterable: true, FilterPlaceholder: "Search company..."),
        new("status", "Status", Sortable: true, Filterable: true, FilterPlaceholder: "Search status..."),
        new("balance", "Balance", Sortable: true)
    };

    public List<DataTableColumn> DataTableEditableColumns { get; set; } = new()
    {
        new("name", "Name", EditorType: "text"),
        new("category", "Category", EditorType: "text"),
        new("quantity", "Qty", EditorType: "number"),
        new("price", "Price", EditorType: "number"),
        new("inventoryStatus", "Status")
    };

    public List<object> DataViewProducts { get; set; } = new()
    {
        new { id = "1000", code = "f230fh0g3", name = "Bamboo Watch", category = "Accessories", price = 65, rating = 5, inventoryStatus = "INSTOCK", image = "bamboo-watch.jpg" },
        new { id = "1001", code = "nvklal433", name = "Black Watch", category = "Accessories", price = 72, rating = 4, inventoryStatus = "INSTOCK", image = "black-watch.jpg" },
        new { id = "1002", code = "zz21cz3c1", name = "Blue Band", category = "Fitness", price = 79, rating = 3, inventoryStatus = "LOWSTOCK", image = "blue-band.jpg" },
        new { id = "1003", code = "244wgerg2", name = "Blue T-Shirt", category = "Clothing", price = 29, rating = 5, inventoryStatus = "INSTOCK", image = "blue-t-shirt.jpg" },
        new { id = "1004", code = "h456wer53", name = "Bracelet", category = "Accessories", price = 15, rating = 4, inventoryStatus = "INSTOCK", image = "bracelet.jpg" },
        new { id = "1005", code = "av2231fwg", name = "Brown Purse", category = "Accessories", price = 120, rating = 4, inventoryStatus = "OUTOFSTOCK", image = "brown-purse.jpg" },
        new { id = "1006", code = "bib36pfvm", name = "Chakra Bracelet", category = "Accessories", price = 32, rating = 3, inventoryStatus = "LOWSTOCK", image = "chakra-bracelet.jpg" },
        new { id = "1007", code = "mb89353st", name = "Galaxy Earrings", category = "Accessories", price = 34, rating = 5, inventoryStatus = "INSTOCK", image = "galaxy-earrings.jpg" },
        new { id = "1008", code = "vbb124btr", name = "Game Controller", category = "Electronics", price = 99, rating = 4, inventoryStatus = "LOWSTOCK", image = "game-controller.jpg" },
        new { id = "1009", code = "cm230f032", name = "Gaming Set", category = "Electronics", price = 299, rating = 3, inventoryStatus = "INSTOCK", image = "gaming-set.jpg" },
        new { id = "1010", code = "pl1432f91", name = "Gold Phone Case", category = "Accessories", price = 24, rating = 4, inventoryStatus = "OUTOFSTOCK", image = "gold-phone-case.jpg" },
        new { id = "1011", code = "rt23019aa", name = "Green Earbuds", category = "Electronics", price = 89, rating = 4, inventoryStatus = "INSTOCK", image = "green-earbuds.jpg" }
    };

    public List<object> DataTableProducts { get; set; } = new()
    {
        new { id = 1000, code = "f230fh0g3", name = "Bamboo Watch", category = "Accessories", price = 65, quantity = 24, inventoryStatus = "INSTOCK", rating = 5 },
        new { id = 1001, code = "nvklal433", name = "Black Watch", category = "Accessories", price = 72, quantity = 61, inventoryStatus = "INSTOCK", rating = 4 },
        new { id = 1002, code = "zz21cz3c1", name = "Blue Band", category = "Fitness", price = 79, quantity = 2, inventoryStatus = "LOWSTOCK", rating = 3 },
        new { id = 1003, code = "244wgerg2", name = "Blue T-Shirt", category = "Clothing", price = 29, quantity = 25, inventoryStatus = "INSTOCK", rating = 5 },
        new { id = 1004, code = "h456wer53", name = "Bracelet", category = "Accessories", price = 15, quantity = 73, inventoryStatus = "INSTOCK", rating = 4 },
        new { id = 1005, code = "av2231fwg", name = "Brown Purse", category = "Accessories", price = 120, quantity = 0, inventoryStatus = "OUTOFSTOCK", rating = 4 },
        new { id = 1006, code = "bib36pfvm", name = "Chakra Bracelet", category = "Accessories", price = 32, quantity = 5, inventoryStatus = "LOWSTOCK", rating = 3 },
        new { id = 1007, code = "mb89353st", name = "Galaxy Earrings", category = "Accessories", price = 34, quantity = 23, inventoryStatus = "INSTOCK", rating = 5 },
        new { id = 1008, code = "vbb124btr", name = "Game Controller", category = "Electronics", price = 99, quantity = 2, inventoryStatus = "LOWSTOCK", rating = 4 },
        new { id = 1009, code = "cm230f032", name = "Gaming Set", category = "Electronics", price = 299, quantity = 63, inventoryStatus = "INSTOCK", rating = 5 }
    };

    public List<object> DataTableCustomers { get; set; } = new()
    {
        new { id = 1, name = "Amy Elsner", country = "Germany", company = "Benton, John B Jr", status = "qualified", balance = 9702, verified = true },
        new { id = 2, name = "Anna Fali", country = "France", company = "Chanay, Jeffrey A Esq", status = "qualified", balance = 12500, verified = true },
        new { id = 3, name = "Asiya Javayant", country = "India", company = "Chemel, James L Cpa", status = "new", balance = 8300, verified = false },
        new { id = 4, name = "Bernardo Dominic", country = "USA", company = "Feltz Printing Service", status = "negotiation", balance = 24100, verified = true },
        new { id = 5, name = "Elwin Sharvill", country = "United Kingdom", company = "Printing Dimensions", status = "qualified", balance = 16200, verified = true },
        new { id = 6, name = "Ioni Bowcher", country = "Brazil", company = "Chapman, Ross E Esq", status = "unqualified", balance = 4200, verified = false },
        new { id = 7, name = "Ivan Magalhaes", country = "Brazil", company = "Art Crafters", status = "new", balance = 18700, verified = true },
        new { id = 8, name = "Onyama Limba", country = "Nigeria", company = "Commercial Press", status = "qualified", balance = 29300, verified = false },
        new { id = 9, name = "Stephen Shaw", country = "United Kingdom", company = "In Communications", status = "negotiation", balance = 15800, verified = true },
        new { id = 10, name = "Xuxue Feng", country = "China", company = "Modern Graphic", status = "renewal", balance = 44500, verified = true }
    };

    public List<SplitButtonItem> SplitButtonBasicItems { get; set; } = new()
    {
        new("Update", "refresh-cw", "update", Command: "console.log('Updated');"),
        new("Delete", "trash-2", "delete", Command: "console.log('Deleted');"),
        new("Vue.js", "external-link", Url: "https://vuejs.org/"),
        new(Separator: true),
        new("Upload", "upload", Route: "/fileupload")
    };

    public List<SplitButtonItem> SplitButtonIconItems { get; set; } = new()
    {
        new("Update", "refresh-cw", "update"),
        new("Delete", "x", "delete"),
        new(Separator: true),
        new("Quit", "power", Url: "https://vuejs.org/")
    };

    public List<SplitButtonItem> SplitButtonNestedItems { get; set; } = new()
    {
        new("File", "folder", Items: new()
        {
            new("New", "plus", Items: new()
            {
                new("Bookmark", "bookmark"),
                new("Video", "video")
            }),
            new("Delete", "trash-2"),
            new(Separator: true),
            new("Export", "external-link")
        }),
        new("Edit", "pencil", Items: new()
        {
            new("Left", "align-left"),
            new("Right", "align-right"),
            new("Center", "align-center"),
            new("Justify", "align-justify")
        }),
        new("Users", "user", Items: new()
        {
            new("New", "user-plus"),
            new("Delete", "user-minus"),
            new("Search", "users", Items: new()
            {
                new("Filter", "filter", Items: new()
                {
                    new("Print", "print")
                }),
                new("List", "list")
            })
        }),
        new("Events", "calendar", Items: new()
        {
            new("Edit", "pencil", Items: new()
            {
                new("Save", "calendar-plus"),
                new("Delete", "calendar-minus")
            }),
            new("Archive", "archive", Items: new()
            {
                new("Remove", "calendar-minus")
            })
        }),
        new(Separator: true),
        new("Quit", "power")
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
