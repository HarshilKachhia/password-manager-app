import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { query, where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private databaseService: DatabaseService,
  ) { }

  fetchUserDataFromUID(userId: string) {
    if (!userId) return;
    this.databaseService.getCollection<any>(
      'users',
      ref => query(ref, where('uid', '==', userId))
    ).subscribe(userData => {
      console.log('User Data:', userData);
    });
  }
}
