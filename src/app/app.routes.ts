import { Routes } from '@angular/router';
import { authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'recover-password',
    loadComponent: () => import('../pages/recover-password/recover-password.page').then( m => m.RecoverPasswordPage)
  },
];
