// sign-in.component.ts
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
import { RolDatos } from '../../models/rolDatos';

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
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  nombreControl = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  rolControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  facultadControl = new FormControl('', [Validators.required]);

  userForm: FormGroup;
  facultades: FacultadDatos[] = [];
  roles: RolDatos[] = [];
  hide = signal(true);

  private _snackBar = inject(MatSnackBar);
  private servicioFacultadDatos = inject(ServFacultadDatosService);
  private servicioCuentas = inject(CuentasService);
  private router = inject(Router);

  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor() {
    this.userForm = new FormGroup({
      nombre: this.nombreControl,
      email: this.emailFormControl,
      password: this.passwordControl,
      facultadId: this.facultadControl,
      rolId: this.rolControl
    });

    this.emailFormControl.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const lowerCaseValue = value.toLowerCase();
        if (value !== lowerCaseValue) {
          this.emailFormControl.setValue(lowerCaseValue, { emitEvent: false });
        }
      }
    });
  }

  ngOnInit(): void {
    this.servicioFacultadDatos.getFacultadDatos().subscribe({
      next: (datafacultad) => {
        this.facultades = datafacultad;
      },
      error: (err) => {
        console.error('Error al obtener datos de facultades:', err);
        this._snackBar.open('Error al cargar facultades', 'Cerrar', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });

    this.servicioCuentas.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error al obtener datos de roles:', err);
        this._snackBar.open('Error al cargar roles', 'Cerrar', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }

  private openSnackBar(): void {
    this._snackBar.open('REGISTRO EXITOSO', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.router.navigate(['/login']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  private invalidSnackBar(message: string = 'REGISTRO DENEGADO'): void {
    this._snackBar.open(message, 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = {
        id: 0, // ID can be set to 0 for new accounts
        nombre: this.userForm.value.nombre,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        facultadId: this.userForm.value.facultadId,
        rolId: this.userForm.value.rolId
      };
      this.servicioCuentas.addCuentas(userData).subscribe({
        next: () => this.openSnackBar(),
        error: (err) => {
          const message = err.error?.message || 'Error al registrar la cuenta';
          this.invalidSnackBar(message);
        }
      });
    } else {
      this.invalidSnackBar('Por favor, completa todos los campos correctamente');
    }
  }

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}