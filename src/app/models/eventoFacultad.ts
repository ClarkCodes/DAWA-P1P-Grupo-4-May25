export interface EventoFacultad {
  id: string;
  nombre: string;
  descripcion: {
      descripcionCorta: string;
      descripcionDetalles: string;
  };
  area: string;
  categoriaId: string;
  facultadId: string;
  organizadorExterno: string;
  variosDias: boolean;
  fechaHora: string;
  fechaHasta: string;
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
  id: string;
  nombre: string;
}

export interface Facultad {
  nombre: string;
  id: string;
}
