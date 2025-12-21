export interface Cuenta {
  id: number;
  nombre: string;
  email: string;
  password: string;
  idRol: string;
  datosEstudiante: {
    apellidos: string;
    cedula: string;
    telefono: string;
    fechaNacimiento: string;
  },
  idFacultad: string;
  idClub: string;
  fotoPerfilUrl: string;
  estadoActivo: boolean;
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
}
