using OrderManagementAPI.Models;
using OrderManagementAPI.Repositories;

namespace OrderManagementAPI.Services
{
    public class OrderService
    {
        private readonly OrderRepository _repo;
        public OrderService(OrderRepository repo) => _repo = repo;

        public (bool success, string message, int orderId) CreateOrder(Order order)
            => _repo.CreateOrder(order);

        public List<Order> GetAllOrders()
            => _repo.GetAllOrders();

        public (bool success, string message) UpdateOrder(int id, Order order)
            => _repo.UpdateOrder(id, order);

        public (bool success, string message) UpdateStatus(int id, string status)
            => _repo.UpdateStatus(id, status);

        public (bool success, string message) DeleteOrder(int id)
            => _repo.DeleteOrder(id);
    }
}
