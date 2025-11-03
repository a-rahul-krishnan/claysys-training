using OrderManagementAPI.Data;
using OrderManagementAPI.Models;
using System.Data.SqlClient;

namespace OrderManagementAPI.Repositories
{
    public class OrderRepository
    {
        private readonly DatabaseHelper _db;
        public OrderRepository(DatabaseHelper db) => _db = db;

        public SqlConnection GetConnection() => _db.GetConnection();

        // Create order
        public (bool success, string message, int orderId) CreateOrder(Order order)
        {
            using var conn = _db.GetConnection();
            conn.Open();
            var tx = conn.BeginTransaction();

            try
            {
                if (order.OrderItems == null || order.OrderItems.Count == 0)
                    return (false, "Order must contain at least one item.", 0);

                // 1️⃣ Check stock for all products
                foreach (var item in order.OrderItems)
                {
                    var stockCmd = new SqlCommand("SELECT Stock FROM Products WHERE ProductId = @pid", conn, tx);
                    stockCmd.Parameters.AddWithValue("@pid", item.ProductId);
                    var stockResult = stockCmd.ExecuteScalar();

                    if (stockResult == null)
                        throw new Exception($"Product not found: {item.ProductId}");

                    int stock = (int)stockResult;
                    if (stock < item.Quantity)
                        throw new Exception($"Insufficient stock for product {item.ProductId}. Available: {stock}, Required: {item.Quantity}");
                }

                // 2️⃣ Insert order
                var orderCmd = new SqlCommand(@"
                    INSERT INTO Orders (CustomerName, OrderDate, Status, TotalPrice)
                    OUTPUT INSERTED.OrderId 
                    VALUES (@CustomerName, @OrderDate, @Status, @TotalPrice)", conn, tx);

                orderCmd.Parameters.AddWithValue("@CustomerName", order.CustomerName);
                orderCmd.Parameters.AddWithValue("@OrderDate", order.OrderDate);
                orderCmd.Parameters.AddWithValue("@Status", order.Status);
                orderCmd.Parameters.AddWithValue("@TotalPrice", order.TotalPrice);
                int orderId = (int)orderCmd.ExecuteScalar();

                // 3️⃣ Insert items and reduce stock
                foreach (var item in order.OrderItems)
                {
                    var priceCmd = new SqlCommand("SELECT Price FROM Products WHERE ProductId=@pid", conn, tx);
                    priceCmd.Parameters.AddWithValue("@pid", item.ProductId);
                    var priceResult = priceCmd.ExecuteScalar();

                    if (priceResult == null)
                        throw new Exception($"Invalid ProductId: {item.ProductId}");

                    decimal price = (decimal)priceResult;

                    // Insert into OrderItems
                    var insertItem = new SqlCommand(@"
                        INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price)
                        VALUES (@OrderId,@ProductId,@Quantity,@Price)", conn, tx);
                    insertItem.Parameters.AddWithValue("@OrderId", orderId);
                    insertItem.Parameters.AddWithValue("@ProductId", item.ProductId);
                    insertItem.Parameters.AddWithValue("@Quantity", item.Quantity);
                    insertItem.Parameters.AddWithValue("@Price", price);
                    insertItem.ExecuteNonQuery();

                    // Reduce stock
                    var updateStock = new SqlCommand("UPDATE Products SET Stock = Stock - @Quantity WHERE ProductId=@ProductId", conn, tx);
                    updateStock.Parameters.AddWithValue("@Quantity", item.Quantity);
                    updateStock.Parameters.AddWithValue("@ProductId", item.ProductId);
                    updateStock.ExecuteNonQuery();
                }

                tx.Commit();
                return (true, "Order created successfully", orderId);
            }
            catch (Exception ex)
            {
                tx.Rollback();
                return (false, ex.Message, 0);
            }
        }

        // Get all orders
        public List<Order> GetAllOrders()
        {
            List<Order> orders = new();
            using var conn = _db.GetConnection();
            conn.Open();

            var cmd = new SqlCommand("SELECT * FROM Orders ORDER BY OrderId DESC", conn);
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

            // Fetch order items
            foreach (var o in orders)
            {
                var itemCmd = new SqlCommand(@"
                    SELECT oi.OrderItemId, oi.OrderId, oi.ProductId, p.Name AS ProductName, 
                           oi.Quantity, oi.Price, oi.TotalPrice
                    FROM OrderItems oi
                    JOIN Products p ON oi.ProductId = p.ProductId
                    WHERE oi.OrderId = @OrderId", conn);
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
            return orders;
        }

        //  Update order
        public (bool success, string message) UpdateOrder(int id, Order order)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            var cmd = new SqlCommand(@"UPDATE Orders 
                                       SET CustomerName=@CustomerName, OrderDate=@OrderDate 
                                       WHERE OrderId=@OrderId", conn);
            cmd.Parameters.AddWithValue("@CustomerName", order.CustomerName);
            cmd.Parameters.AddWithValue("@OrderDate", order.OrderDate);
            cmd.Parameters.AddWithValue("@OrderId", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0
                ? (true, "Order updated successfully")
                : (false, "Order not found");
        }

        //  Update status
        public (bool success, string message) UpdateStatus(int id, string status)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            var cmd = new SqlCommand("UPDATE Orders SET Status=@Status WHERE OrderId=@OrderId", conn);
            cmd.Parameters.AddWithValue("@Status", status);
            cmd.Parameters.AddWithValue("@OrderId", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0
                ? (true, $"Order {id} status updated to {status}")
                : (false, $"Order {id} not found.");
        }

        //  Delete order
        public (bool success, string message) DeleteOrder(int id)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            var cmd = new SqlCommand("DELETE FROM Orders WHERE OrderId=@OrderId", conn);
            cmd.Parameters.AddWithValue("@OrderId", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0
                ? (true, $"Order {id} deleted successfully")
                : (false, "Order not found");
        }
    }
}
