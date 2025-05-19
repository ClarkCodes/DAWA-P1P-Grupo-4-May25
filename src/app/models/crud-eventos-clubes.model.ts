export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  esGratuito: boolean;
  costo?: number;
  cupoMaximo: number;
  lugar: string;
  nombreClub: string; 
  aficheUrl?: string;
  etiquetas?: string[];
}