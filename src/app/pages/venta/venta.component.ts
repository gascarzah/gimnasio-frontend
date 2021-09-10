import { ConfirmDialogComponent } from './../util/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VentaDto } from './../../_dto/ventaDto';
import { ListaVentaComponent } from './lista-venta/lista-venta.component';
import { VentaService } from 'src/app/_service/venta.service';
import { VentaDetalle } from './../../_model/venta-detalle';
import { Venta } from './../../_model/venta';
import { PlanService } from './../../_service/plan.service';
import { Plan } from './../../_model/plan';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { ClienteEdicionComponent } from './../cliente/cliente-edicion/cliente-edicion.component';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from './../../_service/cliente.service';
import { Cliente } from './../../_model/cliente';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TipoReciboService } from './../../_service/tipo-recibo.service';
import { TipoRecibo } from './../../_model/tipo-recibo';

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  @ViewChild(ListaVentaComponent, { static: false }) listaVenta: ListaVentaComponent;
  total : number = 0.0;
  tipoRecibos$: Observable<TipoRecibo[]>;
  planes$: Observable<Plan[]>;
  clientesFiltrados$: Observable<Cliente[]>;
  productosFiltrados$: Observable<Producto[]>;
  form: FormGroup
  myControlCliente: FormControl = new FormControl();
  myControlProducto: FormControl = new FormControl();
  clientes: Cliente[]
  productos: Producto[]

  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  direccion: string;
  cliente: Cliente

  efectivo: number = 0
tempEfectivo: number = 0
visa: number = 0
tempVisa: number = 0
mastercard: number = 0
tempMasterCard: number = 0
vuelto: number = 0.0
ventaDetalleArr: VentaDetalle[] = []


displayedColumns = [
  'numVenta',
  'cliente',
  'tipoRecibo',
  'plan',
  'activo',
  'acciones'
];

dataSource: MatTableDataSource<Venta>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
cantidad: number = 0;

  constructor( private fb: FormBuilder,
               private tipoReciboService: TipoReciboService,
               private clienteService: ClienteService,
               public dialog: MatDialog,
               private productoService: ProductoService,
               private snackBar: MatSnackBar,
               private planService: PlanService,
               private ventaService: VentaService,) { }

  ngOnInit(): void {

    this.listarVenta()

    this.form = this.fb.group({
      'tipoRecibo': new FormControl(''),
      'cliente': this.myControlCliente,
      'producto': this.myControlProducto,
      'plan': new FormControl(''),
      // 'observacion': new FormControl(''),
      // 'empleado': this.myControlEmpleado,
      'numVenta': new FormControl(''),
      'efectivo': new FormControl(''),
      'visa': new FormControl(''),
      'mastercard': new FormControl(''),
      'vuelto': new FormControl(''),
      pedidosDetalle: this.fb.array([]),

    })
    this.listarPlanes()
    this.listarTipoRecibo()
    this.listarClientes()
    this.listarProductos()
    this.clientesFiltrados$ = this.myControlCliente.valueChanges.pipe(map(val => this.filtrarClientes(val)));
    this.productosFiltrados$ = this.myControlProducto.valueChanges.pipe(map(val => this.filtrarProductos(val)));
  }

  get pedidosDetalle(){
    return this.form.controls['pedidosDetalle'] as FormArray
  }
  listarClientes() {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;
    });
  }

  listarTipoRecibo() {
    this.tipoRecibos$ = this.tipoReciboService.listar()
  }

  listarPlanes() {
    this.planes$ = this.planService.listar()
  }
  listarProductos() {
    this.productoService.listar().subscribe(data => {
      this.productos = data;
    });
  }

  mostrarCliente(val: Cliente) {
    return val ? `${val.apellidoPaterno} ${val.apellidoMaterno} ${val.nombres} ` : val;
  }
  mostrarProducto(val: Producto) {
    return val ? `${val.nombre}  ` : val;
  }
  filtrarClientes(val: any){
    if (val != null && val.idCliente > 0) {
      return this.clientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidoPaterno.toLowerCase().includes(val.apellidoPaterno.toLowerCase()) || el.apellidoMaterno.toLowerCase().includes(val.apellidoMaterno.toLowerCase()) || el.dni.includes(val.dni)
      );
      //EMPTY de RxJS
    }
    return this.clientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidoPaterno.toLowerCase().includes(val?.toLowerCase()) || el.apellidoMaterno.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  filtrarProductos(val: any){
    if (val != null && val.idProducto > 0) {
      return this.productos.filter(el =>
        el.nombre.toLowerCase().includes(val.nombre.toLowerCase())
      );
      //EMPTY de RxJS
    }
    return this.productos.filter(el =>
      el.nombre.toLowerCase().includes(val?.toLowerCase())
    );
  }
  openDialog(): void {

    const dialogRef = this.dialog.open(ClienteEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {nombres: this.nombres,
             apellidoPaterno: this.apellidoPaterno,
             apellidoMaterno: this.apellidoMaterno,
             telefono: this.telefono,
             email: this.email,
             direccion: this.direccion,

            }
    });

}

onSelectionChanged(event: any) {
  let producto = event.option.value

  if(producto !== null || producto !== undefined) {

    let cont = 0;
    for (let i = 0; i < this.pedidosDetalle.length; i++) {
      let pedidoDetalle = this.pedidosDetalle.controls[i];
      if (pedidoDetalle.value['producto'].idProducto === producto.idProducto) {
        cont++;
        break;
      }
    }

    if (cont > 0) {
      let mensaje = 'El producto se encuentra en la lista';
      this.myControlProducto.setValue('');
      this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
    } else {
      // this.nombre = producto.nombre
      const pedidoDetalleForm = this.fb.group({
      'categoria': new FormControl(producto.nombre),
      'producto': new FormControl(producto),
      'nombre': new FormControl(producto.nombre),
      'cantidad': new FormControl(0),
      'precio': new FormControl(producto.precio),
      'stock': new FormControl(producto.stock),
      'importe': new FormControl(0)
    })
    console.log(pedidoDetalleForm)
    this.pedidosDetalle.push(pedidoDetalleForm)
    this.myControlProducto.setValue('');
    }
  }
}



onEnter(){

  if(this.form.value['producto'] !== ''){
    let producto = new Producto()
    producto = this.form.value['producto']
    let cont = 0;
    for (let i = 0; i < this.pedidosDetalle.length; i++) {
      let pedidoDetalle = this.pedidosDetalle.controls[i];
      if (pedidoDetalle.value['producto'].idProducto === producto.idProducto) {
        cont++;
        break;
      }
    }

    if (cont > 0) {
      let mensaje = 'El producto se encuentra en la lista';
      this.myControlProducto.setValue('');
      this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
    } else {
      // this.nombre = producto.nombre
      const pedidoDetalleForm = this.fb.group({
      'categoria': new FormControl(producto.nombre),
      'producto': new FormControl(producto),
      'nombre': new FormControl(producto.nombre),
      'cantidad': new FormControl(0),
      'precio': new FormControl(producto.precio),
      'stock': new FormControl(producto.stock),
      'importe': new FormControl(0)
    })

    this.pedidosDetalle.push(pedidoDetalleForm)
    this.myControlProducto.setValue('');
    }
  }
}
getTotalLabel(){

  return Number(this.total.toFixed(2))
 }
calculoDiferenciaEfectivo(efectivo: number) {

  if (efectivo > 0) {
    this.efectivo = efectivo
    this.tempEfectivo = efectivo
    this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
    if(this.vuelto > 0){
      this.vuelto = Number(this.vuelto.toFixed(2))
    }else{
      this.vuelto = 0
    }
  } else {
    if (this.total === (Number(this.vuelto) + Number(this.tempEfectivo))) {
      this.vuelto = 0
    } else {
      this.vuelto = Number(this.vuelto) + Number(this.tempVisa)
    }
  }
}

calculoDiferenciaVisa(visa: number) {
  if (visa > 0) {
    this.visa = visa
    this.tempVisa = visa
    this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
    if(this.vuelto > 0){
      this.vuelto = Number(this.vuelto.toFixed(2))
    }else{
      this.vuelto = 0
    }
  } else {

    if (this.total === (Number(this.vuelto) + Number(this.tempVisa))) {
      this.vuelto = 0
    } else {
      this.vuelto = Number(this.vuelto) + Number(this.tempEfectivo)
    }
  }

}

calculoDiferenciaMastercard(mastercard: number) {
  if (mastercard > 0) {
    this.mastercard = mastercard
    this.tempMasterCard = mastercard
    this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
    if(this.vuelto > 0){
      this.vuelto = Number(this.vuelto.toFixed(2))
    }else{
      this.vuelto = 0
    }
  } else {

    if (this.total === (Number(this.vuelto) + Number(this.mastercard))) {
      this.vuelto = 0
    } else {
      this.vuelto = Number(this.vuelto) + Number(this.tempMasterCard)
    }
  }
}
getProductoLabel(i: number){
    return this.pedidosDetalle.controls[i].value['nombre']
   }
   getCantidadLabel(i: number){
    return this.pedidosDetalle.controls[i].value['cantidad']
   }
   getPrecioLabel(i: number){
    return this.pedidosDetalle.controls[i].value['precio']
   }
   getStockLabel(i: number){
    return this.pedidosDetalle.controls[i].value['stock']
   }
   getImporteLabel(i: number){
    return Number(this.pedidosDetalle.controls[i].value['importe']).toFixed(2)
   }

   removerProducto(i: number){

    let importe = this.pedidosDetalle.controls[i].value['importe']
    console.log(importe)
    this.total = this.total - importe
    this.pedidosDetalle.controls.splice(i, 1);
  }

  removerCantidad(i: number){
    let conteo =  this.pedidosDetalle.controls[i].value['cantidad']
    if(conteo > 0){
    conteo = conteo - 1
    this.pedidosDetalle.at(i).get('cantidad')?.patchValue(conteo)

    //calcular stock
    let stock =  this.pedidosDetalle.controls[i].value['stock']
    stock = stock + 1
    this.pedidosDetalle.at(i).get('stock')?.patchValue(stock)
    //calcular precio
    let precio =  this.pedidosDetalle.controls[i].value['precio']
    let importe = conteo * precio
    this.pedidosDetalle.at(i).get('importe')?.patchValue(importe)


      if(this.total > 0){
      this.total -= precio
      }
    }
  }


  agregarCantidad(i: number){
    let stock =  this.pedidosDetalle.controls[i].value['stock']
    if (stock > 0){
    //funciona el de abajo
    let conteo =  this.pedidosDetalle.controls[i].value['cantidad']
    conteo = conteo + 1
    this.pedidosDetalle.at(i).get('cantidad')?.patchValue(conteo)
    //calcular precio
    let precio =  this.pedidosDetalle.controls[i].value['precio']
    let importe = conteo * precio
    this.pedidosDetalle.at(i).get('importe')?.patchValue(importe)
    //calcular stock
    stock = stock - 1
    this.pedidosDetalle.at(i).get('stock')?.patchValue(stock)
    this.total += precio
    }
    }

registrarVenta(){
  console.log('llego')
  let venta = new Venta();
  // pedido.idPedido = this.form.value['id'];
  venta.cliente = this.form.value['cliente']
  venta.plan = this.form.value['plan']
  venta.numVenta = this.form.value['numVenta']
  // pedido.empleado = this.form.value['empleado']
  venta.tipoRecibo = this.form.value['tipoRecibo']

  //detallepedido
  this.pedidosDetalle.controls.forEach((element, index) => {
    let ventaDetalle = new VentaDetalle();
    ventaDetalle.cantidad = element.value['cantidad']
    // pedidoDetalle.observacion = element.value['observacion']

    let producto = element.value['producto']
    producto.stock = element.value['stock']
    // pedidoDetalle.producto =element.value['producto']
    ventaDetalle.producto = producto
    // this.productoArr.push(producto)
    this.ventaDetalleArr.push(ventaDetalle)
   })
   venta.total = this.total
   console.log(venta)
   console.log(this.ventaDetalleArr)

   let ventaDto = new VentaDto()
   ventaDto.venta = venta;
   ventaDto.ventaDetalle = this.ventaDetalleArr;

   this.ventaService.registrarTransaccion(ventaDto).subscribe(data => {
    this.listarVenta()

    this.snackBar.open("SE REGISTRO", "Aviso", { duration: 2000 });
  })




  this.ventaDetalleArr = []
  this.pedidosDetalle.controls = []
  this.total = 0
  this.form.reset()


}

listarVenta(){


  this.ventaService.getVentaCambio().subscribe(data => {

    this.crearTabla(data);
  });

  this.ventaService.getMensajeCambio().subscribe(data => {

    this.snackBar.open(data, 'AVISO', { duration: 2000 });
  });

  this.ventaService.listarPageable(0, 5).subscribe(data => {
    this.cantidad = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  });
}

filtrar(valor: string) {
  this.dataSource.filter = valor.trim().toLowerCase();
}

crearTabla(data: Venta[]) {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

eliminar(id: number) {
  const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Confirmacion de eliminacion',
      message: 'Estas seguro de eliminar este elemento? '
    }
  });

  confirmDialog.afterClosed().subscribe(result => {
    if (result === true) {
      this.ventaService.eliminar(id).pipe(switchMap(() => {
    return this.ventaService.listar();
  })).subscribe(data => {
    this.ventaService.setVentaCambio(data);
    this.ventaService.setMensajeCambio('SE ELIMINO');
  });
    }
  });

}

mostrarMas(e: any){

  this.ventaService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
    this.cantidad = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  });
}


}
