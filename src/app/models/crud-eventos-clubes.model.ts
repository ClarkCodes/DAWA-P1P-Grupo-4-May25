export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  esGratuito: boolean;
  costo?: number;
  lugar: string;
  nombreClub: string; 
  aficheUrl?: string;
  etiquetas?: string[];
}