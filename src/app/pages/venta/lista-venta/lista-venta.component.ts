import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from './../../util/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentaService } from 'src/app/_service/venta.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Venta } from './../../../_model/venta';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lista-venta',
  templateUrl: './lista-venta.component.html',
  styleUrls: ['./lista-venta.component.css']
})
export class ListaVentaComponent implements OnInit {

  displayedColumns = [
                      'numVenta',
                      'cliente',
                      // 'tipoRecibo',
                      // 'plan',
                      // 'activo',
                      // 'acciones'
                    ];

  dataSource: MatTableDataSource<Venta>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;


  constructor(
    private ventaService: VentaService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    console.log('dentrto de oninit')

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


  // openDialog(): void {

  //   const dialogRef = this.dialog.open(EmpleadoEdicionComponent, {
  //     width: '500px',
  //     // height: '600px',
  //     maxHeight: '600px',
  //     data: {dni: this.dni,
  //            nombres: this.nombres,
  //            apellidoPaterno: this.apellidoPaterno,
  //            apellidoMaterno: this.apellidoMaterno,
  //            telefono: this.telefono,
  //            email: this.email,
  //            fechaIngreso: this.fechaIngreso,
  //            direccion: this.direccion,
  //            activo: this.activo}
  //   });


  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`The dialog was closed  ${result}`);
  //   });
  // }

  // openDialogMod(element: any): void {

  //   const dialogRef = this.dialog.open(EmpleadoEdicionComponent, {
  //     width: '500px',
  //     maxHeight: '600px',
  //     data: {idEmpleado: element.idEmpleado,
  //            dni: element.dni,
  //            nombres: element.nombres,
  //            apellidoPaterno: element.apellidoPaterno,
  //            apellidoMaterno: element.apellidoMaterno,
  //            telefono: element.telefono,
  //            email: element.email,
  //            fechaIngreso: element.fechaIngreso,
  //            direccion: element.direccion,
  //            activo: element.activo}
  //   });


  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`The dialog was closed  ${result}`);

  //   });

  // }
}
