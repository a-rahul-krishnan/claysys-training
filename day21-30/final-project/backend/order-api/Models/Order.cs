using System;
using System.Collections.Generic;

namespace OrderManagementAPI.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "Pending";
        public decimal TotalPrice { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
