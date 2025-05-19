export interface EstudianteCuentas {
  id: number;
  primerNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  contrasena: string;
  sexo: 'Masculino' | 'Femenino'
  facultadDatos: string;
}
