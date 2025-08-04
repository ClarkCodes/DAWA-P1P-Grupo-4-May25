export interface Comentario {
  id: number;
  idCuenta: number;
  idTipoEvento: number;
  idEvento: number;
  calificacion: number;
  mensaje: string;
  fechaComentado: string;
}

export interface ComentarioAccountData {
  idCuenta: number;
  nombre: string;
  fotoPerfilUrl: string;
}
