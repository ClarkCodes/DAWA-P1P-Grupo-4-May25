export interface FacultadCuentas {
  id: number;
  facultadDatos: string;
  siglas: string;
  email: string;
  contrasena: string;
  modalidad: 'Presencial' | 'Virtual' | 'Híbrido';
}
