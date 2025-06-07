import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // This is the observable your AuthGuard is using
  isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private auth: Auth, private navCtrl: NavController) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      if (this.isLoggedIn()) {
        this.navCtrl.navigateRoot("/home");
      } else {
        this.navCtrl.navigateRoot("/auth");
      }
    });
  }

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  resetPassword(email: string): Promise<any> {
    return sendPasswordResetEmail(this.auth, email);
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  getUID(): string | null {
    return this.auth.currentUser?.uid || null;
  }
}
