using Microsoft.AspNetCore.Mvc;
using OrderManagementAPI.Models;
using OrderManagementAPI.Services;

namespace OrderManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _service;
        public OrdersController(OrderService service) => _service = service;

<<<<<<< Updated upstream
        public OrdersController(DatabaseHelper db)
        {
            _db = db;
        }

        //  POST /api/Orders
=======
>>>>>>> Stashed changes
        [HttpPost]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            var result = _service.CreateOrder(order);
            if (!result.success)
                return BadRequest(new { message = result.message });
            return Ok(new { message = result.message, orderId = result.orderId });
        }

<<<<<<< Updated upstream
        //  GET /api/Orders
=======
>>>>>>> Stashed changes
        [HttpGet]
        public IActionResult GetAllOrders()
            => Ok(_service.GetAllOrders());

<<<<<<< Updated upstream
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

        //  PUT /api/Orders/{id}
=======
>>>>>>> Stashed changes
        [HttpPut("{id}")]
        public IActionResult UpdateOrder(int id, [FromBody] Order order)
        {
            var result = _service.UpdateOrder(id, order);
            return result.success
                ? Ok(new { message = result.message, orderId = id })
                : NotFound(new { message = result.message });
        }

<<<<<<< Updated upstream

        //  PATCH /api/Orders/{id}/{status}
=======
>>>>>>> Stashed changes
        [HttpPatch("{id}/{status}")]
        public IActionResult UpdateStatus(int id, string status)
        {
            var validStatuses = new[] { "Pending", "Completed", "Failed" };
            if (!validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                return BadRequest("Invalid status. Allowed: Pending, Completed, Failed.");

            var result = _service.UpdateStatus(id, status);
            return result.success
                ? Ok(new { message = result.message })
                : NotFound(result.message);
        }

<<<<<<< Updated upstream
        //  DELETE /api/Orders/{id}
=======
>>>>>>> Stashed changes
        [HttpDelete("{id}")]
        public IActionResult DeleteOrder(int id)
        {
            var result = _service.DeleteOrder(id);
            return result.success
                ? Ok(new { message = result.message, orderId = id })
                : NotFound(new { message = result.message });
        }
    }
}
