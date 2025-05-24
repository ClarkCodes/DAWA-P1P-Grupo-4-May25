import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../models/crud-eventos-clubes.model';

// Interface for Club Accounts
export interface ClubCuenta {
  id: number;
  nombre: string;
  facultadDatos: string;
  correoElectronico: string;
  contrasena: string;
  categoria: string; // Category of the club itself (e.g., "Académico", "Cultural")
  clubActivo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  // Correct URLs as per your setup and comments in previous versions
  private readonly URL_EVENTOS_JSON = 'http://localhost:3000/clubes';       // Aquí están los EVENTOS DE LOS CLUBES
  private readonly URL_CLUBES_JSON = 'http://localhost:3000/clubCuentas';   // Aquí están las CUENTAS DE CLUBES

  constructor(private http: HttpClient) {}

  // Eventos CRUD methods
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.URL_EVENTOS_JSON);
  }

  obtenerEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.URL_EVENTOS_JSON}/${id}`);
  }

  agregarEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.URL_EVENTOS_JSON, evento);
  }

  actualizarEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.URL_EVENTOS_JSON}/${evento.id}`, evento);
  }

  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_EVENTOS_JSON}/${id}`);
  }

  // Club Cuentas methods
  obtenerClubes(): Observable<ClubCuenta[]> {
    return this.http.get<ClubCuenta[]>(this.URL_CLUBES_JSON);
  }

  // Method to get unique categories specifically from the EVENTS collection ('clubes')
  obtenerCategoriasDesdeEventos(): Observable<string[]> {
    return this.http.get<Evento[]>(this.URL_EVENTOS_JSON).pipe(
      map((eventos: Evento[]) => {
        const categorias = eventos.map(evento => evento.categoria);
        return [...new Set(categorias)].sort(); // Ensure unique and sorted categories
      })
    );
  }
}