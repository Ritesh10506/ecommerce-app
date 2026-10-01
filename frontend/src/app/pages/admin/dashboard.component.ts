import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/product.service';
import { OrderService } from '../../core/order.service';
import { UserService } from '../../core/user.service';
import { Category, Order, OrderStatus, Product, User } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, IconComponent, ProductImageComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  orders = signal<Order[]>([]);
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal('');

  revenue = computed(() =>
    this.orders().filter((o) => o.status !== 'CANCELLED').reduce((sum, o) => sum + Number(o.totalAmount), 0)
  );
  pendingCount = computed(() => this.orders().filter((o) => o.status === 'PENDING').length);
  customers = computed(() => this.users().filter((u) => u.role === 'CUSTOMER').length);
  recentOrders = computed(() => [...this.orders()].sort((a, b) => b.id - a.id).slice(0, 6));
  lowStock = computed(() => this.products().filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 6));

  statusBreakdown = computed(() => {
    const statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const total = this.orders().length || 1;
    return statuses.map((s) => {
      const count = this.orders().filter((o) => o.status === s).length;
      return { status: s, count, percent: Math.round((count / total) * 100) };
    });
  });

  ngOnInit() {
    forkJoin({
      products: this.productService.getAll(),
      categories: this.productService.getCategories(),
      orders: this.orderService.getAll(),
      users: this.userService.getAll(),
    }).subscribe({
      next: (data) => {
        this.products.set(data.products);
        this.categories.set(data.categories);
        this.orders.set(data.orders);
        this.users.set(data.users);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
