import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { CartResponse } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, IconComponent, ProductImageComponent],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);

  cart = signal<CartResponse | null>(null);
  fullName = this.auth.currentUser()?.name ?? '';
  phone = '';
  street = '';
  city = '';
  state = '';
  pincode = '';
  payment = 'COD';
  placing = signal(false);
  error = signal('');

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (c) => this.cart.set(c),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  placeOrder() {
    this.error.set('');
    this.placing.set(true);
    const address = `${this.fullName}, ${this.street}, ${this.city}, ${this.state} - ${this.pincode}. Phone: ${this.phone}`;

    this.cartService.checkout(address).subscribe({
      next: (order) => {
        this.placing.set(false);
        this.router.navigate(['/orders'], { queryParams: { placed: order.id } });
      },
      error: (err) => {
        this.placing.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}
