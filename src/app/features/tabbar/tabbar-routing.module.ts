import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabbarPage } from './tabbar.page';

const routes: Routes = [
  {
    path: '',
    component: TabbarPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'feed',
        redirectTo: 'dashboard', // Placeholder for future feed module
        pathMatch: 'prefix'
      },
      {
        path: 'profile',
        redirectTo: 'dashboard', // Placeholder for future profile module
        pathMatch: 'prefix'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabbarPageRoutingModule {}
