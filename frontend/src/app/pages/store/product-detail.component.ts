import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { Product } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, IconComponent, ProductImageComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);

  /** From the URL /products/:id */
  id = input.required<string>();

  product = signal<Product | null>(null);
  quantity = signal(1);
  loading = signal(true);
  error = signal('');
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  ngOnInit() {
    this.productService.getById(Number(this.id())).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  changeQty(delta: number) {
    const p = this.product();
    if (!p) return;
    this.quantity.set(Math.min(Math.max(this.quantity() + delta, 1), p.stock));
  }

  addToCart(goToCart = false) {
    const p = this.product();
    if (!p) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cart.add(p.id, this.quantity()).subscribe({
      next: () => {
        if (goToCart) {
          this.router.navigate(['/cart']);
          return;
        }
        this.messageType.set('success');
        this.message.set(`Added ${this.quantity()} × ${p.name} to your cart`);
      },
      error: (err) => {
        this.messageType.set('error');
        this.message.set(errorMessage(err));
      },
    });
  }
}
