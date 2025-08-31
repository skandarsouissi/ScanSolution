import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

 export const routes: Routes = [
    { 
    path: 'superadmin', 
    loadChildren: () => import('./superadmin/superadmin.module').then(m => m.SuperadminModule) 
  }, 
  {
    path: '',  // page client par défaut
    loadChildren: () =>
      import('./client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: '' }  // 404 → redirige vers client
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
