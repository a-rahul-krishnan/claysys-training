import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';



@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
   @Input() pageTitle = 'Dashboard';

  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
