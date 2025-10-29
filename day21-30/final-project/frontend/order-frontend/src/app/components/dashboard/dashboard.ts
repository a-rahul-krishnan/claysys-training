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
  orderItems: OrderItem[] = [];
  customerName = '';
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
        this.initializeOrderItems();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.errorMessage = 'Failed to load products';
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

  updateTotal(item: OrderItem): void {
    item.totalPrice = item.quantity * item.price;
  }

  getTotalPrice(): number {
    return this.orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  onSubmitOrder(): void {
    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter customer name';
      return;
    }

    const selectedItems = this.orderItems.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      this.errorMessage = 'Please select at least one product';
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
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.errorMessage = 'Failed to create order';
        this.successMessage = '';
      }
    });
  }

  resetForm(): void {
    this.customerName = '';
    this.initializeOrderItems();
  }
}
