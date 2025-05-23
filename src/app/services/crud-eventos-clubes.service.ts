import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/crud-eventos-clubes.model';
import { Observable } from 'rxjs';

export interface ClubCuenta {
  id: number;
  nombre: string;
  facultadDatos: string;
  email: string;
  contrasena: string;
  categoria: string;
  clubActivo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private readonly URL_EVENTOS_JSON = 'http://localhost:3000/clubes';        // Aquí están los EVENTOS
  private readonly URL_CLUBES_JSON = 'http://localhost:3000/clubCuentas';    // Aquí están las CUENTAS DE CLUBES

  constructor(private http: HttpClient) {}

  // ✅ Obtener todos los eventos (guardados en 'clubes')
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.URL_EVENTOS_JSON);
  }

  // ✅ Crear nuevo evento
  agregarEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.URL_EVENTOS_JSON, evento);
  }

  // ✅ Editar evento existente
  actualizarEvento(eventoActualizado: Evento): Observable<Evento> {
    const url = `${this.URL_EVENTOS_JSON}/${eventoActualizado.id}`;
    return this.http.put<Evento>(url, eventoActualizado);
  }

  // ✅ Eliminar evento
  eliminarEvento(id: number): Observable<void> {
    const url = `${this.URL_EVENTOS_JSON}/${id}`;
    return this.http.delete<void>(url);
  }

  // ✅ Obtener lista de cuentas de clubes (para extraer nombre del club logueado)
  obtenerClubes(): Observable<ClubCuenta[]> {
    return this.http.get<ClubCuenta[]>(this.URL_CLUBES_JSON);
  }
}