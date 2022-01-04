import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';

import { switchMap } from 'rxjs/operators';
import { Producto } from '../../../_model/producto';
import { ProductoService } from '../../../_service/producto.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {

 form: FormGroup

 edicion: boolean = false;
 producto: Producto
 idProducto: number;

 cantidad: number;
 mensaje: string;
 habilitado: boolean = true
 displayedColumns = [ 'insumo', 'cantidad','unidad'];
 columnsToDisplay: string[] = this.displayedColumns.slice();


 idInsumoSeleccionado: number;


  constructor(public dialogRef: MatDialogRef<ProductoEdicionComponent>,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private snackBar: MatSnackBar,

) {
  console.log(data)
  if(this.data.idProducto == null){
    this.habilitado = false
  }else{
    this.habilitado = true
  }



 }

 ngOnInit(): void {

}


registrar(): void {

if(this.validacion(this.data)){
  if(this.data.idProducto == undefined){
    this.productoService.registrar(this.data).pipe(switchMap(() => {
    return this.productoService.listar();
  })).subscribe(data => {
    this.productoService.productoCambio.next(data);
    this.productoService.mensajeCambio.next('SE REGISTRO');
  });
  }else{
    this.productoService.modificar(this.data).subscribe(() => {
      this.productoService.listar().subscribe(data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio('SE MODIFICÓ');
      });
    });
  }
  this.dialogRef.close();
}
}

validacion(data: Producto){

if(!data.nombre){
  this.mensaje = `Debe agregar un nombre`;
  this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
  return false
}else if(!data.descripcion){
  this.mensaje = `Ingresar descripcion`;
  this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
  return false
}else if(!data.precio){
  this.mensaje = `Ingresar precio`;
  this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
  return false
}else if(!data.stock){
  this.mensaje = `Ingresar stock`;
  this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
  return false
}

return true

}


public objectComparisonFunction = function( option: any, value: any ) : boolean {
return option.idCategoriaProducto === value.idCategoriaProducto;
}
keyPressAlpha(event: any) {

var inp = String.fromCharCode(event.keyCode);

if (/[a-zA-Z ]/.test(inp)) {
  return true;
} else {
  event.preventDefault();
  return false;
}
}

// Only Integer Numbers
keyPressNumbers(event: any) {
var charCode = (event.which) ? event.which : event.keyCode;
// Only Numbers 0-9
if ((charCode < 48 || charCode > 57)) {
event.preventDefault();
return false;
} else {
return true;
}
}

// Only AlphaNumeric with Some Characters [-_ ]
keyPressAlphaNumericWithCharacters(event: any) {

var inp = String.fromCharCode(event.keyCode);
// Allow numbers, alpahbets, space, underscore
if (/[a-zA-Z0-9-_. ]/.test(inp)) {
return true;
} else {
event.preventDefault();
return false;
}
}

}
