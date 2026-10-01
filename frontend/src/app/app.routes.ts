import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth.guard';

import { StoreLayoutComponent } from './layouts/store-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';

import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';

import { HomeComponent } from './pages/store/home.component';
import { ProductDetailComponent } from './pages/store/product-detail.component';
import { CartComponent } from './pages/store/cart.component';
import { CheckoutComponent } from './pages/store/checkout.component';
import { MyOrdersComponent } from './pages/store/my-orders.component';

import { DashboardComponent } from './pages/admin/dashboard.component';
import { AdminProductsComponent } from './pages/admin/admin-products.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders.component';
import { AdminUsersComponent } from './pages/admin/admin-users.component';

export const routes: Routes = [
  // ---------- Auth pages (no navbar) ----------
  { path: 'login', component: LoginComponent, canActivate: [guestGuard], title: 'Login | ShopEasy' },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard], title: 'Sign up | ShopEasy' },

  // ---------- Admin panel (sidebar layout) ----------
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Admin' },
      { path: 'products', component: AdminProductsComponent, title: 'Products | Admin' },
      { path: 'categories', component: AdminCategoriesComponent, title: 'Categories | Admin' },
      { path: 'orders', component: AdminOrdersComponent, title: 'Orders | Admin' },
      { path: 'users', component: AdminUsersComponent, title: 'Users | Admin' },
    ],
  },

  // ---------- Customer store (navbar layout) ----------
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: HomeComponent, title: 'ShopEasy | Shop online' },
      { path: 'products/:id', component: ProductDetailComponent, title: 'Product | ShopEasy' },
      { path: 'cart', component: CartComponent, canActivate: [authGuard], title: 'Cart | ShopEasy' },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], title: 'Checkout | ShopEasy' },
      { path: 'orders', component: MyOrdersComponent, canActivate: [authGuard], title: 'My Orders | ShopEasy' },
    ],
  },

  { path: '**', redirectTo: 'products' },
];
