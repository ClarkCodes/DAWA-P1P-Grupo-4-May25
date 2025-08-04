import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CuentasService } from '../../services/SignupLogin/cuentas.service';
import { SnackbarNotificationService } from '../shared/snackbar-notification/snackbar-notification.service';
import { RouterLink } from '@angular/router';

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
    MatIconModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  // Servicios inyectados
  private cuentasService = inject( CuentasService );
  private snackBarNotification = inject( SnackbarNotificationService ); // Shared SnackBar para notificaciones consistentes en todo el sitio

  // Señal para controlar la visibilidad de la contraseña
  isPasswordHidden = signal( true );

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  @ViewChild( 'submitBtn' ) submitBtn!: HTMLButtonElement;

  /**
   * Alterna la visibilidad de la contraseña.
   * @param event Evento del ratón para evitar propagación.
   */
  showHidePassword( event: MouseEvent ): void {
    this.isPasswordHidden.set( !this.isPasswordHidden() );
    event.stopPropagation();
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Usa el servicio de Cuentas para validar las credenciales y de ser correctas, redirige según el rol del usuario.
   */
  onSubmit() {
    if ( this.loginForm.valid ) {
      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';
      this.cuentasService.login( email, password );

      this.cuentasService.rolUsuarioLogueado$.subscribe( rol => {
        if( rol ) {
          this.cuentasService.loginRouter( rol?.nombre );

          this.cuentasService.usuarioLogueado$.subscribe( usuario => {
            if( usuario ){
              this.snackBarNotification.openCustomNotification( 'ACCESO EXITOSO', `Bienvenido/a ${usuario.nombre}`, 'success' );
            }
          });
        }
      });
    }
  }

  onEnterKeyUp(): void {
    this.submitBtn.click();
  }
}
