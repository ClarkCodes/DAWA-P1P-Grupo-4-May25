import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaDatos } from '../../models/categoriaDatos';

@Injectable({
  providedIn: 'root'
})
export class ServCategoriaDatosService {

 private jsonCategoriaDatosUrl: string = 'http://localhost:3000/categoriaDatos'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

}
