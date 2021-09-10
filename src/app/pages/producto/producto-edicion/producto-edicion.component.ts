
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';

import { switchMap } from 'rxjs/operators';
import { Producto } from '../../../_model/producto';
import { ProductoService } from '../../../_service/producto.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
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


 displayedColumns = [ 'insumo', 'cantidad','unidad'];
 columnsToDisplay: string[] = this.displayedColumns.slice();


 idInsumoSeleccionado: number;


  constructor(private productoService: ProductoService,

    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
) { }

  ngOnInit(): void {

    this.producto = new Producto();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl(''),
      'precio': new FormControl(''),
      'categoriaProducto': new FormControl(''),
      'cantidad': new FormControl(''),
      'insumo': new FormControl(''),
      'unidad': new FormControl(''),
    })

    this.route.params.subscribe((params: Params) => {
      this.idProducto = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.productoService.listarPorId(this.idProducto).subscribe(data => {

        let id = data.idProducto;
        let nombre = data.nombre;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(data.descripcion),

          'precio': new FormControl(data.precio),
          'categoriaInsumo': new FormControl(''),
          'cantidad': new FormControl(''),
          'insumo': new FormControl(''),
      'unidad': new FormControl(''),
        });


        // this.productoDetalleService.listarProductosDetalle(id).subscribe(data => {
        //   this.productoDetalleArr = data
        // });

      });
    }
  }


  operar() {
    console.log('entro a operar')
    this.producto.idProducto = this.form.value['id'];
    this.producto.nombre = this.form.value['nombre'];
    this.producto.precio = this.form.value['precio'];
    this.producto.descripcion = this.form.value['descripcion'];
    // let categoriaProducto = new CategoriaProducto()
    // categoriaProducto = this.form.value['categoriaProducto'];

    // let destino = new Destino()
    // destino.idDestino = 1

    // let productoDto = new ProductoDto()
    // productoDto.producto = this.producto
    // productoDto.productoDetalles = this.productoDetalleArr
    // console.log(productoDto)

    if (this.producto != null && this.producto.idProducto > 0) {

      //BUENA PRACTICA
      this.productoService.registrar(this.producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio("Se modificó");
      });

    } else {
      //PRACTICA COMUN
      this.productoService.modificar(this.producto).pipe(switchMap(() => {
        return this.productoService.listar()
      })).subscribe(data => {
        this.productoService.setProductoCambio(data)
        this.productoService.setMensajeCambio("Se registró")
      })
    }

    this.router.navigate(['producto']);
  }



  public objectComparisonFunction = function( option: any, value: any ) : boolean {
    return option.idCategoriaProducto === value.idCategoriaProducto;
  }


}
