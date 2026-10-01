import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  sidebarOpen = signal(false);

  links = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/products', label: 'Products', icon: 'box' },
    { path: '/admin/categories', label: 'Categories', icon: 'tag' },
    { path: '/admin/orders', label: 'Orders', icon: 'orders' },
    { path: '/admin/users', label: 'Users', icon: 'users' },
  ];
}
