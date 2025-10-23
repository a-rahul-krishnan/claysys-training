import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transactions',
  imports: [Sidebar,RouterOutlet],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {

}
