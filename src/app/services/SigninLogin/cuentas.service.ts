// src/app/services/SigninLogin/cuentas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cuentas } from '../../models/cuentas';
import { CreateCuentas } from '../../models/createCuentas';
import { FacultadDatos } from '../../models/facultadDatos';
import { RolDatos } from '../../models/rolDatos';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private apiCuentasUrl: string = 'http://localhost:5214/api/Cuentas';

  constructor(private http: HttpClient) {}

  getCuentas(): Observable<Cuentas[]> {
    return this.http.get<Cuentas[]>(this.apiCuentasUrl).pipe(
      catchError(error => {
        console.error('Error al obtener cuentas:', error);
        return throwError(() => new Error(error.error || 'No se pudo obtener la lista de cuentas.'));
      })
    );
  }

  getFacultades(): Observable<FacultadDatos[]> {
    return this.http.get<FacultadDatos[]>(`${this.apiCuentasUrl}/facultades`).pipe(
      catchError(error => {
        console.error('Error al obtener facultades:', error);
        return throwError(() => new Error(error.error || 'No se pudo obtener la lista de facultades.'));
      })
    );
  }

  getRoles(): Observable<RolDatos[]> {
    return this.http.get<RolDatos[]>(`${this.apiCuentasUrl}/roles`).pipe(
      catchError(error => {
        console.error('Error al obtener roles:', error);
        return throwError(() => new Error(error.error || 'No se pudo obtener la lista de roles.'));
      })
    );
  }

  addCuentas(cuenta: CreateCuentas): Observable<Cuentas> {
    return this.http.post<Cuentas>(this.apiCuentasUrl, cuenta).pipe(
      catchError(error => {
        console.error('Error al crear cuenta:', error);
        return throwError(() => new Error(error.error || 'No se pudo crear la cuenta.'));
      })
    );
  }

editCuentas(id: number, cuenta: Partial<Cuentas>): Observable<void> {
    const cuentaDto = {
      nombre: cuenta.nombre,
      email: cuenta.email,
      password: cuenta.password,
      facultadId: cuenta.facultadId,
      rolId: cuenta.rolId
    };
    return this.http.put<void>(`${this.apiCuentasUrl}/${id}`, cuentaDto);
  }

  deleteCuentas(id: number): Observable<void> {
    const cuentaUrl = `${this.apiCuentasUrl}/${id}`;
    return this.http.delete<void>(cuentaUrl).pipe(
      catchError(error => {
        console.error('Error al eliminar cuenta:', error);
        return throwError(() => new Error(error.error || 'No se pudo eliminar la cuenta.'));
      })
    );
  }

  login(email: string, password: string): Observable<Cuentas> {
    return this.http.post<Cuentas>(`${this.apiCuentasUrl}/login`, { email, password }).pipe(
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error.error || 'Credenciales inválidas'));
      })
    );
  }
}