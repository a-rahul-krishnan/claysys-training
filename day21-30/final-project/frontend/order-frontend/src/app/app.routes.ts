import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Orders } from './components/orders/orders';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  { 
    path: 'orders', 
    component: Orders,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];