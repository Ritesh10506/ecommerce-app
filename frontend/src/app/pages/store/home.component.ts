import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { Category, Product } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, IconComponent, ProductImageComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<number | null>(null);
  query = signal('');
  sort = signal<SortOption>('newest');
  loading = signal(true);
  error = signal('');
  toast = signal('');
  addingId = signal<number | null>(null);

  /** Products after search, category filter and sorting (all done in the browser). */
  products = computed(() => {
    const q = this.query().toLowerCase();
    const cat = this.selectedCategory();
    let list = this.allProducts().filter(
      (p) =>
        (cat === null || p.category?.id === cat) &&
        (!q || p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q))
    );
    switch (this.sort()) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list = [...list].sort((a, b) => b.id - a.id);
    }
    return list;
  });

  countFor(categoryId: number) {
    return this.allProducts().filter((p) => p.category?.id === categoryId).length;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => this.query.set(params.get('q') ?? ''));
    this.productService.getCategories().subscribe({ next: (c) => this.categories.set(c) });
    this.productService.getAll().subscribe({
      next: (list) => {
        this.allProducts.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  clearSearch() {
    this.router.navigate(['/products']);
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.addingId.set(product.id);
    this.cart.add(product.id, 1).subscribe({
      next: () => {
        this.addingId.set(null);
        this.showToast(`${product.name} added to cart`);
      },
      error: (err) => {
        this.addingId.set(null);
        this.showToast(errorMessage(err));
      },
    });
  }

  private showToast(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2500);
  }
}
