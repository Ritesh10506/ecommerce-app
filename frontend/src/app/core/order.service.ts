import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';
import { AuthService } from './auth.service';
import { Order, OrderStatus } from './models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  myOrders() {
    return this.http.get<Order[]>(`${API_URL}/orders/user/${this.auth.userId}`);
  }

  cancel(orderId: number) {
    return this.http.put<Order>(`${API_URL}/orders/${orderId}/cancel`, null);
  }

  // ----- Admin -----
  getAll() {
    return this.http.get<Order[]>(`${API_URL}/orders`);
  }

  updateStatus(orderId: number, status: OrderStatus) {
    return this.http.put<Order>(`${API_URL}/orders/${orderId}/status`, null, {
      params: { status },
    });
  }
}
