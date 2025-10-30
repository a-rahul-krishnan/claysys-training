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

interface Coupon {
  code: string;
  discount: number;
}

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
  couponCode = '';
  appliedDiscount = 0;
  successMessage = '';
  errorMessage = '';

  // Available coupons (matching offers page)
  coupons: Coupon[] = [
    { code: 'SAVE10', discount: 10 },
    { code: 'SAVE15', discount: 15 },
    { code: 'SAVE20', discount: 20 },
    { code: 'SAVE25', discount: 25 }
  ];

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
        alert('Failed to load products. Please check if the backend API is running.');
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

  applyCoupon(): void {
    const coupon = this.coupons.find(c => c.code === this.couponCode.toUpperCase());
    if (coupon) {
      this.appliedDiscount = coupon.discount;
      this.successMessage = `Coupon "${coupon.code}" applied! You got ${coupon.discount}% discount.`;
      this.errorMessage = '';
      this.clearMessagesAfterDelay();
    } else {
      this.appliedDiscount = 0;
      this.errorMessage = 'Invalid coupon code!';
      this.successMessage = '';
      this.clearMessagesAfterDelay();
    }
  }

  removeCoupon(): void {
    this.couponCode = '';
    this.appliedDiscount = 0;
  }

  updateTotal(item: OrderItem): void {
    item.totalPrice = item.quantity * item.price;
  }

  getTotalPrice(): number {
    return this.orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  getDiscountAmount(): number {
    return (this.getTotalPrice() * this.appliedDiscount) / 100;
  }

  getFinalPrice(): number {
    return this.getTotalPrice() - this.getDiscountAmount();
  }

  setQuantity(productId: number, quantity: number): void {
  const item = this.orderItems.find(i => i.productId === productId);
  const product = this.products.find(p => p.productId === productId);
  
  if (item && product) {
    if (quantity > product.stock) {
      alert(`Only ${product.stock} units available for ${product.name}`);
      item.quantity = product.stock;
    } else {
      item.quantity = quantity;
    }
    this.updateTotal(item);
  }
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

  // Check stock availability
  for (const item of selectedItems) {
    const product = this.products.find(p => p.productId === item.productId);
    if (product && item.quantity > product.stock) {
      this.errorMessage = `Insufficient stock for ${product.name}. Available: ${product.stock}`;
      this.successMessage = '';
      this.clearMessagesAfterDelay();
      return;
    }
  }

  const order: Order = {
    customerName: this.customerName,
    orderDate: new Date().toISOString(),
    status: 'Pending',
    totalPrice: this.getFinalPrice(),
    orderItems: selectedItems
  };

  this.orderService.createOrder(order).subscribe({
    next: (response) => {
      this.successMessage = `Order created successfully! Order ID: ${response.orderId}. Final Amount: £${this.getFinalPrice().toFixed(2)}`;
      this.errorMessage = '';
      this.resetForm();
      this.loadProducts(); // Reload to get updated stock
      this.clearMessagesAfterDelay();
    },
    error: (err) => {
      console.error('Error creating order:', err);
      this.errorMessage = err.error?.message || 'Failed to create order. Please try again.';
      this.successMessage = '';
      this.clearMessagesAfterDelay();
    }
  });
}

  resetForm(): void {
    this.customerName = '';
    this.couponCode = '';
    this.appliedDiscount = 0;
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


}
