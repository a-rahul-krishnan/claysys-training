export interface OrderItem {
  orderItemId?: number;
  orderId?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}