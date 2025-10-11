Console.WriteLine("Events Example:");
Clock clock = new Clock();
Display display = new Display(clock);
clock.Start();
Console.WriteLine("Clock started. Press any key to stop after a few seconds...");
Console.ReadKey();
clock.Stop();

public class Clock
{
    public event EventHandler? OnTick;
    private readonly System.Timers.Timer timer;

    public Clock()
    {
        timer = new System.Timers.Timer(1000); 
        timer.Elapsed += (s, e) => OnTick?.Invoke(this, EventArgs.Empty);
    }

    public void Start() => timer.Start();
    public void Stop() => timer.Stop();
}

public class Display
{
    public Display(Clock clock)
    {
        clock.OnTick += DisplayTime;
    }

    private void DisplayTime(object? sender, EventArgs e)
    {
        Console.WriteLine($"Current Time: {DateTime.Now:T}");
    }
}