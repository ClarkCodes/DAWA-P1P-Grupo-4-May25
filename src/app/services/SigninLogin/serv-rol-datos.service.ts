import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RolDatos } from '../../models/rolDatos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServRolDatosService {

   private apiRolDatosUrl: string = 'http://localhost:5214/api/Roles'; // Url del Endpoint de productos del Api Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }

    getRolDatos(): Observable<RolDatos[]> {
    return this.http.get<RolDatos[]>(this.apiRolDatosUrl);
  }
}