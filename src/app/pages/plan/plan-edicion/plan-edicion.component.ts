import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanService } from './../../../_service/plan.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Plan } from './../../../_model/plan';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-plan-edicion',
  templateUrl: './plan-edicion.component.html',
  styleUrls: ['./plan-edicion.component.css']
})
export class PlanEdicionComponent implements OnInit {

  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;


  constructor(
    public dialogRef: MatDialogRef<PlanEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Plan,
    protected planService: PlanService,
    private snackBar: MatSnackBar,
    // private fileService :FileService
    ) {

      if(this.data.idPlan == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idPlan == undefined){
        this.planService.registrar(this.data).pipe(switchMap(() => {
        return this.planService.listar();
      })).subscribe(data => {
        this.planService.planCambio.next(data);
        this.planService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.planService.modificar(this.data).subscribe(() => {
          this.planService.listar().subscribe(data => {
            this.planService.setPlanCambio(data);
            this.planService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
    }
  }

  validacion(data: Plan){

    if(!data.nombre){
      this.mensaje = `Debe agregar un nombre`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }else if(!data.dias){
      this.mensaje = `Ingresar dias`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }else if(!data.precio){
      this.mensaje = `Ingresar el precio`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }

    return true

  }

  ngOnInit(): void {

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


