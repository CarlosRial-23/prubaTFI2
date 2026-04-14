import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'presentacion',
    pathMatch: 'full',
  },
  {
    path: 'presentacion',
    loadComponent: () => import('./paginas/presentacion/presentacion.page').then( m => m.PresentacionPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./paginas/inicio/inicio.page').then( m => m.InicioPage)
  },
{
    path: 'inicio',
    loadComponent: () => import('./paginas/inicio/inicio.page').then(m => m.InicioPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./paginas/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'ingreso-qr',
    loadComponent: () => import('./paginas/ingreso-qr/ingreso-qr.page').then( m => m.IngresoQrPage)
  },
  {
    path: 'sala-espera',
    loadComponent: () => import('./paginas/sala-espera/sala-espera.page').then( m => m.SalaEsperaPage)
  },
  {
    path: 'dashboard-administrador',
    loadComponent: () => import('./paginas/dashboard-administrador/dashboard-administrador.page').then( m => m.DashboardAdminPage)
  },
  {
    path: 'aprobacion-clientes',
    loadComponent: () => import('./paginas/aprobacion-clientes/aprobacion-clientes.page').then( m => m.AprobacionClientesPage)
  },
  {
    path: 'alta-mesas',
    loadComponent: () => import('./paginas/alta-mesas/alta-mesas.page').then( m => m.AltaMesasPage)
  },
];
