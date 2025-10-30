import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Orders } from './components/orders/orders';
import { AuthGuard } from './guards/auth-guard';
import { Offers } from './components/offers/offers';
import { Stocks } from './components/stocks/stocks';
import { Statistics } from './components/statistics/statistics';
import { Products } from './components/products/products';

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
  { 
    path: 'offers', 
    component: Offers,
    canActivate: [AuthGuard]
  },
  { 
    path: 'stocks', 
    component: Stocks,
    canActivate: [AuthGuard]
  },
  { 
    path: 'statistics', 
    component: Statistics,
    canActivate: [AuthGuard]
  },
  { 
    path: 'products', 
    component: Products,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];