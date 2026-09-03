# Migration Guide: Deny-by-Default Authorization (Spec 041 / LT-2204)

Starting in LaughTale v4 (LT-2204 / Spec 041), LaughTale enforces **deny-by-default authorization** for all islands and server-side data queries.

---

## 1. The Symptom: 403 Forbidden or Blank Islands

If you upgrade an existing LaughTale application without declaring island authorization or field policies, you may observe:
- Island refresh endpoints returning `HTTP 403 Forbidden` with an empty response body.
- TagHelpers suppressing output during SSR / initial page render (rendering nothing instead of the island markup).
- Server-side data queries refusing filters, sorting, or searches because no field allowlist was declared.
- Compilation errors on calls to `query.ToIslandDataResult(...)` or `MapIslandData(...)` due to missing `IslandFieldPolicy`.

This is **intentional by design** (FR-001, FR-006). Undeclared islands are no longer accessible to anonymous or untrusted callers by default.

---

## 2. Declaring Island Authorization (The 4 Options)

To grant access to an island, declare its authorization intent using any of the following 4 options (evaluated in order):

### Option 1: Explicit TagHelper Property
Set the `Policy` property directly on the TagHelper instance:
```html
<island name="admin-dashboard" policy="AdminOnly" />
```

### Option 2: Component Props Attribute
Decorate your props or component type with `[IslandAuthorize]` or `[IslandAllowAnonymous]`:
```csharp
// Require an ASP.NET Core authorization policy
[Island("admin-dashboard")]
[IslandAuthorize("AdminOnly")]
public record AdminDashboardProps(string Section);

// Or explicitly declare the island public to anonymous users
[Island("public-counter")]
[IslandAllowAnonymous]
public record PublicCounterProps(int InitialCount);
```
> **Note**: An island cannot have both `[IslandAuthorize]` and `[IslandAllowAnonymous]`. Setting both throws an `InvalidOperationException` at resolution time.

### Option 3: Local or Global Options
Declare policies or anonymous access in your DI setup:
```csharp
builder.Services.AddLaughTale(options =>
{
    // Declare explicit policies
    options.Refresh.RequirePolicy("admin-panel", "AdminOnly");

    // Or explicitly declare islands public
    options.Refresh.AllowAnonymous("public-counter");
    options.Refresh.AllowAnonymous("product-catalog");
});
```
Or at the endpoint mapping site:
```csharp
app.MapLaughTaleIslandRefresh("/_laughtale/island/{name}", options =>
{
    options.AllowAnonymous("public-counter");
});
```

### Option 4: Fluent Registry Registration
Use `IIslandAuthorizationRegistry` programmatically:
```csharp
var registry = app.Services.GetRequiredService<IIslandAuthorizationRegistry>();
registry.Register("admin-panel", "AdminOnly");
registry.RegisterPublic("public-counter");
```

---

## 3. Field Allowlist Inversion & Choosing `IslandFieldPolicy`

### The Breaking Change
The optional `IReadOnlySet<string>? allowedFields = null` parameter on LINQ query extensions has been removed. `IslandFieldPolicy` is now **mandatory**:
```csharp
// ✗ BEFORE (v3) - omitting allowedFields allowed all fields (fail-open)
var result = query.ToIslandDataResult(request);

// ✓ AFTER (v4) - must pass an explicit IslandFieldPolicy
var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Id", "Name", "CreatedAt"));
```

### Choosing Between `For` and `AllMappedProperties`

- **`IslandFieldPolicy.For("FieldA", "FieldB", ...)` (Recommended)**:
  Exposes ONLY the enumerated model properties to client filtering, sorting, and global search. Any requested fields not in the set are safely skipped and recorded in `result.RefusedFields`.
- **`IslandFieldPolicy.None` (or `IslandFieldPolicy.For()` with an empty list)**:
  Refuses all client-driven filtering and sorting (useful for fixed, server-controlled views).
- **`IslandFieldPolicy.AllMappedProperties` (Explicit Opt-In)**:
  Permits client filtering/sorting on all public readable properties of the model, reproducing pre-v4 behavior.
  > **Security Warning**: Use `AllMappedProperties` ONLY on internal DTOs where every readable property is safe for public sorting and filtering. Never use it on EF Core entities containing internal metadata or sensitive fields.

### Anti-Oracle Guarantees
If a client supplies a field name that is either not in the allowlist OR does not exist on the underlying model, LaughTale routes both into the same flat `result.RefusedFields` list without reason codes, preventing attackers from probing your schema.

---

## 4. Emergency Compatibility Switch: `AllowUndeclaredIslands`

For large existing applications where declaring all islands upfront is temporarily impractical, LaughTale provides an emergency migration switch:

```csharp
builder.Services.AddLaughTale(options =>
{
    // EMERGENCY ONLY: Allows undeclared islands to render and refresh
    options.Refresh.AllowUndeclaredIslands = true;
});
```

### Deprecation Horizon
- Setting `AllowUndeclaredIslands = true` logs a warning upon the first request for each undeclared island (deduplicated so it will not flood logs).
- **Deprecation Horizon**: This switch is provided solely to facilitate phased migration and will be deprecated and removed in a future major version of LaughTale. All production islands should be migrated to explicit declarations.
