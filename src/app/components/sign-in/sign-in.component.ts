import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CuentasService } from '../../services/SigninLogin/cuentas.service';
import { ServFacultadDatosService } from '../../services/SigninLogin/serv-facultad-datos.service';
import { FacultadDatos } from '../../models/facultadDatos';

// Definición del componente Angular
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
    NgIf,
    MatSelectModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  // Controles del formulario con validaciones
  nombreControl = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]);
  passwordControl = new FormControl('', [Validators.required]);
  rolControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  facultadControl = new FormControl<FacultadDatos | null>(null, [Validators.required]);

  // FormGroup que agrupa todos los controles del formulario
  userForm: FormGroup;

  // Lista de facultades obtenidas del servicio
  facultades: FacultadDatos[] = [];

  // Señal para controlar la visibilidad de la contraseña
  hide = signal(true);

  // Inyección de servicios necesarios
  private _snackBar = inject(MatSnackBar);
  private servicioFacultadDatos = inject(ServFacultadDatosService);
  private servicioCuentas = inject(CuentasService);
  private router = inject(Router);

  // Configuración de posiciones para el snackbar
  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // Constructor del componente
  constructor() {
    // Inicialización del FormGroup con los controles
    this.userForm = new FormGroup({
      nombre: this.nombreControl,
      email: this.emailFormControl,
      password: this.passwordControl,
      facultad: this.facultadControl,
      rol: this.rolControl
    });

    // Suscripción a cambios en el email para convertirlo a minúsculas
    this.emailFormControl.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const lowerCaseValue = value.toLowerCase();
        if (value !== lowerCaseValue) {
          this.emailFormControl.setValue(lowerCaseValue, { emitEvent: false });
        }
      }
    });
  }

  // Método de inicialización del componente
  ngOnInit(): void {
    // Obtener datos de facultades desde el servicio
    this.servicioFacultadDatos.getFacultadDatos().subscribe({
      next: (datafacultad) => {
        this.facultades = datafacultad;
      },
      error: (err) => {
        console.error('Error al obtener datos de facultades:', err);
      }
    });
  }

  // Método para mostrar notificación de registro exitoso
  private openSnackBar(): void {
    this._snackBar.open('REGISTRO EXITOSO', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.router.navigate(['/login']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  // Método para mostrar notificación de registro denegado
  private invalidSnackBar(): void {
    this._snackBar.open('REGISTRO DENEGADO', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('Datos del formulario:', userData);

      // Enviar datos al servicio de cuentas
      this.servicioCuentas.addCuentas(userData).subscribe({
        next: () => this.openSnackBar(),
        error: () => this.invalidSnackBar()
      });
    } else {
      this.invalidSnackBar();
    }
  }

  // Método para alternar la visibilidad de la contraseña
  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}