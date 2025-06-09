import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EventoFacultad, EventosFacultadCategoria, Facultad } from '../../models/eventoFacultad';

@Injectable({ providedIn: 'root' })

export class ServEventosFacultadesService {

  private jsonEventosFacultadUrl: string = 'http://localhost:3000/eventosFacultad'; // Url del Endpoint de Eventos de Facultad del Json Server
  private jsonEventosFacultadCategoriasUrl: string = 'http://localhost:3000/eventosFacultadCategoria'; // Url del Endpoint de Categorias de Eventos de Facultad del Json Server
  private jsonFacultadesUrl: string = 'http://localhost:3000/facultadDatos'; // Url del Endpoint de Facultades del Json Server

  constructor( private http: HttpClient ) {} // Inyeccion de HTTP Client

  getEventosFacultades(): Observable<EventoFacultad[]>{
    return this.http.get<EventoFacultad[]>( this.jsonEventosFacultadUrl );
  }

  getCategorias(): Observable<EventosFacultadCategoria[]>{
    return this.http.get<EventosFacultadCategoria[]>( `${this.jsonEventosFacultadCategoriasUrl}?_sort=nombre&_order=asc` );
  }

  getFacultades(): Observable<Facultad[]>{
    return this.http.get<Facultad[]>( `${this.jsonFacultadesUrl}?_sort=nombre&_order=asc` );
  }

  getSearchOnEventosFacultades( searchToken: string ): Observable<EventoFacultad[]>{
    return this.http.get<EventoFacultad[]>( this.jsonEventosFacultadUrl ).pipe(
      map( eventosFacultad =>
        eventosFacultad.filter( evento =>
          evento.nombre.toLowerCase().includes( searchToken ) ||
          this.getCategoriaNameById( evento.categoriaId ).toLowerCase().includes( searchToken ) ||
          this.getFacultadNameById( evento.facultadId ).toLowerCase().includes( searchToken ) ||
          evento.organizadorExterno.toLowerCase().includes( searchToken ) ||
          evento.area.toLowerCase().includes( searchToken ) ||
          evento.direccion.toLowerCase().includes( searchToken ) ||
          evento.lugar.toLowerCase().includes( searchToken ) ||
          evento.sitioWeb.toLowerCase().includes( searchToken ) ||
          evento.telefonoContacto.toLowerCase().includes( searchToken ) ||
          evento.etiquetas.some( etiqueta => etiqueta.toLowerCase().includes( searchToken ) )
        )
      )
    );
  }

  getCategoriaById( id: string ): Observable<EventosFacultadCategoria[]> {
    return this.http.get<EventosFacultadCategoria[]>( `${this.jsonEventosFacultadCategoriasUrl}?id=${id}` );
  }

  getCategoriaNameById( id: string ): string {
    let categoriaName: string = '';
    this.getCategoriaById( id ).subscribe( ( data: EventosFacultadCategoria[] ) => {
      categoriaName = data.at( 0 )?.nombre ?? '';
    });
    //console.log( 'Categoria Name: ' );
    //console.log( categoriaName );
    return categoriaName;
  }

  getFacultadById( id: string ): Observable<Facultad[]> {
    return this.http.get<Facultad[]>( `${this.jsonFacultadesUrl}?id=${id}` );
  }

  getFacultadNameById( id: string ): string {
    let facultadName: string = '';
    this.getFacultadById( id ).subscribe( ( data: Facultad[] ) => {
      facultadName = data.at( 0 )?.nombre ?? '';
    });
    //console.log( 'Facultad Name: ' );
    //console.log( facultadName );
    return facultadName;
  }

  addEventoFacultad( eventoFacultad: EventoFacultad ): Observable<EventoFacultad> {
    return this.http.post<EventoFacultad>( this.jsonEventosFacultadUrl, eventoFacultad );
  }

  editEventoFacultad( eventoFacultad: EventoFacultad ): Observable<EventoFacultad> {
    return this.http.put<EventoFacultad>( `${this.jsonEventosFacultadUrl}/${eventoFacultad.id}`, eventoFacultad );
  }

  deleteEventoFacultad( eventoFacultad: EventoFacultad ):Observable<void> {
    return this.http.delete<void>( `${this.jsonEventosFacultadUrl}/${eventoFacultad.id}` );
  }
}
