import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  // Admin only
  getAll() {
    return this.http.get<User[]>(`${API_URL}/users`);
  }

  delete(id: number) {
    return this.http.delete(`${API_URL}/users/${id}`, { responseType: 'text' });
  }
}
