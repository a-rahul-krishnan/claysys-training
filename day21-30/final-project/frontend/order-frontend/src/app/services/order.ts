import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7206/api/Orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/${orderId}`);
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  updateOrder(orderId: number, order: Order): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}`, order);
  }

  updateStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/${status}`, {});
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }
}