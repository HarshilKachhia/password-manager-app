import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

const components = [
  DashboardComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    CommonModule // Added CommonModule to enable ngFor, ngIf, etc.
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
