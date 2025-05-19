import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstudianteCuentas } from '../../models/estudianteCuentas';

@Injectable({
  providedIn: 'root'
})
export class ServEstudianteCuentasService {

 private jsonEstudianteCuentasUrl: string = 'http://localhost:3000/estudianteCuentas'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }
}
