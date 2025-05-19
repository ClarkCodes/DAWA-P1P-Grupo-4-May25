import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClubCuentas } from '../../models/clubCuentas';

@Injectable({
  providedIn: 'root'
})
export class ServClubCuentasService {

 private jsonClubCuentasUrl: string = 'http://localhost:3000/clubCuentas'; // Url del Endpoint de productos del Json Server

  constructor( private http: HttpClient ) { // Inyeccion de HTTP Client
  } 
}
