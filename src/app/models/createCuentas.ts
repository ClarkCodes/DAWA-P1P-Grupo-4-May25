import { FacultadDatos } from "./facultadDatos";
import { RolDatos } from "./rolDatos";
import { Cuentas } from "./cuentas";

export interface CreateCuentas {
  id: number;
  nombre: string;
  email: string;
  password: string;
  facultadId: string;
  rolId: string;
}
