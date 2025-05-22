import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Estudiantes } from '../models/estudiantes';

@Injectable({
  providedIn: 'root'
})

export class ServEstudiantesService {
    private jsonestudianteUrl: string = 'http://localhost:3000/estudiantes';
    constructor( private http: HttpClient ) { 
    }

  getEstudiantes(): Observable<Estudiantes[]> {
    return this.http.get<Estudiantes[]>( this.jsonestudianteUrl)
  }

  getEstudiantesSearch(
  estudianteNombre?: string,
  telefono?: string,
): Observable<Estudiantes[]> {
  return this.http.get<Estudiantes[]>(this.jsonestudianteUrl).pipe(
    map(comentarios =>
      comentarios.filter(comentario =>
        (estudianteNombre ? comentario.estudianteNombre.toLowerCase().includes(estudianteNombre.toLowerCase()) : true) &&
        (telefono ? comentario.nombreEvento.toLowerCase().includes(telefono.toLowerCase()) : true) 
      )
    )
  );
}

  agregarEstudiantes(estudiante: Estudiantes): Observable<Estudiantes> {
    return this.http.post<Estudiantes>(this.jsonestudianteUrl, estudiante);
  }

  actualizarEstudiantes(estudiante: Estudiantes): Observable<Estudiantes> {
    const url = `${this.jsonestudianteUrl}/${estudiante.id}`;
    return this.http.put<Estudiantes>(url, estudiante);
  }

  eliminarEstudiantes(estudiante: Estudiantes): Observable<void> {
  const url = `${this.jsonestudianteUrl}/${estudiante.id}`;
  return this.http.delete<void>(url);
  }
}