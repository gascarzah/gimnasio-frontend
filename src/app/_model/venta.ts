import { Producto } from './producto';
import { Plan } from './plan';

import { Cliente } from "./cliente"
import { TipoRecibo } from './tipo-recibo';

 export class Venta{

  idVenta: number
  numVenta: string
  cliente: Cliente
  tipoRecibo: TipoRecibo
  plan: Plan
  producto: Producto[]
  total: number
  efectivo: number
  visa: number
  mastercard: number
}
