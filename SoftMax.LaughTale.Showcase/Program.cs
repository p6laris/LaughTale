using SoftMax.LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages and Islands framework
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

app.MapRazorPages();

app.Run();
