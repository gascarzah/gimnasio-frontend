import { ListaVentaComponent } from './venta/lista-venta/lista-venta.component';
import { PlanEdicionComponent } from './plan/plan-edicion/plan-edicion.component';
import { EmpleadoEdicionComponent } from './empleado/empleado-edicion/empleado-edicion.component';
import { ClienteEdicionComponent } from './cliente/cliente-edicion/cliente-edicion.component';
import { ConfirmDialogComponent } from './util/confirm-dialog/confirm-dialog.component';
import { VentaComponent } from './venta/venta.component';
import { ProductoEdicionComponent } from './producto/producto-edicion/producto-edicion.component';
import { ProductoComponent } from './producto/producto.component';
import { PlanComponent } from './plan/plan.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../material/material.module';

import { LayoutComponent } from './layout/layout.component';
import { PagesRoutingModule } from './pages-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { TokenComponent } from './login/recuperar/token/token.component';


@NgModule({
    imports: [
        MaterialModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        PdfViewerModule,
        PagesRoutingModule
    ],
    exports: [],
    declarations: [
    ClienteComponent,
    EmpleadoComponent,
    PlanComponent,
    ProductoComponent,
    ProductoEdicionComponent,
    VentaComponent,
    Not404Component,
    ConfirmDialogComponent,
    ClienteEdicionComponent,
    EmpleadoEdicionComponent,
    PlanEdicionComponent,
    ListaVentaComponent,
        LayoutComponent,
        InicioComponent,
        Not403Component,
        Not404Component,
        RecuperarComponent,
        TokenComponent  ,
        InicioComponent
    ],
    providers: [],
})
export class PagesModule { }
