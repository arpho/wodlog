import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';




export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (await authService.isUserLogged()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
