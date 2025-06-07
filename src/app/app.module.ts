import { CUSTOM_ELEMENTS_SCHEMA, inject, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  provideFirebaseApp,
  initializeApp,
  FirebaseApp,
} from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { browserLocalPersistence, getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    // --- Firebase ---
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => {
      // Inject initialized FirebaseApp instance
      const app: FirebaseApp = inject(FirebaseApp); // Or use getApp() if preferred/needed
      if (Capacitor.isNativePlatform()) {
        // Use initializeAuth for native to configure persistence
        return initializeAuth(app, {
          persistence: [indexedDBLocalPersistence, browserLocalPersistence],
          popupRedirectResolver: undefined, // Or browserPopupRedirectResolver if needed
        });
      } else {
        // Use getAuth for web (uses default persistence)
        return getAuth(app);
      }
    }),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
