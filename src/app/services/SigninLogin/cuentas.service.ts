import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cuentas } from '../../models/cuentas';

// Decorador que marca la clase como un servicio inyectable, disponible en el ámbito raíz
@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  // URL del endpoint para el JSON Server
  private jsonCuentasUrl: string = 'http://localhost:3000/Cuentas';

  // Inyección del servicio HttpClient para realizar peticiones HTTP
  constructor(private http: HttpClient) {}

  // Obtiene la lista de cuentas desde el servidor
  getCuentas(): Observable<Cuentas[]> {
    return this.http.get<Cuentas[]>(this.jsonCuentasUrl);
  }

  // Agrega una nueva cuenta al servidor
  addCuentas(cuenta: Cuentas): Observable<Cuentas> {
    return this.http.post<Cuentas>(this.jsonCuentasUrl, cuenta);
  }

  // Actualiza una cuenta existente en el servidor
  editCuentas(cuenta: Cuentas): Observable<Cuentas> {
    const cuentaUrl = `${this.jsonCuentasUrl}/${cuenta.id}`;
    return this.http.put<Cuentas>(cuentaUrl, cuenta);
  }

  // Elimina una cuenta del servidor
  deleteCuentas(cuenta: Cuentas): Observable<void> {
    const cuentaUrl = `${this.jsonCuentasUrl}/${cuenta.id}`;
    return this.http.delete<void>(cuentaUrl);
  }

  // Valida las credenciales de un usuario y devuelve la cuenta correspondiente
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