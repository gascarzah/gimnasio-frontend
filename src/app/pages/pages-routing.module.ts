import { InicioComponent } from './inicio/inicio.component';
import { Not403Component } from './not403/not403.component';
import { ProductoEdicionComponent } from './producto/producto-edicion/producto-edicion.component';
import { ProductoComponent } from './producto/producto.component';
import { ListaVentaComponent } from './venta/lista-venta/lista-venta.component';
import { VentaComponent } from './venta/venta.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { PlanComponent } from './plan/plan.component';
import { GuardService } from './../_service/guard.service';
import { ClienteComponent } from './cliente/cliente.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent, canActivate: [GuardService] },
  {
    path: 'cliente', component: ClienteComponent, canActivate: [GuardService]
  },
  {
    path: 'plan', component: PlanComponent, canActivate: [GuardService]
  },
  {
    path: 'empleado', component: EmpleadoComponent, canActivate: [GuardService]
  },
  {
    path: 'venta', component: VentaComponent, children: [
      { path: '', component: ListaVentaComponent },

    ], canActivate: [GuardService]
  },

  {
    path: 'producto', component: ProductoComponent, children: [
      { path: 'nuevo', component: ProductoEdicionComponent },
      { path: 'edicion/:id', component: ProductoEdicionComponent },
    ], canActivate: [GuardService]
  },
  { path: 'not-403', component: Not403Component },
  {
    path: '**',
    redirectTo: 'not-404'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
