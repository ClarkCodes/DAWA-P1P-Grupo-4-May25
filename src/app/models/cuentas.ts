export interface Cuentas {
  id: number;
  nombre: string;
  email: string;
  password: string;
  facultad: string;
  rol: 'estudiante' | 'facultad' | 'club';
}
