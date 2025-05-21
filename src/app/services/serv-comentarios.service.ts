import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Comentario } from '../models/comentarios';

@Injectable({
  providedIn: 'root'
})

export class ServComentariosService {
    private jsoncomentariosUrl: string = 'http://localhost:3000/comentarios';
    
    constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
    }


  getComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>( this.jsoncomentariosUrl)
  }

  getComentariosSearch(
  estudianteNombre?: string,
  nombreEvento?: string,
  experiencia?: string,
  mensaje?: string,
  fecha?: string,
  aceptoTerminos?: boolean
): Observable<Comentario[]> {
  return this.http.get<Comentario[]>(this.jsoncomentariosUrl).pipe(
    map(comentarios =>
      comentarios.filter(comentario =>
        (estudianteNombre ? comentario.estudianteNombre.toLowerCase().includes(estudianteNombre.toLowerCase()) : true) &&
        (nombreEvento ? comentario.nombreEvento.toLowerCase().includes(nombreEvento.toLowerCase()) : true) &&
        (experiencia ? comentario.experiencia.toString().toLowerCase().includes(experiencia.toLowerCase()) : true) &&
        (mensaje ? comentario.mensaje.toLowerCase().includes(mensaje.toLowerCase()) : true) &&
        (fecha ? comentario.fecha.toLowerCase().includes(fecha.toLowerCase()) : true) &&
        (aceptoTerminos !== undefined ? comentario.aceptoTerminos === aceptoTerminos : true)
      )
    )
  );
}

  agregarComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(this.jsoncomentariosUrl, comentario);
  }

  actualizarComentario(comentario: Comentario): Observable<Comentario> {
    const url = `${this.jsoncomentariosUrl}/${comentario.id}`;
    return this.http.put<Comentario>(url, comentario);
  }

  eliminarComentario(comentario: Comentario): Observable<void> {
  const url = `${this.jsoncomentariosUrl}/${comentario.id}`;
  return this.http.delete<void>(url);
  }
}