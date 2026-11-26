import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'mascotas' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'mascotas',
    canActivate: [authGuard],
    loadChildren: () => import('./features/mascotas/mascotas.module').then((m) => m.MascotasModule),
  },
  {
    path: 'citas',
    canActivate: [authGuard],
    loadChildren: () => import('./features/citas/citas.module').then((m) => m.CitasModule),
  },
  { path: '**', redirectTo: 'mascotas' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
