import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { CartItem, CartResponse } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, IconComponent, ProductImageComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  cart = signal<CartResponse | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.cartService.getCart().subscribe({
      next: (c) => {
        this.cart.set(c);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  totalQuantity(c: CartResponse) {
    return c.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  changeQty(item: CartItem, delta: number) {
    const qty = item.quantity + delta;
    if (qty < 1) {
      this.remove(item);
      return;
    }
    this.error.set('');
    this.cartService.updateQuantity(item.id, qty).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  remove(item: CartItem) {
    this.cartService.remove(item.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
