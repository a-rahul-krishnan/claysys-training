import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { OrderService } from '../../services/order';
import { Order } from '../../models/order';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit{
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  expandedOrderId: number | null = null;
  showEditModal = false;
  selectedOrder: Order | null = null;
  editCustomerName = '';
  editOrderDate = '';
  searchQuery = '';
  currentTime: Date = new Date();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.updateCurrentTime();
  }

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        this.onSearchChange();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        alert('Failed to load orders');
      }
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order =>
        order.orderId?.toString().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
      );
    }
  }

  toggleOrderDetails(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed-label';
      case 'pending':
        return 'pending-label';
      case 'failed':
        return 'failed-label';
      default:
        return 'pending-label';
    }
  }

  getCardClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed-card';
      case 'failed':
        return 'failed-card';
      default:
        return 'main-card';
    }
  }

  onCancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateStatus(orderId, 'Failed').subscribe({
        next: () => {
          alert('Order cancelled successfully');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          alert('Failed to cancel order');
        }
      });
    }
  }

  onAcceptOrder(orderId: number): void {
    if (confirm('Accept this order for pickup?')) {
      this.orderService.updateStatus(orderId, 'Completed').subscribe({
        next: () => {
          alert('Order accepted successfully');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error accepting order:', err);
          alert('Failed to accept order');
        }
      });
    }
  }

  openEditModal(order: Order): void {
    this.selectedOrder = order;
    this.editCustomerName = order.customerName;
    this.editOrderDate = new Date(order.orderDate).toISOString().split('T')[0];
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedOrder = null;
  }

  onUpdateOrder(): void {
    if (!this.selectedOrder) return;

    const updatedOrder: Order = {
      ...this.selectedOrder,
      customerName: this.editCustomerName,
      orderDate: new Date(this.editOrderDate).toISOString()
    };

    this.orderService.updateOrder(this.selectedOrder.orderId!, updatedOrder).subscribe({
      next: () => {
        alert('Order updated successfully');
        this.closeEditModal();
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error updating order:', err);
        alert('Failed to update order');
      }
    });
  }

  onDeleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order? This will also delete all order items.')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          alert('Order deleted successfully');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('Failed to delete order');
        }
      });
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
