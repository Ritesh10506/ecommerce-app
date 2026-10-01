import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from './api';
import { AuthService } from './auth.service';
import { CartItem, CartResponse, Order } from './models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  /** Number of different products in the cart (shown in the navbar). */
  count = signal(0);

  private get base() {
    return `${API_URL}/cart/${this.auth.userId}`;
  }

  getCart() {
    return this.http
      .get<CartResponse>(this.base)
      .pipe(tap((cart) => this.count.set(cart.totalItems)));
  }

  refresh() {
    this.getCart().subscribe({ error: () => {} });
  }

  add(productId: number, quantity = 1) {
    return this.http
      .post<CartItem>(`${this.base}/add`, null, { params: { productId, quantity } })
      .pipe(tap(() => this.refresh()));
  }

  updateQuantity(cartItemId: number, quantity: number) {
    return this.http.put<CartItem>(`${API_URL}/cart/item/${cartItemId}`, null, {
      params: { quantity },
    });
  }

  remove(cartItemId: number) {
    return this.http.delete(`${API_URL}/cart/item/${cartItemId}`, { responseType: 'text' });
  }

  checkout(shippingAddress: string) {
    return this.http
      .post<Order>(`${this.base}/checkout`, { shippingAddress })
      .pipe(tap(() => this.count.set(0)));
  }
}
