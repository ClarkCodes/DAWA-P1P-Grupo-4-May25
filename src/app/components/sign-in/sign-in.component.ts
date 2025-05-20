import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CuentasService } from '../../services/SigninLogin/cuentas.service';
import { ServFacultadDatosService } from '../../services/SigninLogin/serv-facultad-datos.service';
import { FacultadDatos } from '../../models/facultadDatos';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Cuentas } from '../../models/cuentas';
import { FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';


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
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
    NgIf,
    MatSelectModule

    ],
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent implements OnInit {

nombreControl = new FormControl('', Validators.required);
passwordControl = new FormControl('', Validators.required);
rolControl = new FormControl('', Validators.required);

  userForm: FormGroup;

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('Datos del formulario:', userData);

      // Llamar servicio para guardar (asumiendo que servicioCuentas tiene método saveUser)
      this.servicioCuentas.addCuentas(userData).subscribe({
        next: (response) => {
          console.log('Usuario guardado', response);
          this.clearForm();
        },
        error: (error) => {
          console.error('Error al guardar usuario', error);
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }

  clearForm() {
    this.userForm.reset();
  }


facultadControl = new FormControl< | null>(null, Validators.required);
  facultades: FacultadDatos[] = [];

  constructor(private servicioFacultadDatos: ServFacultadDatosService, private servicioCuentas: CuentasService) {
     this.userForm = new FormGroup({
      nombre: this.nombreControl,
      email: this.emailFormControl,
      password: this.passwordControl,
      facultad: this.facultadControl,
      rol: this.rolControl
    });
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

  
  
