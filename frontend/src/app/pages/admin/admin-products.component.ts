import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { Category, Product } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';
import { ProductImageComponent } from '../../shared/product-image.component';

interface ProductForm {
  name: string;
  description: string;
  price: number | null;
  stock: number | null;
  imageUrl: string;
  categoryId: number | null;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, IconComponent, ProductImageComponent],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  search = signal('');
  categoryFilter = signal<number | null>(null);
  message = signal('');
  error = signal('');

  // modal state
  modalOpen = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  formError = signal('');
  form: ProductForm = this.emptyForm();

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    const cat = this.categoryFilter();
    return this.products()
      .filter((p) => (cat === null || p.category?.id === cat) && (!q || p.name.toLowerCase().includes(q)))
      .sort((a, b) => b.id - a.id);
  });

  ngOnInit() {
    this.load();
    this.productService.getCategories().subscribe({ next: (c) => this.categories.set(c) });
  }

  load() {
    this.productService.getAll().subscribe({
      next: (p) => this.products.set(p),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  openAdd() {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formError.set('');
    this.modalOpen.set(true);
  }

  openEdit(p: Product) {
    this.editingId.set(p.id);
    this.form = {
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl ?? '',
      categoryId: p.category?.id ?? null,
    };
    this.formError.set('');
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  save() {
    this.saving.set(true);
    this.formError.set('');
    const payload = {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      imageUrl: this.form.imageUrl.trim(),
      category: { id: Number(this.form.categoryId) },
    };
    const id = this.editingId();
    const request = id ? this.productService.update(id, payload) : this.productService.create(payload);

    request.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.flash(id ? `"${saved.name}" updated` : `"${saved.name}" added`);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(errorMessage(err));
      },
    });
  }

  remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    this.productService.delete(p.id).subscribe({
      next: () => {
        this.flash(`"${p.name}" deleted`);
        this.load();
      },
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  private flash(msg: string) {
    this.error.set('');
    this.message.set(msg);
    setTimeout(() => this.message.set(''), 3000);
  }

  private emptyForm(): ProductForm {
    return { name: '', description: '', price: null, stock: null, imageUrl: '', categoryId: null };
  }
}
