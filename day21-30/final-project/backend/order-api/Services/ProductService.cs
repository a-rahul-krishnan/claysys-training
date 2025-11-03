using OrderManagementAPI.Models;
using OrderManagementAPI.Repositories;

namespace OrderManagementAPI.Services
{
    public class ProductService
    {
        private readonly ProductRepository _repo;
        public ProductService(ProductRepository repo)
        {
            _repo = repo;
        }

        public List<Product> GetProducts() => _repo.GetProducts();
    }
}
