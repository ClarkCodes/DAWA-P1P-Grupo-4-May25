import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Facultad } from '../models/Facultad';

@Injectable({
  providedIn: 'root'
})

export class ServFacultadesService {
  private jsonFacultadesUrl: string = 'http://localhost:3000/facultades'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

  getFacultades(): Observable<Facultad[]>{
    return this.http.get<Facultad[]>( this.jsonFacultadesUrl );
  }

  getFacultadesSearch( nombre?:string, direccion?: string, sitioWeb?: string, telefono?: string ): Observable<Facultad[]>{
    return this.http.get<Facultad[]>( this.jsonFacultadesUrl ).pipe(
      map( facultades =>
        facultades.filter( facultad =>
          ( nombre ? facultad.nombre.toLowerCase().includes( nombre.toLocaleLowerCase() ) : true ) &&
          ( direccion ? facultad.direccion.toLowerCase().includes( direccion!.toLocaleLowerCase() ) : true ) &&
          ( sitioWeb ? facultad.sitioWeb.toLowerCase().includes( sitioWeb!.toLocaleLowerCase() ) : true ) &&
          ( telefono ? facultad.telefono.toLowerCase().includes( telefono!.toLocaleLowerCase() ) : true )
         )
      )
    );
  }

  addFacultad( facultad: Facultad ): Observable<Facultad>{
    return this.http.post<Facultad>( this.jsonFacultadesUrl, facultad );
  }

  editFacultad( facultad: Facultad ): Observable<Facultad>{
    const facultadUrl = `${this.jsonFacultadesUrl}/${facultad.id}`;
    return this.http.put<Facultad>( facultadUrl, facultad );
  }

  deleteFacultad( facultad: Facultad ):Observable<void>{
    const facultadUrl = `${this.jsonFacultadesUrl}/${facultad.id}`;
    return this.http.delete<void>( facultadUrl );
  }
}
