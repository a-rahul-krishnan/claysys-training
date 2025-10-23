import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-savings',
  imports: [Sidebar,RouterOutlet],
  templateUrl: './savings.html',
  styleUrl: './savings.css',
})
export class Savings {

}
