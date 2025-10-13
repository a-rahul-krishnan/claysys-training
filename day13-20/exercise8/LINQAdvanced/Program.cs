Console.WriteLine("Advanced LINQ Operations:");


List<Product> products = new()
{
    new Product("Laptop", "Electronics", 60000),
    new Product("Mouse", "Electronics", 800),
    new Product("Keyboard", "Electronics", 1500),
    new Product("Shirt", "Clothing", 1200),
    new Product("Jeans", "Clothing", 2000),
    new Product("Milk", "Grocery", 50),
    new Product("Rice", "Grocery", 80),
    new Product("Bread", "Grocery", 40)
};

// Group by category and count
var groupByCategory = from p in products
                      group p by p.Category into g
                      orderby g.Count() descending
                      select new { Category = g.Key, Count = g.Count() };

// Display result
Console.WriteLine("\nProduct count by category (descending):");
foreach (var group in groupByCategory)
{
    Console.WriteLine($"{group.Category}: {group.Count} products");
}

// Product class
class Product
{
    public string Name { get; set; }
    public string Category { get; set; }
    public double Price { get; set; }

    public Product(string name, string category, double price)
    {
        Name = name;
        Category = category;
        Price = price;
    }
}
