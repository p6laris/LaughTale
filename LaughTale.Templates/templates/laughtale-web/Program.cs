using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages and LaughTale Island Architecture
builder.Services.AddRazorPages();
builder.Services.AddIslands();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapLaughTaleIslandRefresh();

app.Run();
