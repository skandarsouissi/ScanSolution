import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { AddCategoriesComponent } from './add-categories/add-categories.component';
import { AddProductComponent } from './add-product/add-product.component';


const routes: Routes = [
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent },
  { path: "add-categories", component: AddCategoriesComponent},
  { path: "add-categories/:id", component: AddCategoriesComponent },
  { path: "add-product", component: AddProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
import { Injectable } from '@angular/core';