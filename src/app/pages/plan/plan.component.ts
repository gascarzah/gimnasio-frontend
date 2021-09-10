import { PlanEdicionComponent } from './plan-edicion/plan-edicion.component';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from './../util/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { Plan } from './../../_model/plan';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PlanService } from './../../_service/plan.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  nombre: string
  dias: number
  precio: number
  dataSource: MatTableDataSource<Plan>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;
  displayedColumns = ['nombre', 'dias', 'precio', 'acciones']

  constructor(private planService: PlanService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.planService.getPlanCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.planService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.planService.listarPageable(0, 5).subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

  }

  crearTabla(data: Plan[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }



  mostrarMas(e: any){

    this.planService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
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
        this.planService.eliminar(id).pipe(switchMap(() => {
      return this.planService.listar();
    })).subscribe(data => {
      this.planService.setPlanCambio(data);
      this.planService.setMensajeCambio('SE ELIMINO');
    });
      }
    });

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(PlanEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {
             nombre: this.nombre,
             dias: this.dias,
             precio: this.precio
            }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(PlanEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {
            idPlan: element.idPlan,
            nombre: element.nombre,
            dias: element.dias,
            precio: element.precio
          }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }

}
