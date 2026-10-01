import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from './api';
import { AuthResponse } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  /** Logged-in user (null when logged out). Saved in localStorage so it survives page refresh. */
  currentUser = signal<AuthResponse | null>(this.loadUser());
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  get token(): string | null {
    return this.currentUser()?.token ?? null;
  }

  get userId(): number | undefined {
    return this.currentUser()?.userId;
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, data)
      .pipe(tap((res) => this.saveUser(res)));
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, data)
      .pipe(tap((res) => this.saveUser(res)));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private saveUser(res: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(res));
    this.currentUser.set(res);
  }

  private loadUser(): AuthResponse | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
