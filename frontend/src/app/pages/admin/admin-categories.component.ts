import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/product.service';
import { Category, Product } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  private productService = inject(ProductService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  name = '';
  description = '';
  saving = signal(false);
  message = signal('');
  error = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    forkJoin({ c: this.productService.getCategories(), p: this.productService.getAll() }).subscribe({
      next: ({ c, p }) => {
        this.categories.set(c);
        this.products.set(p);
      },
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  countFor(id: number) {
    return this.products().filter((p) => p.category?.id === id).length;
  }

  add() {
    this.saving.set(true);
    this.error.set('');
    this.productService.createCategory({ name: this.name.trim(), description: this.description.trim() }).subscribe({
      next: (c) => {
        this.saving.set(false);
        this.message.set(`Category "${c.name}" created`);
        setTimeout(() => this.message.set(''), 3000);
        this.name = '';
        this.description = '';
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}
