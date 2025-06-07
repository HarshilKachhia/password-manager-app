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
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() { }
  
  onSearch(query: any) {
    this.searchQuery = query;
    console.log('this.searchQuery: ', this.searchQuery);
  }
}
