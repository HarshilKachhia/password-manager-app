import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';

// Guard for protected routes
export const AuthGuard: CanActivateFn = async () => {
  const authSvc = inject(AuthService);
  const navCtrl = inject(NavController);

  if (authSvc.isLoggedIn()) {
    return true;
  }

  return false;
};

export const AuthRedirectGuard: CanActivateFn = async () => {
  const authSvc = inject(AuthService);
  const navCtrl = inject(NavController);

  if (authSvc.isLoggedIn()) {
    return false;
  }

  return true;
};
