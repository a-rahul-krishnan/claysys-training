using System;
using System.Collections.Generic;

List<Product> products = new List<Product>()
{
    new Product { Id = 1, Name = "Laptop", Price = 55000, Stock = 5 },
    new Product { Id = 2, Name = "Phone", Price = 25000, Stock = 10 },
    new Product { Id = 3, Name = "Headphones", Price = 1500, Stock = 15 }
};

ShoppingCart cart = new ShoppingCart();

bool running = true;

while (running)
{
    Console.WriteLine("\nE-Commerce App :");
    Console.WriteLine("1. View Products");
    Console.WriteLine("2. Add to Cart");
    Console.WriteLine("3. View Cart");
    Console.WriteLine("4. Remove from Cart");
    Console.WriteLine("5. Checkout");
    Console.WriteLine("0. Exit");
    Console.Write("Choose an option: ");

    string? choice = Console.ReadLine();

    switch (choice)
    {
        case "1":
            Console.WriteLine("\nAvailable Products:");
            foreach (var p in products)
                p.Display();
            break;

        case "2":
            Console.Write("Enter Product ID to add: ");
            if (int.TryParse(Console.ReadLine(), out int addId))
            {
                var prod = products.Find(p => p.Id == addId);
                if (prod != null)
                {
                    Console.Write($"Enter quantity (Available: {prod.Stock}): ");
                    if (int.TryParse(Console.ReadLine(), out int qty))
                    {
                        cart.AddProduct(prod, qty);
                    }
                    else
                        Console.WriteLine("Invalid quantity.");
                }
                else
                    Console.WriteLine("Product not found.");
            }
            else
                Console.WriteLine("Invalid Product ID.");
            break;

        case "3":
            cart.DisplayCart();
            break;

        case "4":
            Console.Write("Enter Product ID to remove: ");
            if (int.TryParse(Console.ReadLine(), out int removeId))
                cart.RemoveProduct(removeId);
            else
                Console.WriteLine("Invalid input.");
            break;

        case "5":
            cart.Checkout();
            break;

        case "0":
            running = false; 
            break;

        default:
            Console.WriteLine("Invalid choice. Try again.");
            break;
    }
}

Console.WriteLine("\nProgram exited successfully!");


class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public double Price { get; set; }
    public int Stock { get; set; }

    public void Display()
    {
        Console.WriteLine($"{Id}. {Name} - Rs. {Price} (Stock: {Stock})");
    }
}

class ShoppingCart
{
    private List<(Product Product, int Quantity)> cart = new List<(Product, int)>();

    public void AddProduct(Product p, int qty)
    {
        if (qty <= 0)
        {
            Console.WriteLine("Quantity must be positive.");
            return;
        }

        if (p.Stock < qty)
        {
            Console.WriteLine($"Only {p.Stock} available in stock.");
            return;
        }

        // reduce stock
        p.Stock -= qty;

        // if product already in cart, increase qty
        var existing = cart.Find(item => item.Product.Id == p.Id);
        if (existing.Product != null)
        {
            cart.Remove(existing);
            cart.Add((p, existing.Quantity + qty));
        }
        else
        {
            cart.Add((p, qty));
        }

        Console.WriteLine($"{qty} x {p.Name} added to cart!");
    }

    public void RemoveProduct(int id)
    {
        var item = cart.Find(x => x.Product.Id == id);
        if (item.Product != null)
        {
            // restore stock
            item.Product.Stock += item.Quantity;
            cart.Remove(item);
            Console.WriteLine($"{item.Product.Name} removed from cart. Stock updated.");
        }
        else
        {
            Console.WriteLine("Product not found in cart.");
        }
    }

    public void DisplayCart()
    {
        if (cart.Count == 0)
        {
            Console.WriteLine("Your cart is empty.");
            return;
        }

        double total = 0;
        Console.WriteLine("\nItems in your cart:");
        foreach (var (Product, Quantity) in cart)
        {
            Console.WriteLine($"{Product.Name} x{Quantity} - Rs.{Product.Price * Quantity}");
            total += Product.Price * Quantity;
        }
        Console.WriteLine($"Total: Rs.{total}");
    }

    public void Checkout()
    {
        if (cart.Count == 0)
        {
            Console.WriteLine("Your cart is empty.");
            return;
        }

        DisplayCart();
        Console.WriteLine("Checking out... Thank you for shopping!");
        cart.Clear(); 
    }
}
