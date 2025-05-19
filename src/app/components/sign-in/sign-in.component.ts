import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FacultadDatos } from '../../models/facultadDatos';
import { ServFacultadDatosService } from '../../services/SigninLogin/serv-facultad-datos.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [
    MatTabsModule,
    FormsModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatStepperModule,
    MatIconModule,
  MatRadioModule,
  MatSelectModule,
  NgIf,
  NgFor],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {

facultadControl = new FormControl<FacultadDatos | null>(null, Validators.required);
  facultades: FacultadDatos[] = [];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');

  constructor(private servicioFacultadDatos: ServFacultadDatosService) {

  }

  ngOnInit(): void {
    this.servicioFacultadDatos.getFacultadDatos().subscribe({
      next: (data) => {
        this.facultades = data;
      },
      error: (err) => {
        console.error('Error al obtener datos de facultades', err);
      }
    });
  }

  updateErrorMessage() { 
    if (this.email.hasError('requerido')) {
      this.errorMessage.set('No dejar en blanco');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('No es un email válido');
    } else {
      this.errorMessage.set('');
    }
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup: FormGroup = this._formBuilder.group({firstCtrl: ['']});
  secondFormGroup: FormGroup = this._formBuilder.group({secondCtrl: ['']});
  thirdFormGroup: FormGroup = this._formBuilder.group({thirdCtrl: ['']});
  fourthFormGroup: FormGroup = this._formBuilder.group({fourthCtrl: ['']});
  fifthFormGroup: FormGroup = this._formBuilder.group({fifthCtrl: ['']});
  sixthFormGroup: FormGroup = this._formBuilder.group({sixthCtrl: ['']});
  seventhFormGroup: FormGroup = this._formBuilder.group({seventhCtrl: ['']});


  }
  
  
