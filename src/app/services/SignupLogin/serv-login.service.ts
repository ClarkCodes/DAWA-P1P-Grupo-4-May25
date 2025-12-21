import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuentas } from '../../models/cuentas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServLoginService {

  // Este servicio se mantendra aqui por el momento, pero su funcionalidad posiblemente la mantenga en el servicio de Cuentas
  // No veo una razon suficiente para separarlos, cuando se realice la integracion con el Backend se decidira
  // si la funcionalidad de este servicio es absorbida por Cuentas o se mantienen separados, por el momento se mantiene aqui

  private apiUrl = 'http://localhost:5214/api/Cuentas/login';

  constructor( private http: HttpClient ) {}

  getCuentas(): Observable<Cuentas[]> {
    return this.http.get<Cuentas[]>(this.apiUrl);
  }

  login(email: string, password: string): Observable<Cuentas> {
    return this.http.post<Cuentas>(`${this.apiUrl}`, { email, password });
  }
}
