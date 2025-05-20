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
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}

