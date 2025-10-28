using Microsoft.AspNetCore.Mvc;
using OrderManagementAPI.Data;
using OrderManagementAPI.Models;
using System.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly DatabaseHelper _db;
    public ProductsController(DatabaseHelper db) => _db = db;

    [HttpGet]
    public IActionResult GetProducts()
    {
        var products = new List<Product>();
        using var conn = _db.GetConnection();
        conn.Open();

        using var cmd = new SqlCommand("SELECT * FROM Products", conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            products.Add(new Product
            {
                ProductId = (int)reader["ProductId"],
                Name = reader["Name"].ToString(),
                Price = (decimal)reader["Price"]
            });
        }

        return Ok(products);
    }
}
