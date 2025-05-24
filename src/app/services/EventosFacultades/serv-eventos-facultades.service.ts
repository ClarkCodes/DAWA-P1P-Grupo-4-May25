import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EventoFacultad, EventosFacultadCategoria, EventosFacultadTopId, Facultad } from '../../models/eventoFacultad';

@Injectable({
  providedIn: 'root'
})

export class ServEventosFacultadesService {

  private jsonEventosFacultadUrl: string = 'http://localhost:3000/eventosFacultad'; // Url del Endpoint de Eventos de Facultad del Json Server
  private jsonEventosFacultadTopIdUrl: string = 'http://localhost:3000/eventosFacultadTopId'; // Url del Endpoint de Facultades del Json Server
  private jsonEventosFacultadCategoriaUrl: string = 'http://localhost:3000/eventosFacultadCategoria'; // Url del Endpoint de Categorias de Eventos de Facultad del Json Server
  private jsonFacultadesUrl: string = 'http://localhost:3000/facultadDatos'; // Url del Endpoint de Facultades del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

  getEventosFacultades(): Observable<EventoFacultad[]>{
    return this.http.get<EventoFacultad[]>( this.jsonEventosFacultadUrl );
  }

  getEventosFacultadTopId(): Observable<EventosFacultadTopId>{
    return this.http.get<EventosFacultadTopId>( this.jsonEventosFacultadTopIdUrl );
  }

  getCategorias(): Observable<EventosFacultadCategoria[]>{
    return this.http.get<EventosFacultadCategoria[]>( this.jsonEventosFacultadCategoriaUrl );
  }

  getFacultades(): Observable<Facultad[]>{
    return this.http.get<Facultad[]>( this.jsonFacultadesUrl );
  }

  getSearchOnEventosFacultades( searchToken: string ): Observable<EventoFacultad[]>{
    return this.http.get<EventoFacultad[]>( this.jsonEventosFacultadUrl ).pipe(
      map( eventosFacultad =>
        eventosFacultad.filter( evento =>
          evento.nombre.toLowerCase().includes( searchToken ) ||
          evento.categoriaId === this.getCategoriaIdByName( searchToken ) ||
          evento.facultadId === this.getFacultadIdByName( searchToken ) ||
          evento.organizadorExterno.toLowerCase().includes( searchToken ) ||
          evento.area.toLowerCase().includes( searchToken ) ||
          evento.direccion.toLowerCase().includes( searchToken ) ||
          evento.lugar.toLowerCase().includes( searchToken ) ||
          evento.sitioWeb.toLowerCase().includes( searchToken ) ||
          evento.telefonoContacto.toLowerCase().includes( searchToken ) ||
          evento.etiquetas.find( etiqueta => etiqueta.includes( searchToken ) )
        )
      )
    );
  }

  getFacultadIdByName( nombreFacultad: string ) : string {
    const facultad = this.http.get<Facultad[]>( this.jsonFacultadesUrl ).pipe(
      map( facultades =>
        facultades.find( facultad =>
          facultad.nombre.toLowerCase().includes( nombreFacultad.toLocaleLowerCase() )
        )
      )
    ) as unknown as Facultad;

    return facultad ? facultad.id : "";
  }

  getCategoriaIdByName( nombreCategoria: string ): number {
    const categoria = this.http.get<EventosFacultadCategoria[]>( this.jsonEventosFacultadCategoriaUrl ).pipe(
      map( eventosFacultadCategorias =>
        eventosFacultadCategorias.find( categoria =>
          categoria.nombre.toLowerCase().includes( nombreCategoria.toLocaleLowerCase() )
        )
      )
    ) as unknown as EventosFacultadCategoria;

    return categoria ? categoria.id : 0;
  }

  getCategoriaById( id: number ): Observable<EventosFacultadCategoria[]> {
    return this.http.get<EventosFacultadCategoria[]>( this.jsonEventosFacultadCategoriaUrl ).pipe(
      map( eventosFacultadCategoria =>
        eventosFacultadCategoria.filter( categoria => categoria.id === id )
      )
    );
  }

  getFacultadById( id: string ): string {
    const facultad = this.http.get<Facultad[]>( this.jsonFacultadesUrl ).pipe(
      map( facultades =>
        facultades.find( facultad =>
          ( id ? facultad.id === id : true )
        )
      )
    ) as unknown as Facultad;

    return facultad ? facultad.nombre : "";
  }

  addEventoFacultad( eventoFacultad: EventoFacultad ): Observable<EventoFacultad>{
    return this.http.post<EventoFacultad>( this.jsonEventosFacultadUrl, eventoFacultad );
  }

  editEventoFacultad( eventoFacultad: EventoFacultad ): Observable<EventoFacultad> {
    const eventoFacultadUrl = `${this.jsonEventosFacultadUrl}/${eventoFacultad.id}`;
    return this.http.put<EventoFacultad>( eventoFacultadUrl, eventoFacultad );
  }

  deleteEventoFacultad( eventoFacultad: EventoFacultad ):Observable<void>{
    const eventoFacultadUrl = `${this.jsonEventosFacultadUrl}/${eventoFacultad.id}`;
    return this.http.delete<void>( eventoFacultadUrl );
  }

  upodateEventosFacultadTopId( eventosFacultadTopId: EventosFacultadTopId ): void{
    this.http.patch<EventosFacultadTopId>( this.jsonEventosFacultadTopIdUrl, eventosFacultadTopId );
  }
}
