import { Routes } from '@angular/router';
import { numericIdGuard } from './core/guards/numeric-id-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full',
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/client-list/client-list').then(m => m.ClientList),
  },
  {
    path: 'clients/:id',
    canActivate: [numericIdGuard],
    loadComponent: () =>
      import('./features/client-detail/client-detail').then(m => m.ClientDetail),
  },
  {
    path: '**',
    redirectTo: 'clients',
  },
];
