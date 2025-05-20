import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CuentasService } from '../../services/SigninLogin/cuentas.service';
import { Cuentas } from '../../models/cuentas';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatIconModule,
    MatFormField,
    MatLabel,
    CommonModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  
 private cuentasService = inject(CuentasService);
  private router = inject(Router);

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Formulario reactivo
 loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.required)
});

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
          // Redirigir según el rol
          switch (user.rol) {
              case 'ESTUDIANTE':
                this.router.navigate(['/estudiante']);
                break;
              case 'FACULTAD':
                this.router.navigate(['/crud-facultades']);
                break;
              case 'CLUB':
                this.router.navigate(['/crud-eventos-clubes']);
                break;
              default:
                alert('Rol desconocido');
            }
        } else {
          alert('Correo o contraseña incorrectos');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al consultar usuarios');
      }
    });
  }
}

}

