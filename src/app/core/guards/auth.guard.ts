import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (authService.isAuthenticated()) {
    return true; // Permitir acceso
  }

  // No autenticado: redirigir al login
  // Guardamos la URL a la que intentaba acceder para redirigir después del login
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false; // Bloquear acceso
};
