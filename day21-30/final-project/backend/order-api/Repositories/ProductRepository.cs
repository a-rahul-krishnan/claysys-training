using OrderManagementAPI.Data;
using OrderManagementAPI.Models;
using System.Data.SqlClient;

namespace OrderManagementAPI.Repositories
{
    public class ProductRepository
    {
        private readonly DatabaseHelper _db;
        public ProductRepository(DatabaseHelper db) => _db = db;

        public List<Product> GetProducts()
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

            return products;
        }
    }
}
