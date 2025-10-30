import { Component, EventEmitter, Input , Output} from '@angular/core';
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
  @Input() searchQuery = '';
  @Output() searchChange = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
