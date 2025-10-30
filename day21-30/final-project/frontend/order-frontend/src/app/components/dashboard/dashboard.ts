import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { ProductService } from '../../services/product';
import { OrderService } from '../../services/order';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { Header } from '../header/header';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
 products: Product[] = [];
  filteredProducts: Product[] = [];
  orderItems: OrderItem[] = [];
  customerName = '';
  searchQuery = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.initializeOrderItems();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.errorMessage = 'Failed to load products';
        this.clearMessagesAfterDelay();
      }
    });
  }

  initializeOrderItems(): void {
    this.orderItems = this.products.map(p => ({
      productId: p.productId,
      productName: p.name,
      quantity: 0,
      price: p.price,
      totalPrice: 0
    }));
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.productId.toString().includes(query)
      );
    }
  }

  updateTotal(item: OrderItem): void {
    item.totalPrice = item.quantity * item.price;
  }

  getTotalPrice(): number {
    return this.orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  onSubmitOrder(): void {
    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter customer name';
      this.successMessage = '';
      this.clearMessagesAfterDelay();
      return;
    }

    const selectedItems = this.orderItems.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      this.errorMessage = 'Please select at least one product';
      this.successMessage = '';
      this.clearMessagesAfterDelay();
      return;
    }

    const order: Order = {
      customerName: this.customerName,
      orderDate: new Date().toISOString(),
      status: 'Pending',
      totalPrice: this.getTotalPrice(),
      orderItems: selectedItems
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.successMessage = `Order created successfully! Order ID: ${response.orderId}`;
        this.errorMessage = '';
        this.resetForm();
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.errorMessage = 'Failed to create order. Please try again.';
        this.successMessage = '';
        this.clearMessagesAfterDelay();
      }
    });
  }

  resetForm(): void {
    this.customerName = '';
    this.initializeOrderItems();
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }

  getQuantity(productId: number): number {
    const item = this.orderItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  setQuantity(productId: number, quantity: number): void {
    const item = this.orderItems.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.updateTotal(item);
    }
  }
}
