using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LaughTaleBenchmarkApp.Pages;

public class WeatherModel : PageModel
{
    public record WeatherForecast(DateOnly Date, int TemperatureC, string Summary)
    {
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    }

    public WeatherForecast[] Forecasts { get; private set; } = [];

    public void OnGet()
    {
        var startDate = DateOnly.FromDateTime(DateTime.Now);
        var summaries = new[] { "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching" };
        Forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast(
            startDate.AddDays(index),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        )).ToArray();
    }
}
