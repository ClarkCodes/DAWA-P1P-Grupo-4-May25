import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacultadDatos } from '../../models/facultadDatos';

@Injectable({
  providedIn: 'root'
})
export class ServFacultadDatosService {

   private jsonFacultadDatosUrl: string = 'http://localhost:3000/facultadDatos'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

}
