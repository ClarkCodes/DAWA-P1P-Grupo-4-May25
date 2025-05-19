import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacultadCuentas } from '../../models/facultadCuentas';

@Injectable({
  providedIn: 'root'
})
export class ServFacultadCuentasService {

   private jsonFacultadCuentasUrl: string = 'http://localhost:3000/facultadCuentas'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

}
