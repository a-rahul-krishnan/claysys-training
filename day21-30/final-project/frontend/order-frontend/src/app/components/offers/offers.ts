import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';

export interface Offer {
  id: number;
  title: string;        
  days: string;         
  description: string;  
  color: string;
}

@Component({
  selector: 'app-offers',
  imports: [Sidebar, Header, CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers {
  offers: Offer[] = [
    {
      id: 1,
      title: 'Weekend Offer',
      days: 'Saturday & Sunday',
      description: 'Buy 2 Get 1 Free on Snacks ',
      color: '#00afff'
    },
    {
      id: 2,
      title: 'Weekdays',
      days: 'Weekdays',
      description: '---',
      color: '#70b873'
    },
    {
      id: 3,
      title: 'Happy Hours',
      days: 'Everyday (4 PM - 6 PM)',
      description: 'Buy 1 Get 1 Free on Drinks',
      color: '#ff6b6b'
    },

  ];
}
