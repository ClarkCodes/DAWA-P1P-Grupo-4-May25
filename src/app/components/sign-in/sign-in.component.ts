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
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';


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
    MatSelectModule    ],
    
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent implements OnInit {

nombreControl = new FormControl('', Validators.required);
passwordControl = new FormControl('', Validators.required);
rolControl = new FormControl('', Validators.required);

private _snackBar = inject(MatSnackBar);

 horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar() {
    this.router.navigate(['/login']).then(() => {
      window.scrollTo(0, 0);});
    this._snackBar.open('REGISTRO EXITOSO', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  InvalidSnackBar() {
    this._snackBar.open('REGISTRO DENEGADO', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  userForm: FormGroup;

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('Datos del formulario:', userData);

      // Llamar servicio para guardar (asumiendo que servicioCuentas tiene método saveUser)
      this.servicioCuentas.addCuentas(userData).subscribe({
        next: (response) => {
        this.openSnackBar();
        
        },
        error: (error) => {
          this.InvalidSnackBar();
        }
      });
    } else {
      this.InvalidSnackBar();
    }
  }

  clearForm() {
    
  }


facultadControl = new FormControl< | null>(null, Validators.required);
  facultades: FacultadDatos[] = [];

  constructor(private servicioFacultadDatos: ServFacultadDatosService, private servicioCuentas: CuentasService, private router: Router) {
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

  
  
