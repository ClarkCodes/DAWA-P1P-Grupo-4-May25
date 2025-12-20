import { Component, inject, signal, OnInit } from '@angular/core';
import { Validators, FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormFieldErrorComponent } from '../shared/form-field-error/form-field-error.component';

import { CuentasService } from '../../services/SignupLogin/cuentas.service';
import { Club } from '../../models/eventoClub';
import { Facultad } from '../../models/facultad';
import { SnackbarNotificationService } from '../shared/snackbar-notification/snackbar-notification.service';
import { Cuenta } from '../../models/cuenta';
import { generateNewId, getRolEnumByStrId, getRolEnumKeyNameByStrId, RolEnum } from '../../utils/utils';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    FormFieldErrorComponent,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  // Inyección de servicios necesarios
  private snackBarNotification = inject( SnackbarNotificationService );
  private cuentasService = inject( CuentasService );
  private fb = inject( FormBuilder );

  public rolEnum = RolEnum;
  userForm!: FormGroup; // FormGroup que agrupa todos los controles del formulario
  facultades: Facultad[] = []; // Lista de facultades obtenidas del servicio
  clubes: Club[] = []; // Lista de clubes obtenidas del servicio

  // Señal para controlar la visibilidad de la contraseña
  hidePassword = signal( true );

  // Constructor del componente
  constructor() {}

  ngOnInit(): void {
    this.loadFacultades();
    this.loadClubes();
    this.loadInitForm();
  }

  loadFacultades() {
    this.cuentasService.getFacultades().subscribe({
      next: ( facultades: Facultad[] ) => {
        this.facultades = facultades;
      },
      error: ( err ) => this.snackBarNotification.openCustomNotification( 'Oopss', `Hubo un error al obtener las facultades. ${err}`, 'error' )
    });
  }

  loadClubes() {
    this.cuentasService.getClubes().subscribe({
      next: ( clubes: Club[] ) => {
        this.clubes = clubes;
      },
      error: ( err ) => this.snackBarNotification.openCustomNotification( 'Oopss', `Hubo un error al obtener los clubes. ${err}`, 'error' )
    });
  }

  loadInitForm() {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellidos: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      idRol: ['2'],
      cedula: [''],
      telefono: [''],
      fechaNacimiento: [''],
      idFacultad: ['adc4', [Validators.required]],
      idClub: ['1']
    });

    // Suscripción a cambios en el email para convertirlo a minúsculas
    const emailFormControl = this.userForm.get( 'email' );
    emailFormControl?.valueChanges.subscribe( value => {
      if ( value && typeof value === 'string' ) {
        const lowerCaseValue = value.toLowerCase();
        if ( value !== lowerCaseValue ) {
          emailFormControl.setValue( lowerCaseValue, { emitEvent: false } );
        }
      }
    });

    this.updateEstudianteFieldsValidations( this.userForm.get( 'idRol' )?.value );

    const rolFormControl = this.userForm.get( 'idRol' );
    rolFormControl?.valueChanges.subscribe( rolIdValue => {
      this.updateEstudianteFieldsValidations( rolIdValue );
    });
  }

  updateEstudianteFieldsValidations( rolIdValue: string ) {
    const apellidosEstudianteControl = this.userForm.get( 'apellidos' );
    const cedulaEstudianteControl = this.userForm.get( 'cedula' );
    const telefonoEstudianteControl = this.userForm.get( 'telefono' );
    const fechaNacimientoEstudianteControl = this.userForm.get( 'fechaNacimiento' );
    const clubControl = this.userForm.get( 'idClub' );

    if ( getRolEnumByStrId( rolIdValue ) === RolEnum.ESTUDIANTE ) {
      apellidosEstudianteControl?.setValidators( [Validators.maxLength( 50 )] );
      cedulaEstudianteControl?.setValidators( [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength( 10 ), Validators.maxLength( 10 )] );
      telefonoEstudianteControl?.setValidators( [Validators.pattern(/^[0-9]+$/), Validators.maxLength( 15 )] );
      fechaNacimientoEstudianteControl?.setValidators( [Validators.required] );
    }
    else {
      apellidosEstudianteControl?.clearValidators();
      cedulaEstudianteControl?.clearValidators();
      telefonoEstudianteControl?.clearValidators();
      fechaNacimientoEstudianteControl?.clearValidators();
    }

    if ( getRolEnumByStrId( rolIdValue ) === RolEnum.CLUB ) {
      clubControl?.setValidators( [Validators.required] );
    }
    else {
      clubControl?.clearValidators();
    }

    apellidosEstudianteControl?.updateValueAndValidity();
    cedulaEstudianteControl?.updateValueAndValidity();
    telefonoEstudianteControl?.updateValueAndValidity();
    fechaNacimientoEstudianteControl?.updateValueAndValidity();
    clubControl?.updateValueAndValidity();
  }

  getDataFromForm(): Cuenta {
    const userData = this.userForm.value;

    return {
      id: generateNewId<Cuenta>( this.cuentasService.getCuentas() ) as number,
      nombre: ( userData['nombre'] as string ).trim(),
      email: ( userData['email'] as string ).trim(),
      password: userData['password'],
      idRol: userData['idRol'],
      datosEstudiante: {
        apellidos: getRolEnumByStrId( userData['idRol'] ) === RolEnum.ESTUDIANTE ? ( userData['apellidos'] as string ).trim() : '',
        cedula: getRolEnumByStrId( userData['idRol'] ) === RolEnum.ESTUDIANTE ? userData['cedula'] : '',
        telefono: getRolEnumByStrId( userData['idRol'] ) === RolEnum.ESTUDIANTE ? ( userData['telefono'] as string ).trim() : '',
        fechaNacimiento: getRolEnumByStrId( userData['idRol'] ) === RolEnum.ESTUDIANTE ? userData['fechaNacimiento'] : ''
      },
      idFacultad: userData['idFacultad'],
      idClub: getRolEnumByStrId( userData['idRol'] ) === RolEnum.CLUB ? userData['idClub'] : '',
      fotoPerfilUrl: '',
      estadoActivo: true
    }
  }

  onSubmit(): void {
    if ( this.userForm.valid ) {
      const userData = this.getDataFromForm();

      // Enviar datos al servicio de cuentas
      this.cuentasService.addCuentas( userData ).subscribe({
        next: () => {
          this.cuentasService.login( userData.email, userData.password );
          this.cuentasService.loginRouter( getRolEnumKeyNameByStrId( userData.idRol ) as string );
          this.snackBarNotification.openCustomNotification( 'Nueva Cuenta', 'Cuenta creada exitosamente ✨👌🏼', 'success' )
        },
        error: ( err ) => this.snackBarNotification.openCustomNotification( 'Oopss', `Hubo un error al crear la cuenta. ${err}`, 'error' )
      });
    }
    else {
      this.snackBarNotification.openCustomNotification( 'Campos insuficientes', `Por favor, completa todos los campos correctamente`, 'warning' )
    }
  }

  showHidePassword( event: MouseEvent ): void {
    this.hidePassword.set( !this.hidePassword() );
    event.stopPropagation();
  }
}
