import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../models/crud-eventos-clubes.model';

export interface ClubCuenta {
  id: number;
  nombre: string;
  facultadDatos: string;
  correoElectronico: string;
  contrasena: string;
  categoria: string; 
  clubActivo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private readonly URL_BASE = 'http://localhost:3000';
  private readonly URL_EVENTOS = `${this.URL_BASE}/clubes`;      // Ruta específica para eventos
  private readonly URL_CLUBES = `${this.URL_BASE}/clubCuentas`;   // Ruta para cuentas de clubes

  constructor(private http: HttpClient) {}

  // Operaciones CRUD para Eventos
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.URL_EVENTOS).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.URL_EVENTOS}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  agregarEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.URL_EVENTOS, evento).pipe(
      catchError(this.manejarError)
    );
  }

  actualizarEvento(evento: Evento): Observable<Evento> {
    if (!evento.id) {
      return throwError(() => new Error('El evento no tiene ID'));
    }
    return this.http.put<Evento>(`${this.URL_EVENTOS}/${evento.id}`, evento).pipe(
      catchError(this.manejarError)
    );
  }

  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_EVENTOS}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  // Operaciones para Clubes
  obtenerClubes(): Observable<ClubCuenta[]> {
    return this.http.get<ClubCuenta[]>(this.URL_CLUBES).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerCategoriasDesdeEventos(): Observable<string[]> {
    return this.http.get<Evento[]>(this.URL_EVENTOS).pipe(
      map((eventos: Evento[]) => {
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