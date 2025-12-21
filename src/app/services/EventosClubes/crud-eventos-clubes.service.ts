import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Club, EventoClub } from '../../models/eventoClub';

@Injectable({ providedIn: 'root' })

export class ServEventosClubesService {
  private readonly URL_BASE = 'http://localhost:3000';
  private readonly URL_EVENTOS_CLUBES = `${this.URL_BASE}/eventosClubes`;      // Ruta específica para eventos
  private readonly URL_CLUBES = `${this.URL_BASE}/clubes`;   // Ruta para cuentas de clubes

  constructor( private http: HttpClient ) {}

  // Operaciones CRUD para Eventos
  obtenerEventos(): Observable<EventoClub[]> {
    return this.http.get<EventoClub[]>(this.URL_EVENTOS_CLUBES).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerEventoPorId(id: number): Observable<EventoClub> {
    return this.http.get<EventoClub>(`${this.URL_EVENTOS_CLUBES}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  agregarEvento(evento: EventoClub): Observable<EventoClub> {
    return this.http.post<EventoClub>(this.URL_EVENTOS_CLUBES, evento).pipe(
      catchError(this.manejarError)
    );
  }

  actualizarEvento(evento: EventoClub): Observable<EventoClub> {
    if (!evento.id) {
      return throwError(() => new Error('El evento no tiene ID'));
    }
    return this.http.put<EventoClub>(`${this.URL_EVENTOS_CLUBES}/${evento.id}`, evento).pipe(
      catchError(this.manejarError)
    );
  }

  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_EVENTOS_CLUBES}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  // Operaciones para Clubes
  obtenerClubes(): Observable<Club[]> {
    return this.http.get<Club[]>(this.URL_CLUBES).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerCategoriasDesdeEventos(): Observable<string[]> {
    return this.http.get<EventoClub[]>(this.URL_EVENTOS_CLUBES).pipe(
      map((eventos: EventoClub[]) => {
        const categorias = eventos.map(evento => evento.categoria);
        return [...new Set(categorias)].sort();
      }),
      catchError(this.manejarError)
    );
  }

  // Manejo centralizado de errores
  private manejarError(error: any): Observable<never> {
    console.error('Error en el servicio:', error);
    return throwError(() => new Error('Error al realizar la operación. Por favor intente nuevamente.'));
  }
}
