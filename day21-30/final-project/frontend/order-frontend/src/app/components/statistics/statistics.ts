import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { OrderService } from '../../services/order';
import { Order } from '../../models/order';

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-statistics',
  imports: [CommonModule, Header, Sidebar],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements OnInit {
  stats: OrderStats = {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    totalRevenue: 0
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.calculateStats(orders);
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        alert('Failed to load statistics');
      }
    });
  }

  calculateStats(orders: Order[]): void {
    this.stats.total = orders.length;
    this.stats.pending = orders.filter(o => o.status.toLowerCase() === 'pending').length;
    this.stats.completed = orders.filter(o => o.status.toLowerCase() === 'completed').length;
    this.stats.failed = orders.filter(o => o.status.toLowerCase() === 'failed').length;
    this.stats.totalRevenue = orders
      .filter(o => o.status.toLowerCase() === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }

}
