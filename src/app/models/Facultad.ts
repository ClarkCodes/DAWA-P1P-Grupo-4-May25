export interface Facultad {
  id: number;
  nombre: string;
  direccion: string;
  horarioAtencion: {
    diaDesde: string;
    diaHasta: string;
    horaDesde: string;
    horaHasta: string;
  }[];
  sitioWeb: string;
  telefono: string;
}
