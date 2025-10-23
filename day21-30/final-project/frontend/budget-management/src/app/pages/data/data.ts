import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-data',
  imports: [Sidebar,RouterOutlet],
  templateUrl: './data.html',
  styleUrl: './data.css',
})
export class Data {

}
