import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AsistenciaEvento } from '../../models/asistenciaEvento';

@Injectable({ providedIn: 'root' })
export class ServAsistenciaEventosService {
  private jsonAsistenciaEventosUrl: string = 'http://localhost:3000/asistenciaEventos';

  constructor( private http: HttpClient ) {}

  getAsistencias(): Observable<AsistenciaEvento[]> {
    return this.http.get<AsistenciaEvento[]>( this.jsonAsistenciaEventosUrl );
  }

  getAsistenciasOfCuentaId( idCuenta: number ): Observable<AsistenciaEvento[]> {
    return this.http.get<AsistenciaEvento[]>( `${this.jsonAsistenciaEventosUrl}?idCuenta=${idCuenta}` );
  }

  /* getEstudiantesSearch(
    estudianteNombre?: string,
    telefono?: string,
  ): Observable<AsistenciaEvento[]> {
    return this.http.get<AsistenciaEvento[]>(this.jsonAsistenciaEventosUrl ).pipe(
      map( comentarios =>
        comentarios.filter(comentario =>
          (estudianteNombre ? comentario.estudianteNombre.toLowerCase().includes(estudianteNombre.toLowerCase()) : true) &&
          (telefono ? comentario.nombreEvento.toLowerCase().includes(telefono.toLowerCase()) : true)
        )
      )
    );
  }
 */
  agregarAsistencia( asistencia: AsistenciaEvento ): Observable<AsistenciaEvento> {
    return this.http.post<AsistenciaEvento>( this.jsonAsistenciaEventosUrl, asistencia );
  }

  eliminarAsistencia( idAsistencia: number ): Observable<void> {
    const urlAsistencia = `${this.jsonAsistenciaEventosUrl}/${idAsistencia}`;
    return this.http.delete<void>( urlAsistencia );
  }
}
