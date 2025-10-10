using System;
using System.IO;

Console.WriteLine("=== Interface & Dependency Injection Demo ===\n");

Service consoleService = new Service(new ConsoleLogger());
consoleService.Run();

Service fileService = new Service(new FileLogger());
fileService.Run();

Console.WriteLine("\nLogs written to console and file.");

// ILogger interface
public interface ILogger
{
    void LogInfo(string message);
    void LogWarning(string message);
    void LogError(string message);
}

// Logs to console
public class ConsoleLogger : ILogger
{
    public void LogInfo(string message) => Console.WriteLine("INFO: " + message);
    public void LogWarning(string message) => Console.WriteLine("WARNING: " + message);
    public void LogError(string message) => Console.WriteLine("ERROR: " + message);
}

// Logs to file
public class FileLogger : ILogger
{
    private readonly string _filePath = "log.txt";

    public void LogInfo(string message) => WriteLog("INFO", message);
    public void LogWarning(string message) => WriteLog("WARNING", message);
    public void LogError(string message) => WriteLog("ERROR", message);

    private void WriteLog(string level, string message)
    {
        string logEntry = $"{DateTime.Now} [{level}] {message}";
        File.AppendAllText(_filePath, logEntry + Environment.NewLine);
    }
}

// Service using ILogger
public class Service
{
    private readonly ILogger _logger;

    public Service(ILogger logger)
    {
        _logger = logger;
    }

    public void Run()
    {
        _logger.LogInfo("Service started.");
        _logger.LogWarning("This is a warning.");
        _logger.LogError("An error occurred.");
    }
}
