import { Routes } from '@angular/router';
import { Savings } from './pages/savings/savings';
import { Transactions } from './pages/transactions/transactions';
import { Data } from './pages/data/data';

export const routes: Routes = [
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  { path: 'savings', component: Savings },
  { path: 'transactions', component: Transactions },
  { path: 'data', component: Data},
  { path: '**', redirectTo: 'savings' }
];
