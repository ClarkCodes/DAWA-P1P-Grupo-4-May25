export interface AsistenciaEvento {
  id: number,
  idCuenta: number;
  idTipoEvento: number;
  idEvento: number;
  fechaInscripcion: string;
}

export interface TipoEvento {
  id: number;
  tipoEvento: string;
}
