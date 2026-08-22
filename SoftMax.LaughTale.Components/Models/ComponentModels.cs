namespace SoftMax.LaughTale.Components.Models;

public record StepperStep(
    string Id,
    string Title,
    string? Description = null,
    string? Icon = null
);

public record TimelineItem(
    string Id,
    string Title,
    string Description,
    string Timestamp,
    string Status = "completed",
    string? Actor = null,
    string? Icon = null
);

public record DataGridCol(
    string Field,
    string Header,
    bool Sortable = true
);

public record TreeNode(
    string Id,
    string Name,
    string? Code = null,
    List<TreeNode>? Children = null
);
