export interface Cuentas {
  id: number;
  nombre: string;
  email: string;
  password: string;
  facultad: string;
  rol: 'ESTUDIANTE' | 'FACULTAD' | 'CLUB';
}
