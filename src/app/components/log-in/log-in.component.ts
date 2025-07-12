import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServLoginService } from '../../services/SigninLogin/serv-login.service';
import { Cuentas } from '../../models/cuentas';
import { SnackBarNotification } from '../shared/snackbar-notification/snackbar-notification';

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
  private cuentasService = inject(ServLoginService);
  private router = inject(Router);
  private snackBar: SnackBarNotification = new SnackBarNotification();

  hide = signal(true);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';

      this.cuentasService.login(email, password).subscribe({
        next: (user: Cuentas) => {
          // Almacenar el token y los datos del usuario en localStorage
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rolId: user.rolId
          }));

          // Redirigir según el rol del usuario
          switch (user.rolId) {
            case 'EST':
              this.router.navigate(['/estudiantes']);
              this.snackBar.openSnackBar('ACCESO EXITOSO', 'success');
              break;
            case 'FAC':
              this.router.navigate(['/crud-eventos-facultades']);
              this.snackBar.openSnackBar('ACCESO EXITOSO', 'success');
              break;
            case 'CLB':
              this.router.navigate(['/crud-eventos-clubes']);
              this.snackBar.openSnackBar('ACCESO EXITOSO', 'success');
              break;
            default:
              this.snackBar.openSnackBar('Rol desconocido', 'error');
          }
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          this.snackBar.openSnackBar('ACCESO DENEGADO (Revisar credenciales)', 'error');
        }
      });
    }
  }
}