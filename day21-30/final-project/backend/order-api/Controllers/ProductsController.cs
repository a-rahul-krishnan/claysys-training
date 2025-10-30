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

    // GET: api/Products
    [HttpGet]
    public IActionResult GetProducts()
    {
        var products = new List<Product>();
        using var conn = _db.GetConnection();
        conn.Open();

        using var cmd = new SqlCommand("SELECT ProductId, Name, Price, Stock FROM Products", conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            products.Add(new Product
            {
                ProductId = (int)reader["ProductId"],
                Name = reader["Name"].ToString(),
                Price = (decimal)reader["Price"],
                Stock = (int)reader["Stock"]
            });
        }

        return Ok(products);
    }

    // GET: api/Products/{id}
    [HttpGet("{id}")]
    public IActionResult GetProductById(int id)
    {
        using var conn = _db.GetConnection();
        conn.Open();

        using var cmd = new SqlCommand("SELECT ProductId, Name, Price, Stock FROM Products WHERE ProductId = @Id", conn);
        cmd.Parameters.AddWithValue("@Id", id);

        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            var product = new Product
            {
                ProductId = (int)reader["ProductId"],
                Name = reader["Name"].ToString(),
                Price = (decimal)reader["Price"],
                Stock = (int)reader["Stock"]
            };
            return Ok(product);
        }

        return NotFound(new { message = "Product not found" });
    }

    // PUT: api/Products/{id}/stock
    [HttpPut("{id}/stock")]
    public IActionResult UpdateStock(int id, [FromBody] StockUpdateRequest request)
    {
        using var conn = _db.GetConnection();
        conn.Open();

        // Check if product exists and has enough stock
        string checkSql = "SELECT Stock FROM Products WHERE ProductId = @Id";
        using var checkCmd = new SqlCommand(checkSql, conn);
        checkCmd.Parameters.AddWithValue("@Id", id);

        var result = checkCmd.ExecuteScalar();
        if (result == null)
            return NotFound(new { message = "Product not found" });

        int currentStock = (int)result;
        int newStock = currentStock - request.Quantity;

        if (newStock < 0)
            return BadRequest(new { message = "Insufficient stock", currentStock });

        // Update stock
        string updateSql = "UPDATE Products SET Stock = @Stock WHERE ProductId = @Id";
        using var updateCmd = new SqlCommand(updateSql, conn);
        updateCmd.Parameters.AddWithValue("@Stock", newStock);
        updateCmd.Parameters.AddWithValue("@Id", id);
        updateCmd.ExecuteNonQuery();

        return Ok(new { message = "Stock updated successfully", newStock });
    }
}

public class StockUpdateRequest
{
    public int Quantity { get; set; }
}