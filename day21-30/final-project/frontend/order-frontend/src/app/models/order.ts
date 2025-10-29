import { OrderItem } from "./order-item";


export interface Order {
  orderId?: number;
  customerName: string;
  orderDate: Date | string;
  status: string;
  totalPrice: number;
  orderItems: OrderItem[];
}