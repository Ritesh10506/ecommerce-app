import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/order.service';
import { Order, OrderStatus } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, IconComponent, ProductImageComponent],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  /** From ?placed=ID after checkout */
  placed = input<string>();

  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal('');

  steps: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.orderService.myOrders().subscribe({
      next: (list) => {
        this.orders.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  stepIndex(status: OrderStatus) {
    return this.steps.indexOf(status);
  }

  canCancel(order: Order) {
    return order.status === 'PENDING' || order.status === 'CONFIRMED';
  }

  cancel(order: Order) {
    if (!confirm(`Cancel order #${order.id}? This cannot be undone.`)) return;
    this.orderService.cancel(order.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
