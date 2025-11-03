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

        public OrdersController(OrderService service)
        {
            _service = service;
        }

        // POST: /api/orders
        [HttpPost]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            var result = _service.CreateOrder(order);
            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new { message = result.message, orderId = result.orderId });
        }

        // GET: /api/orders
        [HttpGet]
        public IActionResult GetAllOrders()
        {
            var orders = _service.GetAllOrders();
            return Ok(orders);
        }

        // PUT: /api/orders/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateOrder(int id, [FromBody] Order order)
        {
            var result = _service.UpdateOrder(id, order);
            return result.success
                ? Ok(new { message = result.message, orderId = id })
                : NotFound(new { message = result.message });
        }

        // PATCH: /api/orders/{id}/{status}
        [HttpPatch("{id}/{status}")]
        public IActionResult UpdateStatus(int id, string status)
        {
            var validStatuses = new[] { "Pending", "Completed", "Failed" };
            if (!validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                return BadRequest(new { message = "Invalid status. Allowed: Pending, Completed, Failed." });

            var result = _service.UpdateStatus(id, status);
            return result.success
                ? Ok(new { message = result.message })
                : NotFound(new { message = result.message });
        }

        // DELETE: /api/orders/{id}
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
