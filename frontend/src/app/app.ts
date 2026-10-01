import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    const auth = inject(AuthService);
    if (auth.isLoggedIn() && !auth.isAdmin()) {
      inject(CartService).refresh();
    }
  }
}
