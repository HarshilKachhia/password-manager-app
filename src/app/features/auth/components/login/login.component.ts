import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private alertService: AlertService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() { }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      await this.alertService.showLoader('Logging in...');

      try {
        await this.authService.login(email, password);
        await this.alertService.showToast('Login successful', 'success');
      } catch (error) {
        console.error('Login error:', error);
        await this.alertService.showToast(this.getErrorMessage(error), 'danger');
      } finally {
        await this.alertService.hideLoader();
      }
    }
  }

  navigateToSignUp() {
    this.navCtrl.navigateForward('/auth/sign-up');
  }

  async forgotPassword() {
    this.navCtrl.navigateForward('/auth/forgot-password');
  }

  getErrorMessage(error: any): string {
    switch (error?.code) {
      case 'auth/user-not-found':
        return 'User not found. Please check your email.';
      case 'auth/wrong-password':
        return 'Invalid password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'auth/too-many-requests':
        return 'Too many login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Login failed. Please try again.';
    }
  }
}
