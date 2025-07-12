import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacultadDatos } from '../../models/facultadDatos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServFacultadDatosService {

   private apiFacultadDatosUrl: string = 'http://localhost:5214/api/Facultades'; // Url del Endpoint de productos del Api Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

    getFacultadDatos(): Observable<FacultadDatos[]> {
    return this.http.get<FacultadDatos[]>(this.apiFacultadDatosUrl);
  }
}