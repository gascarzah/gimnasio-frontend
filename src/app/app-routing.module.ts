// import { ListaVentaComponent } from './pages/venta/lista-venta/lista-venta.component';

// import { ProductoEdicionComponent } from './pages/producto/producto-edicion/producto-edicion.component';
// import { ProductoComponent } from './pages/producto/producto.component';
// import { VentaComponent } from './pages/venta/venta.component';
// import { PlanComponent } from './pages/plan/plan.component';
// import { EmpleadoComponent } from './pages/empleado/empleado.component';
// import { ClienteComponent } from './pages/cliente/cliente.component';
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   {
//     path: 'cliente', component: ClienteComponent
//   },
//   {
//     path: 'plan', component: PlanComponent
//   },
//   {
//     path: 'empleado', component: EmpleadoComponent
//   },
//   {
//     path: 'venta', component: VentaComponent, children: [
//       { path: '', component: ListaVentaComponent },

//     ]
//   },

//   {
//     path: 'producto', component: ProductoComponent, children: [
//       { path: 'nuevo', component: ProductoEdicionComponent },
//       { path: 'edicion/:id', component: ProductoEdicionComponent },
//     ]
//   },

//   {
//     path: '**',
//     redirectTo: 'not-404'
//   }
// ];


// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { Not404Component } from './pages/not404/not404.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'recuperar', component: RecuperarComponent, children: [
      { path: ':token', component: TokenComponent }
    ]
  },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  { path: 'not-404', component: Not404Component },
  {
    path: '**',
    redirectTo: 'not-404'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
