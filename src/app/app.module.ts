// import { ProductoEdicionComponent } from './pages/producto/producto-edicion/producto-edicion.component';
// import { EmpleadoEdicionComponent } from './pages/empleado/empleado-edicion/empleado-edicion.component';
// import { ClienteEdicionComponent } from './pages/cliente/cliente-edicion/cliente-edicion.component';
// import { MaterialModule } from './material/material.module';
// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FlexLayoutModule } from '@angular/flex-layout';
// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ClienteComponent } from './pages/cliente/cliente.component';
// import { EmpleadoComponent } from './pages/empleado/empleado.component';
// import { PlanComponent } from './pages/plan/plan.component';
// import { ProductoComponent } from './pages/producto/producto.component';
// import { VentaComponent } from './pages/venta/venta.component';
// import { Not404Component } from './pages/not404/not404.component';
// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ConfirmDialogComponent } from './pages/util/confirm-dialog/confirm-dialog.component';
// import { PlanEdicionComponent } from './pages/plan/plan-edicion/plan-edicion.component';

// import { ListaVentaComponent } from './pages/venta/lista-venta/lista-venta.component';



// @NgModule({
//   declarations: [
//     AppComponent,
//     ClienteComponent,
//     EmpleadoComponent,
//     PlanComponent,
//     ProductoComponent,
//     ProductoEdicionComponent,
//     VentaComponent,
//     Not404Component,
//     ConfirmDialogComponent,
//     ClienteEdicionComponent,
//     EmpleadoEdicionComponent,
//     PlanEdicionComponent,

//     ListaVentaComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     BrowserAnimationsModule,
//     MaterialModule,
//     HttpClientModule,
//     ReactiveFormsModule,
//     FormsModule,
//     FlexLayoutModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  //entryComponents:[MedicoDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.substring(7)],
        disallowedRoutes: [`http://${environment.HOST.substring(7)}/login/enviarCorreo`],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
