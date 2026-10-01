import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../core/order.service';
import { Order, OrderStatus } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, IconComponent, ProductImageComponent],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  filter = signal<OrderStatus | 'ALL'>('ALL');
  expanded = signal<number | null>(null);
  message = signal('');
  error = signal('');

  statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  filtered = computed(() => {
    const f = this.filter();
    return [...this.orders()].filter((o) => f === 'ALL' || o.status === f).sort((a, b) => b.id - a.id);
  });

  countFor(s: OrderStatus | 'ALL') {
    return s === 'ALL' ? this.orders().length : this.orders().filter((o) => o.status === s).length;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.orderService.getAll().subscribe({
      next: (o) => this.orders.set(o),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  toggle(id: number) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  changeStatus(order: Order, status: string) {
    this.error.set('');
    this.orderService.updateStatus(order.id, status as OrderStatus).subscribe({
      next: () => {
        this.message.set(`Order #${order.id} marked as ${status}`);
        setTimeout(() => this.message.set(''), 3000);
        this.load();
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.load();
      },
    });
  }
}
