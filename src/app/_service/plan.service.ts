import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Plan } from './../_model/plan';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanService  extends GenericService<Plan>{

  planCambio = new Subject<Plan[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/planes`);
 }

 listarPageable(p: number, s:number){
   return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
 }

 /* get, set */
 setMensajeCambio(mensaje: string){
   this.mensajeCambio.next(mensaje);
 }

 getMensajeCambio(){
   return this.mensajeCambio.asObservable();
 }

 setPlanCambio(lista: Plan[]){
   this.planCambio.next(lista);
 }

 getPlanCambio(){
   return this.planCambio.asObservable();
 }


}
