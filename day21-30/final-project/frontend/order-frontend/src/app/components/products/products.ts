import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  imports: [CommonModule,Sidebar,Header],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
   products: Product[] = [];
   filteredProducts: Product[] = [];
   searchQuery = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        alert('Failed to load products');
      }
    });
  }

  
  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.productId.toString().includes(query)
      );
    }
  }

}
