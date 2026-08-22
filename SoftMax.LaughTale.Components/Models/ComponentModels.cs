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

public record SelectButtonItem(
    string Label,
    string Value,
    string? Icon = null
);

public record MeterValue(
    string Label,
    double Value,
    string Color,
    string? Icon = null
);

public record AvatarItem(
    string? Label = null,
    string? Image = null,
    string? Name = null,
    string? Bg = null
);

public record SpeedDialAction(
    string Label,
    string? Icon = null,
    string? Action = null
);
