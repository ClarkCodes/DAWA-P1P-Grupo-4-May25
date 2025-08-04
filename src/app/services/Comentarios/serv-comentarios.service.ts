import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Comentario, ComentarioAccountData } from '../../models/comentario';
import { CuentasService } from '../SignupLogin/cuentas.service';
import { Cuenta } from '../../models/cuenta';

@Injectable({ providedIn: 'root' })

export class ServComentariosService {
  cuentasService = inject( CuentasService );
  private jsonComentariosUrl: string = 'http://localhost:3000/comentarios';

  constructor( private http: HttpClient ) {} // Inyeccion de HTTP Client

  getComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>( this.jsonComentariosUrl );
  }

  getComentariosOfEvento( idTipoEvento: number, idEvento: number ): Observable<Comentario[]> {
    return this.http.get<Comentario[]>( `${this.jsonComentariosUrl}?idTipoEvento=${idTipoEvento}&idEvento=${idEvento}` );
  }

  getUsuarioLogueadoComentarioAccountData(): ComentarioAccountData | undefined {
    this.cuentasService.usuarioLogueado$.subscribe( ( usuarioLogueado: Cuenta | null ) => {
      if( usuarioLogueado ) {
        return {
          idCuenta: usuarioLogueado.id,
          nombre: usuarioLogueado.nombre,
          fotoPerfilUrl: usuarioLogueado.fotoPerfilUrl
        };
      }

      return;
    });

    return;
  }

  getComentariosSearch(
    idCuenta?: string,
    idEvento?: string,
    tipoEvento?: string,
    calificacion?: string,
    mensaje?: string,
    fechaComentado?: string
  ): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.jsonComentariosUrl).pipe(
      /*map(comentarios =>
        comentarios.filter( comentario =>
          ( idCuenta ? comentario.idCuenta.toLowerCase().includes( idCuenta.toLowerCase()) : true) &&
          ( idEvento ? comentario.idEvento.toLowerCase().includes( idEvento.toLowerCase()) : true) &&
          ( calificacion ? comentario.calificacion.toString().toLowerCase().includes( calificacion.toLowerCase()) : true) &&
          ( mensaje ? comentario.mensaje.toLowerCase().includes(mensaje.toLowerCase()) : true) &&
          ( fechaComentado ? comentario.fechaComentado.toLowerCase().includes( fechaComentado.toLowerCase()) : true)
        )
      )*/
    );
  }

  agregarComentario( comentario: Comentario ): Observable<Comentario> {
    return this.http.post<Comentario>( this.jsonComentariosUrl, comentario );
  }

  actualizarComentario( comentarioId: number, comentarioActualizado: Partial<Comentario> ): Observable<Comentario> {
    const urlActualizarComentario = `${this.jsonComentariosUrl}/${comentarioId}`;
    return this.http.patch<Comentario>( urlActualizarComentario, comentarioActualizado );
  }

  eliminarComentario( comentarioId: number ): Observable<void> { // Lo cambiaria solo con el Id del comentario como parametro
    const urlEliminarComentario = `${this.jsonComentariosUrl}/${comentarioId}`;
    return this.http.delete<void>( urlEliminarComentario );
  }
}
