import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';
import { Category, Product } from './models';

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: { id: number };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Product[]>(`${API_URL}/products`);
  }

  getById(id: number) {
    return this.http.get<Product>(`${API_URL}/products/${id}`);
  }

  getByCategory(categoryId: number) {
    return this.http.get<Product[]>(`${API_URL}/products/category/${categoryId}`);
  }

  search(name: string) {
    return this.http.get<Product[]>(`${API_URL}/products/search`, { params: { name } });
  }

  getCategories() {
    return this.http.get<Category[]>(`${API_URL}/categories`);
  }

  // ----- Admin -----
  create(product: ProductPayload) {
    return this.http.post<Product>(`${API_URL}/products`, product);
  }

  update(id: number, product: ProductPayload) {
    return this.http.put<Product>(`${API_URL}/products/${id}`, product);
  }

  delete(id: number) {
    return this.http.delete(`${API_URL}/products/${id}`, { responseType: 'text' });
  }

  createCategory(category: { name: string; description: string }) {
    return this.http.post<Category>(`${API_URL}/categories`, category);
  }
}
