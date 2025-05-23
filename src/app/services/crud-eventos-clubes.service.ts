import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/crud-eventos-clubes.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private eventos: Evento[] = [];
  private eventosSubject = new BehaviorSubject<Evento[]>([]);
  private readonly URL_JSON = '/json/eventos.json';

  constructor(private http: HttpClient) {
    this.cargarEventosDesdeJSON();
  }

  private cargarEventosDesdeJSON(): void {
    this.http.get<Evento[]>(this.URL_JSON).subscribe(data => {
      this.eventos = data;
      this.eventosSubject.next(this.eventos);
    });
  }

  getEventos(): Observable<Evento[]> {
    return this.eventosSubject.asObservable();
  }

  agregarEvento(evento: Evento): void {
    this.eventos.push(evento);
    this.eventosSubject.next([...this.eventos]);
  }

  actualizarEvento(eventoActualizado: Evento): void {
    const index = this.eventos.findIndex(e => e.id === eventoActualizado.id);
    if (index !== -1) {
      this.eventos[index] = eventoActualizado;
      this.eventosSubject.next([...this.eventos]);
    }
  }

  eliminarEvento(id: number): void {
    this.eventos = this.eventos.filter(e => e.id !== id);
    this.eventosSubject.next([...this.eventos]);
  }
}