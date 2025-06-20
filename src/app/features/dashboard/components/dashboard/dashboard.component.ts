import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  items = [
    { icon: 'lock-closed', title: 'Bank Account' },
    { icon: 'person', title: 'Social Media' },
    { icon: 'mail', title: 'Email Account' }
  ];

  filteredData: any[] = [];

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.filteredData = this.items;
  }

  filteredItems(event: any) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    console.log('query: ', query);
    if (!query) {
      this.filteredData = this.items;
    }
    this.filteredData = this.items.filter(item => {
      console.log('item: ', item);
      return item.title.toLowerCase().includes(query)
    }) || [];
  }
}
