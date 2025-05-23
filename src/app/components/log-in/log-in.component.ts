import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CuentasService } from '../../services/SigninLogin/cuentas.service';
import { Cuentas } from '../../models/cuentas';

/**
 * Componente para la gestión del inicio de sesión de usuarios.
 */
@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  // Servicios inyectados
  private cuentasService = inject(CuentasService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  // Configuración de la posición del SnackBar
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // Señal para controlar la visibilidad de la contraseña
  hide = signal(true);

  // Formulario reactivo para el inicio de sesión
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  /**
   * Muestra un SnackBar con mensaje de acceso exitoso.
   */
  openSnackBar(): void {
    this._snackBar.open('ACCESO EXITOSO', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  /**
   * Muestra un SnackBar con mensaje de acceso denegado por credenciales incorrectas.
   */
  invalidSnackBar(): void {
    this._snackBar.open('ACCESO DENEGADO (Revisar credenciales)', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  /**
   * Alterna la visibilidad de la contraseña.
   * @param event Evento del ratón para evitar propagación.
   */
  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Valida las credenciales y redirige según el rol del usuario.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';

      this.cuentasService.getCuentas().subscribe({
        next: (cuentas: Cuentas[]) => {
          const user = cuentas.find(
            (u) => u.email === email && u.password === password
          );

          if (user) {
            // Redirigir según el rol del usuario
            switch (user.rol) {
              case 'ESTUDIANTE':
                this.router.navigate(['/estudiantes']);
                this.openSnackBar();
                break;
              case 'FACULTAD':
                this.router.navigate(['/crud-facultades']);
                this.openSnackBar();
                break;
              case 'CLUB':
                this.router.navigate(['/crud-eventos-clubes']);
                this.openSnackBar();
                break;
              default:
                alert('Rol desconocido');
            }
          } else {
            this.invalidSnackBar();
          }
        },
        error: (err) => {
          console.error('Error al consultar usuarios:', err);
          alert('Error al consultar usuarios');
        }
      });
    }
  }
}