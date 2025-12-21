export interface EventoClub {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  esGratuito: boolean;
  costo?: number;
  lugar: string;
  idClub: string;
  aficheUrl?: string;
  etiquetas?: string[];
}

export interface Club {
  id: number;
  nombre: string;
  idFacultad: string;
  categoria: string;
  clubActivo: boolean;
}
