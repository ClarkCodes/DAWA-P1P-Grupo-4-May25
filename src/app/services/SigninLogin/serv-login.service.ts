import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuentas } from '../../models/cuentas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServLoginService {

  private apiUrl = 'http://localhost:5214/api/Cuentas/login';

  constructor(private http: HttpClient) {}

  getCuentas(): Observable<Cuentas[]> {
    return this.http.get<Cuentas[]>(this.apiUrl);
  }

  login(email: string, password: string): Observable<Cuentas> {
    return this.http.post<Cuentas>(`${this.apiUrl}`, { email, password });
  }
}
