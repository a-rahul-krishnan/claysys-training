Console.WriteLine("LINQ Queries:");

List<Product> products = new()
{
    new Product("laptop", "Electronics", 60000),
    new Product("mouse", "Electronics", 800),
    new Product("keyboard", "Electronics", 1500),
    new Product("shirt", "Clothing", 1200),
    new Product("jeans", "Clothing", 2000),
    new Product("milk", "Grocery", 50)
};


Console.Write("Enter category to filter (Electronics / Clothing / Grocery): ");
string category = Console.ReadLine();


var filteredProducts = from p in products
                       where p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)
                       select p;

if (filteredProducts.Any())
{
    double avgPrice = filteredProducts.Average(p => p.Price);

    Console.WriteLine($"\nProducts in '{category}' category:");
    foreach (var p in filteredProducts)
        Console.WriteLine($"- {p.Name} : Rs.{p.Price}");

    Console.WriteLine($"\nAverage Price: Rs.{avgPrice:F2}");
}
else
{
    Console.WriteLine("No products found in that category.");
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
