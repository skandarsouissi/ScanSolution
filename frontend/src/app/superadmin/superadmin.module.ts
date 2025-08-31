import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { SuperadminComponent } from './superadmin.component';


@NgModule({

 
  imports: [
    CommonModule,
    SuperadminRoutingModule,SuperadminComponent
  ]
})
export class SuperadminModule {
  
 }
