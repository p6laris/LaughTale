using LaughTale.Core.Extensions;
using LaughTale.Markdown.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages, LaughTale Islands engine and Markdown Content Collections
builder.Services.AddRazorPages();
builder.Services.AddIslands();
builder.Services.AddLaughTaleMarkdown();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();

app.Run();
