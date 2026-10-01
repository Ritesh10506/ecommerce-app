import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, IconComponent],
  templateUrl: './store-layout.component.html',
})
export class StoreLayoutComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  search = '';
  menuOpen = signal(false);
  year = new Date().getFullYear();

  doSearch() {
    const q = this.search.trim();
    this.router.navigate(['/products'], { queryParams: q ? { q } : {} });
    this.menuOpen.set(false);
  }

  logout() {
    this.cart.count.set(0);
    this.auth.logout();
  }
}
