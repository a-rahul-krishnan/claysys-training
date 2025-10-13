using System;
using System.Reflection;


Console.WriteLine("Object Serialization: ");

var person = new Person { Name = "Alice", Age = 30 };
var product = new Product { ProductName = "Laptop", Price = 60000 };

PrintProperties(person);
Console.WriteLine();
PrintProperties(product);

void PrintProperties(object obj)
{
    Type type = obj.GetType();
    Console.WriteLine($"Properties of {type.Name}:");
    foreach (var prop in type.GetProperties())
    {
        var value = prop.GetValue(obj);
        Console.WriteLine($"{prop.Name} = {value}");
    }
}

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

public class Product
{
    public string ProductName { get; set; }
    public double Price { get; set; }
}

