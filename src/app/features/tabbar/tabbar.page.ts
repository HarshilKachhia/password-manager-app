import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from '../auth/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { IonTabs } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.page.html',
  styleUrls: ['./tabbar.page.scss'],
  standalone: false,
})
export class TabbarPage implements OnInit {
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.fetchUserDataFromUID(this.authService.getUID() || '');
  }

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
    )
  }
}
