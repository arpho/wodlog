import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'recover-password',
    loadComponent: () =>
      import('../pages/recover-password/recover-password.page').then(
        (m) => m.RecoverPasswordPage
      ),
  },
  {
    path: 'edit-activity',
    loadComponent: () =>
      import('./pages/activities/edit-activity/edit-activity.page').then(
        (m) => m.EditActivityPage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'create-activity',
    loadComponent: () =>
      import(
        './pages/activities/create-activity/create-activity/create-activity.page'
      ).then((m) => m.CreateActivityPage),
  },

  {
    path: 'create-wod',
    loadComponent: () =>
      import('./pages/wod/create/create-wod/create-wod.page').then(
        (m) => m.CreateWodPage
      ),
  },
  {
    path: 'edit-wod',
    loadComponent: () =>
      import('./pages/wod/edit/edit-wod/edit-wod.page').then(
        (m) => m.EditWodPage
      ),
  },
  {
    path: 'wods',
    loadComponent: () =>
      import('./pages/wod/list/list-wod/list-wod.page').then(
        (m) => m.ListWodPage
      ),
  },
];
