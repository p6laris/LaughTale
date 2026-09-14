using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LaughTale.Components.Localization;

/// <summary>
/// Comprehensive, typed client/server localization dictionary conforming to LaughTale and Aura
/// specifications. This is a Components-level authoring/reading convenience only — the generic
/// runtime mechanism lives in LaughTale.Core.Localization.ILaughTaleLocalizer, which knows nothing
/// about this concrete shape. Use <see cref="ToDictionary"/> to flatten an instance down to the
/// plain key/value map Core's registration surface expects.
/// </summary>
public sealed class LaughTaleLocaleDictionary
{
    [JsonPropertyName("locale")]
    public string Locale { get; set; } = "en";

    [JsonPropertyName("dir")]
    public string Dir { get; set; } = "ltr";

    [JsonPropertyName("firstDayOfWeek")]
    public int FirstDayOfWeek { get; set; } = 0;

    [JsonPropertyName("dayNames")]
    public string[] DayNames { get; set; } = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    [JsonPropertyName("dayNamesShort")]
    public string[] DayNamesShort { get; set; } = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];

    [JsonPropertyName("dayNamesMin")]
    public string[] DayNamesMin { get; set; } = [
        "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"
    ];

    [JsonPropertyName("monthNames")]
    public string[] MonthNames { get; set; } = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    [JsonPropertyName("monthNamesShort")]
    public string[] MonthNamesShort { get; set; } = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    [JsonPropertyName("today")]
    public string Today { get; set; } = "Today";

    [JsonPropertyName("clear")]
    public string Clear { get; set; } = "Clear";

    [JsonPropertyName("dateFormat")]
    public string DateFormat { get; set; } = "mm/dd/yy";

    [JsonPropertyName("weekHeader")]
    public string WeekHeader { get; set; } = "Wk";

    [JsonPropertyName("weak")]
    public string Weak { get; set; } = "Weak";

    [JsonPropertyName("medium")]
    public string Medium { get; set; } = "Medium";

    [JsonPropertyName("strong")]
    public string Strong { get; set; } = "Strong";

    [JsonPropertyName("passwordPrompt")]
    public string PasswordPrompt { get; set; } = "Enter a password";

    [JsonPropertyName("emptyFilterMessage")]
    public string EmptyFilterMessage { get; set; } = "No results found";

    [JsonPropertyName("searchMessage")]
    public string SearchMessage { get; set; } = "{0} results are available";

    [JsonPropertyName("selectionMessage")]
    public string SelectionMessage { get; set; } = "{0} items selected";

    [JsonPropertyName("emptySelectionMessage")]
    public string EmptySelectionMessage { get; set; } = "No selected item";

    [JsonPropertyName("emptySearchMessage")]
    public string EmptySearchMessage { get; set; } = "No results found";

    [JsonPropertyName("emptyMessage")]
    public string EmptyMessage { get; set; } = "No available options";

    [JsonPropertyName("choose")]
    public string Choose { get; set; } = "Choose";

    [JsonPropertyName("upload")]
    public string Upload { get; set; } = "Upload";

    [JsonPropertyName("cancel")]
    public string Cancel { get; set; } = "Cancel";

    [JsonPropertyName("completed")]
    public string Completed { get; set; } = "Completed";

    [JsonPropertyName("pending")]
    public string Pending { get; set; } = "Pending";

    [JsonPropertyName("fileSizeTypes")]
    public string[] FileSizeTypes { get; set; } = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    // Filter Constraints
    [JsonPropertyName("startsWith")]
    public string StartsWith { get; set; } = "Starts with";

    [JsonPropertyName("contains")]
    public string Contains { get; set; } = "Contains";

    [JsonPropertyName("notContains")]
    public string NotContains { get; set; } = "Not contains";

    [JsonPropertyName("endsWith")]
    public string EndsWith { get; set; } = "Ends with";

    [JsonPropertyName("equals")]
    public string EqualsValue { get; set; } = "Equals";

    [JsonPropertyName("notEquals")]
    public string NotEquals { get; set; } = "Not equals";

    [JsonPropertyName("noFilter")]
    public string NoFilter { get; set; } = "No Filter";

    [JsonPropertyName("lt")]
    public string Lt { get; set; } = "Less than";

    [JsonPropertyName("lte")]
    public string Lte { get; set; } = "Less than or equal to";

    [JsonPropertyName("gt")]
    public string Gt { get; set; } = "Greater than";

    [JsonPropertyName("gte")]
    public string Gte { get; set; } = "Greater than or equal to";

    [JsonPropertyName("dateIs")]
    public string DateIs { get; set; } = "Date is";

    [JsonPropertyName("dateIsNot")]
    public string DateIsNot { get; set; } = "Date is not";

    [JsonPropertyName("dateBefore")]
    public string DateBefore { get; set; } = "Date is before";

    [JsonPropertyName("dateAfter")]
    public string DateAfter { get; set; } = "Date is after";

    [JsonPropertyName("apply")]
    public string Apply { get; set; } = "Apply";

    [JsonPropertyName("matchAll")]
    public string MatchAll { get; set; } = "Match All";

    [JsonPropertyName("matchAny")]
    public string MatchAny { get; set; } = "Match Any";

    [JsonPropertyName("addRule")]
    public string AddRule { get; set; } = "Add Rule";

    [JsonPropertyName("removeRule")]
    public string RemoveRule { get; set; } = "Remove Rule";

    [JsonPropertyName("accept")]
    public string Accept { get; set; } = "Yes";

    [JsonPropertyName("reject")]
    public string Reject { get; set; } = "No";

    [JsonPropertyName("close")]
    public string Close { get; set; } = "Close";

    [JsonPropertyName("save")]
    public string Save { get; set; } = "Save";

    [JsonPropertyName("rowsPerPage")]
    public string RowsPerPage { get; set; } = "Rows per page";

    [JsonPropertyName("page")]
    public string Page { get; set; } = "Page {0}";

    [JsonPropertyName("prevPage")]
    public string PrevPage { get; set; } = "Previous Page";

    [JsonPropertyName("nextPage")]
    public string NextPage { get; set; } = "Next Page";

    [JsonPropertyName("firstPage")]
    public string FirstPage { get; set; } = "First Page";

    [JsonPropertyName("lastPage")]
    public string LastPage { get; set; } = "Last Page";

    [JsonPropertyName("showingRecordsTemplate")]
    public string ShowingRecordsTemplate { get; set; } = "Showing {0} to {1} of {2} entries";

    [JsonPropertyName("moveUp")]
    public string MoveUp { get; set; } = "Move Up";

    [JsonPropertyName("moveTop")]
    public string MoveTop { get; set; } = "Move Top";

    [JsonPropertyName("moveDown")]
    public string MoveDown { get; set; } = "Move Down";

    [JsonPropertyName("moveBottom")]
    public string MoveBottom { get; set; } = "Move Bottom";

    [JsonPropertyName("moveToTarget")]
    public string MoveToTarget { get; set; } = "Move to Target";

    [JsonPropertyName("moveAllToTarget")]
    public string MoveAllToTarget { get; set; } = "Move All to Target";

    [JsonPropertyName("moveToSource")]
    public string MoveToSource { get; set; } = "Move to Source";

    [JsonPropertyName("moveAllToSource")]
    public string MoveAllToSource { get; set; } = "Move All to Source";

    [JsonPropertyName("available")]
    public string Available { get; set; } = "Available";

    [JsonPropertyName("selected")]
    public string Selected { get; set; } = "Selected";

    // The following keys were added to route previously-hardcoded English UI-copy defaults on
    // component props records (LaughTale.Components/Models/ComponentModels.cs and
    // LaughTale.Components/Forms/DynamicFormSchema.cs) through the localizer. Concepts already
    // covered above (choose/upload/cancel/accept/reject/available/selected/selectionMessage/
    // emptyMessage/passwordPrompt/weak/medium/strong) are reused directly instead of duplicated.
    [JsonPropertyName("selectPlaceholder")]
    public string SelectPlaceholder { get; set; } = "Select an option";

    [JsonPropertyName("searchPlaceholder")]
    public string SearchPlaceholder { get; set; } = "Search...";

    [JsonPropertyName("selectCategoryPlaceholder")]
    public string SelectCategoryPlaceholder { get; set; } = "Select a category";

    [JsonPropertyName("addTagPlaceholder")]
    public string AddTagPlaceholder { get; set; } = "Add a tag...";

    [JsonPropertyName("filterItemsPlaceholder")]
    public string FilterItemsPlaceholder { get; set; } = "Filter items...";

    [JsonPropertyName("selectItemsPlaceholder")]
    public string SelectItemsPlaceholder { get; set; } = "Select items";

    [JsonPropertyName("selectItemPlaceholder")]
    public string SelectItemPlaceholder { get; set; } = "Select Item";

    [JsonPropertyName("filterPlaceholder")]
    public string FilterPlaceholder { get; set; } = "Filter...";

    [JsonPropertyName("filterTreeNodesPlaceholder")]
    public string FilterTreeNodesPlaceholder { get; set; } = "Filter tree nodes...";

    [JsonPropertyName("dropzoneMessage")]
    public string DropzoneMessage { get; set; } = "Drag & Drop files here or browse";

    [JsonPropertyName("inplaceEditPlaceholder")]
    public string InplaceEditPlaceholder { get; set; } = "Click to edit...";

    [JsonPropertyName("commandPlaceholder")]
    public string CommandPlaceholder { get; set; } = "Type a command or search...";

    [JsonPropertyName("submitLabel")]
    public string SubmitLabel { get; set; } = "Submit";

    [JsonPropertyName("custom")]
    public Dictionary<string, string> Custom { get; set; } = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// The canonical (lowercase key -> getter) map backing both the dynamic indexer and
    /// <see cref="ToDictionary"/>, so the two can never drift out of sync with each other.
    /// </summary>
    private static readonly IReadOnlyDictionary<string, Func<LaughTaleLocaleDictionary, string>> KeyedAccessors =
        new Dictionary<string, Func<LaughTaleLocaleDictionary, string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["today"] = d => d.Today,
            ["clear"] = d => d.Clear,
            ["emptyfiltermessage"] = d => d.EmptyFilterMessage,
            ["searchmessage"] = d => d.SearchMessage,
            ["selectionmessage"] = d => d.SelectionMessage,
            ["emptyselectionmessage"] = d => d.EmptySelectionMessage,
            ["emptysearchmessage"] = d => d.EmptySearchMessage,
            ["emptymessage"] = d => d.EmptyMessage,
            ["choose"] = d => d.Choose,
            ["upload"] = d => d.Upload,
            ["cancel"] = d => d.Cancel,
            ["completed"] = d => d.Completed,
            ["pending"] = d => d.Pending,
            ["weak"] = d => d.Weak,
            ["medium"] = d => d.Medium,
            ["strong"] = d => d.Strong,
            ["passwordprompt"] = d => d.PasswordPrompt,
            ["startswith"] = d => d.StartsWith,
            ["contains"] = d => d.Contains,
            ["notcontains"] = d => d.NotContains,
            ["endswith"] = d => d.EndsWith,
            ["equals"] = d => d.EqualsValue,
            ["notequals"] = d => d.NotEquals,
            ["nofilter"] = d => d.NoFilter,
            ["lt"] = d => d.Lt,
            ["lte"] = d => d.Lte,
            ["gt"] = d => d.Gt,
            ["gte"] = d => d.Gte,
            ["dateis"] = d => d.DateIs,
            ["dateisnot"] = d => d.DateIsNot,
            ["datebefore"] = d => d.DateBefore,
            ["dateafter"] = d => d.DateAfter,
            ["apply"] = d => d.Apply,
            ["matchall"] = d => d.MatchAll,
            ["matchany"] = d => d.MatchAny,
            ["addrule"] = d => d.AddRule,
            ["removerule"] = d => d.RemoveRule,
            ["accept"] = d => d.Accept,
            ["reject"] = d => d.Reject,
            ["close"] = d => d.Close,
            ["save"] = d => d.Save,
            ["rowsperpage"] = d => d.RowsPerPage,
            ["page"] = d => d.Page,
            ["prevpage"] = d => d.PrevPage,
            ["nextpage"] = d => d.NextPage,
            ["firstpage"] = d => d.FirstPage,
            ["lastpage"] = d => d.LastPage,
            ["showingrecordstemplate"] = d => d.ShowingRecordsTemplate,
            ["moveup"] = d => d.MoveUp,
            ["movetop"] = d => d.MoveTop,
            ["movedown"] = d => d.MoveDown,
            ["movebottom"] = d => d.MoveBottom,
            ["movetotarget"] = d => d.MoveToTarget,
            ["movealltotarget"] = d => d.MoveAllToTarget,
            ["movetosource"] = d => d.MoveToSource,
            ["movealltosource"] = d => d.MoveAllToSource,
            ["available"] = d => d.Available,
            ["selected"] = d => d.Selected,
            ["selectplaceholder"] = d => d.SelectPlaceholder,
            ["searchplaceholder"] = d => d.SearchPlaceholder,
            ["selectcategoryplaceholder"] = d => d.SelectCategoryPlaceholder,
            ["addtagplaceholder"] = d => d.AddTagPlaceholder,
            ["filteritemsplaceholder"] = d => d.FilterItemsPlaceholder,
            ["selectitemsplaceholder"] = d => d.SelectItemsPlaceholder,
            ["selectitemplaceholder"] = d => d.SelectItemPlaceholder,
            ["filterplaceholder"] = d => d.FilterPlaceholder,
            ["filtertreenodesplaceholder"] = d => d.FilterTreeNodesPlaceholder,
            ["dropzonemessage"] = d => d.DropzoneMessage,
            ["inplaceeditplaceholder"] = d => d.InplaceEditPlaceholder,
            ["commandplaceholder"] = d => d.CommandPlaceholder,
            ["submitlabel"] = d => d.SubmitLabel,
            // Not part of the switch's typed-property set, but included so ToDictionary() also
            // seeds the "dir" key that ILaughTaleLocalizer.IsRightToLeft looks up generically.
            ["dir"] = d => d.Dir,
            ["locale"] = d => d.Locale,
        };

    /// <summary>
    /// Indexer to lookup or set strings dynamically by key name.
    /// </summary>
    public string this[string key]
    {
        get
        {
            if (string.IsNullOrWhiteSpace(key)) return string.Empty;

            var normalizedKey = key.Trim();
            if (Custom.TryGetValue(normalizedKey, out var customVal))
                return customVal;

            return KeyedAccessors.TryGetValue(normalizedKey, out var accessor)
                ? accessor(this)
                : normalizedKey;
        }
        set
        {
            Custom[key] = value;
        }
    }

    /// <summary>
    /// Flattens this typed locale pack down to a plain key/value map suitable for feeding into
    /// LaughTale.Core.Localization.ILaughTaleLocalizer's generic registration surface
    /// (LaughTaleLocalizationOptions.AddLocale / AddBuiltInLocale). Derived from the same key
    /// list the dynamic indexer uses, so the two can never fall out of sync.
    /// </summary>
    public IDictionary<string, string> ToDictionary()
    {
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (key, accessor) in KeyedAccessors)
        {
            result[key] = accessor(this);
        }
        foreach (var kv in Custom)
        {
            result[kv.Key] = kv.Value;
        }
        return result;
    }
}
