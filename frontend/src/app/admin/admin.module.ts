import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


import { HttpClientModule } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardComponent,
HttpClientModule,ReactiveFormsModule,LoginComponent,FormsModule,
  ]
})
export class AdminModule { }
