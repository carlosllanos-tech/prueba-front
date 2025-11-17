import { Routes } from '@angular/router';

export const routes: Routes = [
    // Ruta por defecto - redirige al login
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },

    // Módulo de Autenticación (Lazy Loading)
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.AuthRoutingModule)
    },
];
