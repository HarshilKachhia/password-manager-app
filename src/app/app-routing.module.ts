import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthRedirectGuard } from './features/auth/services/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthRedirectGuard]
  },
  {
    path: '',
    loadChildren: () => import('./features/tabbar/tabbar.module').then(m => m.TabbarPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: '**',
    redirectTo: 'dashboard', // Redirect to login for undefined routes
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
