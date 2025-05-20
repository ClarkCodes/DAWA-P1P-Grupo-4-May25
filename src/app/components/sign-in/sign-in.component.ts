import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CuentasService } from '../../services/SigninLogin/cuentas.service';
import { Cuentas } from '../../models/cuentas';
import { ServFacultadDatosService } from '../../services/SigninLogin/serv-facultad-datos.service';
import { FacultadDatos } from '../../models/facultadDatos';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sign-in',
  imports: [
    MatFormField, 
    FormsModule, 
    MatLabel, 
    MatInputModule, 
    MatFormFieldModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatOption,
    MatIconModule,
    MatSelect,
    MatRadioModule,
    MatButtonModule,
    ],
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent implements OnInit {

facultadControl = new FormControl< | null>(null, Validators.required);
  facultades: FacultadDatos[] = [];

  categoriaControl = new FormControl<FacultadDatos | null>(null, Validators.required);
  categorias: FacultadDatos[] = [];

  constructor(private servicioFacultadDatos: ServFacultadDatosService ) {
  }

  

  ngOnInit(): void {
     this.servicioFacultadDatos.getFacultadDatos().subscribe({
      next: (datafacultad) => {
        this.facultades = datafacultad;
      },
      error: (err) => {
        console.error('Error al obtener datos de facultades', err);
      }
    });
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();

  }
   }

  
  
