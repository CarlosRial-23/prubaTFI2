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
  {
    path: 'alta-empleado',
    loadComponent: () => import('./paginas/alta-empleado/alta-empleado.page').then( m => m.AltaEmpleadoPage)
  },
  {
    path: 'menu-digital',
    loadComponent: () => import('./paginas/menu-digital/menu-digital.page').then( m => m.MenuDigitalPage)
  },
  {
    path: 'escaneo-mesa',
    loadComponent: () => import('./paginas/escaneo-mesa/escaneo-mesa.page').then( m => m.EscaneoMesaPage)
  },
  
  {
    path: 'alta-producto',
    loadComponent: () => import('./paginas/alta-producto/alta-producto.page').then( m => m.AltaProductoPage)
  },  {
    path: 'dashboard-metre',
    loadComponent: () => import('./paginas/dashboard-metre/dashboard-metre.page').then( m => m.DashboardMetrePage)
  },
  {
    path: 'seleccion-comensales',
    loadComponent: () => import('./paginas/seleccion-comensales/seleccion-comensales.page').then( m => m.SeleccionComensalesPage)
  },
  {
    path: 'alta-cliente',
    loadComponent: () => import('./paginas/alta-cliente/alta-cliente.page').then( m => m.AltaClientePage)
  },


];
