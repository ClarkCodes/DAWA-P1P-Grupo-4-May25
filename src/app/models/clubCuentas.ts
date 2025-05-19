export interface ClubCuentas {
  id: number;
  Nombre: string;
  facultadDatos: string;
  email: string;
  contrasena: string;
  categoria: string;
  clubActivo: 'Activo' | 'No Activo';
}
