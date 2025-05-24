export interface EventoFacultad {
  id: number;
  nombre: string;
  categoriaId: number;
  facultadId: string;
  organizadorExterno: string;
  descripcion: {
      descripcionCorta: string;
      descripcionDetalles: string;
  };
  area: string;
  variosDias: boolean;
  fecha: string;
  fechaHasta: string;
  hora: string;
  esGratuito: boolean;
  costo: number;
  direccion: string;
  lugar: string;
  aficheUrl: string;
  sitioWeb: string;
  telefonoContacto: string;
  etiquetas: string[];
}

export interface EventosFacultadCategoria {
  id: number;
  nombre: string;
}

export interface Facultad {
  nombre: string;
  id: string;
}

export interface EventosFacultadTopId {
  topId: number;
}
