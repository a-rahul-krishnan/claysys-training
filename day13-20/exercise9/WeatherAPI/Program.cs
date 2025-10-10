using Newtonsoft.Json.Linq;

Console.WriteLine("=== Weather Forecast App (Async / Await Demo) ===\n");

Console.Write("Enter city names separated by commas (e.g., Chennai, Delhi, Mumbai): ");
string input = Console.ReadLine() ?? "";
string[] cities = input.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

if (cities.Length == 0)
{
    Console.WriteLine("No cities entered. Exiting...");
    return;
}

try
{
    // Fetch all weather data concurrently and store results
    var weatherTasks = new List<Task<string>>();
    foreach (var city in cities)
    {
        weatherTasks.Add(GetWeatherReportAsync(city));
    }

    string[] reports = await Task.WhenAll(weatherTasks);

    // Print results neatly after all tasks complete
    Console.WriteLine("\n=== Weather Reports ===");
    foreach (var report in reports)
    {
        Console.WriteLine(report);
        Console.WriteLine(new string('-', 40));
    }
}
catch (Exception ex)
{
    Console.WriteLine($"\nAn error occurred: {ex.Message}");
}

Console.WriteLine("Weather fetch completed. Press any key to exit.");
Console.ReadKey();


// === ASYNCHRONOUS METHOD ===
async Task<string> GetWeatherReportAsync(string city)
{
    try
    {
        string apiKey = "e02bec7854f244c3b4795332230407"; // your API key
        string url = $"https://api.weatherapi.com/v1/current.json?key={apiKey}&q={city}";

        using HttpClient client = new();
        string response = await client.GetStringAsync(url);

        // Parse JSON
        var json = JObject.Parse(response);
        string name = json["location"]?["name"]?.ToString() ?? "Unknown";
        string country = json["location"]?["country"]?.ToString() ?? "Unknown";
        string condition = json["current"]?["condition"]?["text"]?.ToString() ?? "N/A";
        double tempC = json["current"]?["temp_c"]?.ToObject<double>() ?? 0;
        double windKph = json["current"]?["wind_kph"]?.ToObject<double>() ?? 0;

        // Return formatted string (instead of printing immediately)
        return
            $"City: {name}, {country}\n" +
            $"Temperature: {tempC} °C\n" +
            $"Condition: {condition}\n" +
            $"Wind Speed: {windKph} kph";
    }
    catch (HttpRequestException)
    {
        return $"Error: Network issue while fetching weather for '{city}'.";
    }
    catch (Exception ex)
    {
        return $"Error fetching weather for '{city}': {ex.Message}";
    }
}
