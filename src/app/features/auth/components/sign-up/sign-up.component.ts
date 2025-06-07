import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: false
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private databaseService: DatabaseService
  ) {
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', []],
      marketingConsent: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      const { email, password, name, phone, marketingConsent } = this.signUpForm.value;
      
      await this.alertService.showLoader('Creating account...')

      try {
        let userData = await this.authService.register(email, password);
        let objUser = {
          uid: userData.user.uid,
          email: email,
          name: name,
          phone: phone || ''
        }
        await this.addItem(objUser);
        this.alertService.showToast('Account created successfully!', 'success');
      } catch (error) {
        console.error('Registration error:', error);
        this.alertService.showToast(this.getErrorMessage(error), 'danger');
      } finally {
        await this.alertService.hideLoader();
      }
    }
  }

  async addItem(itemData: any) {
      try {
        const docRef = await this.databaseService.addDocToCollection('users', itemData);
        console.log('Added with ID:', docRef.id);
      } catch (e) {
        console.error(e);
      }
    }

  getErrorMessage(error: any): string {
    switch(error?.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email format. Please check your email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Registration failed. Please try again later.';
    }
  }

  navigateToLogin() {
    this.navCtrl.navigateBack('/auth/login');
  }
}
