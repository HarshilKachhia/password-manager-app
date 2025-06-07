import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
  standalone: false,
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: string = 'Lux Gifting';
  @Input() showBackButton: boolean = false;
  @Input() backButtonText: string = '';
  @Input() showMenu: boolean = false;
  @Input() showLogout: boolean = false;
  @Input() showSearch: boolean = false;
  
  @Output() search = new EventEmitter<string>();
  
  @ViewChild('searchBar') searchBar!: ElementRef;
  
  isSearchActive: boolean = false;
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {}
  
  async signOut() {
    await this.alertService.showAlert(
      'Logout', 
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Logout',
          role: 'confirm',
          handler: async () => {
            await this.authService.logout();
          },
        }
      ]
    );
  }
  
  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (!this.isSearchActive) {
      this.searchQuery = '';
      this.search.emit('');
    } else {
      // Focus on the search input when it becomes visible
      setTimeout(() => {
        if (this.searchBar && this.searchBar.nativeElement) {
          this.searchBar.nativeElement.focus();
        }
      }, 150);
    }
  }
  
  onSearchInput(event: any) {
    const query = event.target.value || '';
    this.search.emit(query);
  }
  
  clearSearch() {
    this.searchQuery = '';
    this.search.emit('');
  }
}
