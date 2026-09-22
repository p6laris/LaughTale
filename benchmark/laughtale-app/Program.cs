using LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddLaughTale(opt =>
{
    opt.Refresh.AllowUndeclaredIslands = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

// ROADMAP.v5.md Part J benchmark: MapStaticAssets() (this template's default) only serves files it
// fingerprinted via its own build manifest - it 404s on the JS chunk files esbuild's code-splitting
// generates and main.js's own dynamic import() calls reference by their literal, non-fingerprinted
// filename. UseStaticFiles() serves any file under wwwroot by its real path, matching how
// LaughTale.Showcase's own (working) Program.cs already does this.
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
