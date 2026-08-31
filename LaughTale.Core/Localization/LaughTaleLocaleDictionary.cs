using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LaughTale.Core.Localization;

/// <summary>
/// Comprehensive client/server localization dictionary conforming to LaughTale and Aura specifications.
/// Serialized directly to client islands and queried on the server for default component labels.
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

    [JsonPropertyName("custom")]
    public Dictionary<string, string> Custom { get; set; } = new(StringComparer.OrdinalIgnoreCase);

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

            return normalizedKey.ToLowerInvariant() switch
            {
                "today" => Today,
                "clear" => Clear,
                "emptyfiltermessage" => EmptyFilterMessage,
                "searchmessage" => SearchMessage,
                "selectionmessage" => SelectionMessage,
                "emptyselectionmessage" => EmptySelectionMessage,
                "emptysearchmessage" => EmptySearchMessage,
                "emptymessage" => EmptyMessage,
                "choose" => Choose,
                "upload" => Upload,
                "cancel" => Cancel,
                "completed" => Completed,
                "pending" => Pending,
                "weak" => Weak,
                "medium" => Medium,
                "strong" => Strong,
                "passwordprompt" => PasswordPrompt,
                "startswith" => StartsWith,
                "contains" => Contains,
                "notcontains" => NotContains,
                "endswith" => EndsWith,
                "equals" => EqualsValue,
                "notequals" => NotEquals,
                "nofilter" => NoFilter,
                "lt" => Lt,
                "lte" => Lte,
                "gt" => Gt,
                "gte" => Gte,
                "dateis" => DateIs,
                "dateisnot" => DateIsNot,
                "datebefore" => DateBefore,
                "dateafter" => DateAfter,
                "apply" => Apply,
                "matchall" => MatchAll,
                "matchany" => MatchAny,
                "addrule" => AddRule,
                "removerule" => RemoveRule,
                "accept" => Accept,
                "reject" => Reject,
                "close" => Close,
                "save" => Save,
                "rowsperpage" => RowsPerPage,
                "page" => Page,
                "prevpage" => PrevPage,
                "nextpage" => NextPage,
                "firstpage" => FirstPage,
                "lastpage" => LastPage,
                "showingrecordstemplate" => ShowingRecordsTemplate,
                "moveup" => MoveUp,
                "movetop" => MoveTop,
                "movedown" => MoveDown,
                "movebottom" => MoveBottom,
                "movetotarget" => MoveToTarget,
                "movealltotarget" => MoveAllToTarget,
                "movetosource" => MoveToSource,
                "movealltosource" => MoveAllToSource,
                "available" => Available,
                "selected" => Selected,
                _ => normalizedKey
            };
        }
        set
        {
            Custom[key] = value;
        }
    }
}
