using Microsoft.AspNetCore.Mvc;
using OrderManagementAPI.Data;
using OrderManagementAPI.Models;
using System.Data.SqlClient;

namespace OrderManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DatabaseHelper _db;

        public OrdersController(DatabaseHelper db)
        {
            _db = db;
        }

        [HttpGet("{orderId}")]
        public IActionResult GetOrderItemsByOrderId(int orderId)
        {
            var items = new List<OrderItem>();

            using var conn = _db.GetConnection();
            conn.Open();

            string sql = @"
                SELECT oi.OrderItemId, oi.OrderId, oi.ProductId, p.Name AS ProductName,
                       oi.Quantity, oi.Price, oi.TotalPrice
                FROM OrderItems oi
                JOIN Products p ON oi.ProductId = p.ProductId
                WHERE oi.OrderId = @OrderId";

            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@OrderId", orderId);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                items.Add(new OrderItem
                {
                    OrderItemId = (int)reader["OrderItemId"],
                    OrderId = (int)reader["OrderId"],
                    ProductId = (int)reader["ProductId"],
                    ProductName = reader["ProductName"].ToString(),
                    Quantity = (int)reader["Quantity"],
                    Price = (decimal)reader["Price"],
                    TotalPrice = (decimal)reader["TotalPrice"]
                });
            }

            if (items.Count == 0)
                return NotFound($"No order items found for OrderId {orderId}.");

            return Ok(items);
        }
    

        // ✅ POST /api/Orders
        [HttpPost]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            if (order.OrderItems == null || order.OrderItems.Count == 0)
                return BadRequest("Order must contain at least one item.");

            using var conn = _db.GetConnection();
            conn.Open();
            SqlTransaction tx = conn.BeginTransaction();

            try
            {
                decimal totalOrderPrice = 0;

                // 1️⃣ Insert order (default: Pending, OrderDate = GETDATE())
                string orderSql = "INSERT INTO Orders (CustomerName) OUTPUT INSERTED.OrderId VALUES (@CustomerName)";
                using var orderCmd = new SqlCommand(orderSql, conn, tx);
                orderCmd.Parameters.AddWithValue("@CustomerName", order.CustomerName);
                int orderId = (int)orderCmd.ExecuteScalar();

                // 2️⃣ Insert order items and compute total
                foreach (var item in order.OrderItems)
                {
                    // Get product price safely
                    string priceQuery = "SELECT Price FROM Products WHERE ProductId = @pid";
                    using var priceCmd = new SqlCommand(priceQuery, conn, tx);
                    priceCmd.Parameters.AddWithValue("@pid", item.ProductId);
                    var result = priceCmd.ExecuteScalar();

                    if (result == null)
                        throw new Exception($"Invalid ProductId: {item.ProductId}");

                    decimal price = (decimal)result;
                    decimal itemTotal = price * item.Quantity;
                    totalOrderPrice += itemTotal;

                    string insertItemSql = @"
                        INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price)
                        VALUES (@OrderId, @ProductId, @Quantity, @Price)";
                    using var itemCmd = new SqlCommand(insertItemSql, conn, tx);
                    itemCmd.Parameters.AddWithValue("@OrderId", orderId);
                    itemCmd.Parameters.AddWithValue("@ProductId", item.ProductId);
                    itemCmd.Parameters.AddWithValue("@Quantity", item.Quantity);
                    itemCmd.Parameters.AddWithValue("@Price", price);
                    itemCmd.ExecuteNonQuery();
                }

                // 3️⃣ Update total order price
                string updateSql = "UPDATE Orders SET TotalPrice = @Total WHERE OrderId = @OrderId";
                using var updateCmd = new SqlCommand(updateSql, conn, tx);
                updateCmd.Parameters.AddWithValue("@Total", totalOrderPrice);
                updateCmd.Parameters.AddWithValue("@OrderId", orderId);
                updateCmd.ExecuteNonQuery();

                tx.Commit();
                return Ok(new { message = "Order created successfully", orderId });
            }
            catch (Exception ex)
            {
                tx.Rollback();
                return StatusCode(500, ex.Message);
            }
        }

        // ✅ GET /api/Orders
        [HttpGet]
        public IActionResult GetAllOrders()
        {
            List<Order> orders = new();
            using var conn = _db.GetConnection();
            conn.Open();

            string sql = "SELECT * FROM Orders ORDER BY OrderId DESC";
            using var cmd = new SqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                orders.Add(new Order
                {
                    OrderId = (int)reader["OrderId"],
                    CustomerName = reader["CustomerName"].ToString(),
                    OrderDate = (DateTime)reader["OrderDate"],
                    Status = reader["Status"].ToString(),
                    TotalPrice = (decimal)reader["TotalPrice"]
                });
            }
            reader.Close();

            // Load order items for each order
            foreach (var o in orders)
            {
                string itemSql = @"
                    SELECT oi.OrderItemId, oi.OrderId, oi.ProductId, p.Name AS ProductName, 
                           oi.Quantity, oi.Price, oi.TotalPrice
                    FROM OrderItems oi
                    JOIN Products p ON oi.ProductId = p.ProductId
                    WHERE oi.OrderId = @OrderId";

                using var itemCmd = new SqlCommand(itemSql, conn);
                itemCmd.Parameters.AddWithValue("@OrderId", o.OrderId);
                using var itemReader = itemCmd.ExecuteReader();

                while (itemReader.Read())
                {
                    o.OrderItems.Add(new OrderItem
                    {
                        OrderItemId = (int)itemReader["OrderItemId"],
                        OrderId = (int)itemReader["OrderId"],
                        ProductId = (int)itemReader["ProductId"],
                        ProductName = itemReader["ProductName"].ToString(),
                        Quantity = (int)itemReader["Quantity"],
                        Price = (decimal)itemReader["Price"],
                        TotalPrice = (decimal)itemReader["TotalPrice"]
                    });
                }
                itemReader.Close();
            }

            return Ok(orders);
        }

        // ✅ PUT /api/Orders/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateOrder(int id, [FromBody] Order order)
        {
            if (order == null)
                return BadRequest(new { message = "Invalid order data." });

            using var conn = _db.GetConnection();
            conn.Open();

            string sql = @"UPDATE Orders 
                   SET CustomerName = @CustomerName, OrderDate = @OrderDate
                   WHERE OrderId = @OrderId";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@CustomerName", order.CustomerName);
            cmd.Parameters.AddWithValue("@OrderDate", order.OrderDate);
            cmd.Parameters.AddWithValue("@OrderId", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0
                ? Ok(new { message = "Order updated successfully", orderId = id })
                : NotFound(new { message = "Order not found" });
        }


        // ✅ PATCH /api/Orders/{id}/{status}
        [HttpPatch("{id}/{status}")]
        public IActionResult UpdateStatus(int id, string status)
        {
            var validStatuses = new[] { "Pending", "Completed", "Failed" };
            if (!validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                return BadRequest("Invalid status. Allowed: Pending, Completed, Failed.");

            using var conn = _db.GetConnection();
            conn.Open();

            string sql = "UPDATE Orders SET Status = @Status WHERE OrderId = @OrderId";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Status", status);
            cmd.Parameters.AddWithValue("@OrderId", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0
                ? Ok(new { message = $"Order {id} status updated to {status}" })
                : NotFound($"Order {id} not found.");
        }

        // ✅ DELETE /api/Orders/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteOrder(int id)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            string sql = "DELETE FROM Orders WHERE OrderId = @OrderId";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@OrderId", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0
                ? Ok(new { message = $"Order {id} deleted successfully", orderId = id })
                : NotFound(new { message = "Order not found" });
        }
    }
}
