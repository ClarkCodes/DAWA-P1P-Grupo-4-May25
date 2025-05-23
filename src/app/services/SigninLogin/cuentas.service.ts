import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacultadDatos } from '../../models/facultadDatos';

// Decorador que marca la clase como un servicio inyectable, disponible en toda la aplicación
@Injectable({
  providedIn: 'root'
})
export class ServFacultadDatosService {
  // URL del endpoint del JSON Server para los datos de facultades
  private jsonFacultadDatosUrl: string = 'http://localhost:3000/facultadDatos';

  // Constructor que inyecta el módulo HttpClient para realizar peticiones HTTP
  constructor(private http: HttpClient) {}

  // Método para obtener los datos de facultades desde el endpoint
  getFacultadDatos(): Observable<FacultadDatos[]> {
    return this.http.get<FacultadDatos[]>(this.jsonFacultadDatosUrl);
  }
}