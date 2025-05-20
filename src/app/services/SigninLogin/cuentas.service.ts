import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuentas } from '../../models/cuentas';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {

  private jsonCuentasUrl: string = 'http://localhost:3000/Cuentas'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  }
  getCuentas(): Observable<Cuentas[]>{
      return this.http.get<Cuentas[]>( this.jsonCuentasUrl );
    }
    addCuentas( cuenta: Cuentas ): Observable<Cuentas>{
      return this.http.post<Cuentas>( this.jsonCuentasUrl, cuenta );
    }
  
    editCuentas( cuenta: Cuentas ): Observable<Cuentas>{
      const cuentaUrl = `${this.jsonCuentasUrl}/${cuenta.id}`;
      return this.http.put<Cuentas>( cuentaUrl, cuenta );
    }
  
    deleteCuentas( cuenta: Cuentas ):Observable<void>{
      const cuentaUrl = `${this.jsonCuentasUrl}/${cuenta.id}`;
      return this.http.delete<void>( cuentaUrl );
    }

     login(email: string, password: string): Observable<Cuentas> {
    return this.http.get<Cuentas[]>(this.jsonCuentasUrl).pipe(
      map((cuentas) => {
        const usuario = cuentas.find(u => u.email === email && u.password === password);
        if (!usuario) {
          throw new Error('Credenciales inválidas');
        }
        return usuario;
      })
    );
  }
}
