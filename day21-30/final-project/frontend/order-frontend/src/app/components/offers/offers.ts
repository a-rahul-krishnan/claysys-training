import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';

export interface Offer {
  id: number;
  title: string;
  discount: number;
  couponCode: string;
  color: string;
}

@Component({
  selector: 'app-offers',
  imports: [Sidebar,Header,CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers {

   offers: Offer[] = [
    {
      id: 1,
      title: '10% Off',
      discount: 10,
      couponCode: 'SAVE10',
      color: '#00afff'
    },
    {
      id: 2,
      title: '20% Off',
      discount: 20,
      couponCode: 'SAVE20',
      color: '#70b873'
    },
    {
      id: 3,
      title: '15% Off',
      discount: 15,
      couponCode: 'SAVE15',
      color: '#ff6b6b'
    },
    {
      id: 4,
      title: '25% Off',
      discount: 25,
      couponCode: 'SAVE25',
      color: '#ffa500'
    }
  ];
  filteredOffers: Offer[] = this.offers;
  searchQuery = '';

    onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredOffers = this.offers;
    } else {
      this.filteredOffers = this.offers.filter(O =>
        O.couponCode.toLowerCase().includes(query) ||
        O.discount.toString().includes(query)
      );
    }
  }
}
