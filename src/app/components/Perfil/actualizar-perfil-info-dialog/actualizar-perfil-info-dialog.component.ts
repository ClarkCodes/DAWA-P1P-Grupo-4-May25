import { Component, ElementRef, inject, Inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cuenta, Rol } from '../../../models/cuenta';
import { FormFieldErrorComponent } from '../../shared/form-field-error/form-field-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { Facultad } from '../../../models/facultad';
import { Club } from '../../../models/eventoClub';
import { getRolEnumByStrId, getRolEnumKeyNameByStrId, RolEnum } from '../../../utils/utils';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { onImageError } from '../../../utils/utils';

@Component({
  selector: 'app-actualizar-perfil-info-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    FormFieldErrorComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './actualizar-perfil-info-dialog.component.html',
  styleUrl: './actualizar-perfil-info-dialog.component.css'
})

export class ActualizarPerfilInfoDialogComponent {
  public cuentasService = inject( CuentasService );
  public enumRoles = RolEnum;
  roles : Rol[] = [];
  facultades: Facultad[] = [];
  clubes: Club[] = [];
  actualizarCrearPerfilForm!: FormGroup;
  rolUsuario: RolEnum | undefined = undefined;
  rolUsuarioLogueadoId: number = 0;

  // Señal para controlar la visibilidad de la contraseña
  hidePassword = signal( true );

  @ViewChild( 'nombreControl' ) nombreControl!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ActualizarPerfilInfoDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: { cuentaUsuario: Cuenta | null },
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if ( this.data.cuentaUsuario?.idClub || !this.data.cuentaUsuario ) // Los Clubes se cargan si la cuenta es de tipo Club y se estuviera abriendo desde el componente de perfil de usuario o si el administrador esta creando una cuenta nueva desde la pagina de Visualizacion de Administrador
      this.loadClubes();

    this.loadRoles();
    this.loadFacultades();

    if( this.data.cuentaUsuario ) // Esto seria si el dialogo es invocado por el perfil del usuario
    {
      this.rolUsuario = getRolEnumByStrId( this.data.cuentaUsuario?.idRol as string );
      this.loadRolUsuarioLogueadoId();
      this.loadProfileDataOnForm();
    }
    else { // Esto seria si el dialogo es invocado desde la pagina de Visualizacion de Administrador
      this.rolUsuario = getRolEnumByStrId( '1' );
      this.loadEmptyForm();
    }

    this.actualizarCrearPerfilForm.get( 'idRol' )?.valueChanges.subscribe( () => {
      this.formValidationsVerifier();
    });
  }

  ngAfterInit() {
    this.nombreControl.nativeElement.focus();
  }

  loadRoles() {
    this.cuentasService.getRoles().subscribe( ( roles: Rol[] ) => {
      this.roles = roles;
    });
  }

  loadRolUsuarioLogueadoId() {
    this.cuentasService.usuarioLogueado$.subscribe( ( cuenta: Cuenta | null ) => {
      if ( cuenta ) {
        this.rolUsuarioLogueadoId = Number( cuenta.idRol );
      }
    });
  }

  loadFacultades() {
    this.cuentasService.getFacultades().subscribe( ( facultades: Facultad[] ) => {
      this.facultades = facultades;
    });
  }

  loadClubes() {
    this.cuentasService.getClubes().subscribe( ( clubes: Club[] ) => {
      this.clubes = clubes;
    });
  }

  loadProfileDataOnForm() {
    this.actualizarCrearPerfilForm = this.fb.group({
      nombre: [this.data.cuentaUsuario?.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellidos: [''],
      email: [this.data.cuentaUsuario?.email, [Validators.required, Validators.email]],
      idRol: [{value: this.data.cuentaUsuario?.idRol, disabled: !( this.rolUsuario === this.enumRoles.ADMINISTRADOR || this.enumRoles[this.rolUsuarioLogueadoId] === 'ADMINISTRADOR')}],
      cedula: [''],
      telefono: [''],
      fechaNacimiento: [''],
      idFacultad: [this.data.cuentaUsuario?.idFacultad],
      idClub: [''],
      fotoPerfilUrl: [this.data.cuentaUsuario?.fotoPerfilUrl ?? ''],
    });

    this.formValidationsVerifier();
  }

  loadEmptyForm() {
    this.actualizarCrearPerfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellidos: [''],
      email: ['', [Validators.required, Validators.email]],
      password:['', Validators.required],
      idRol: [{value: '', disabled: !( this.rolUsuario === this.enumRoles.ADMINISTRADOR || this.enumRoles[this.rolUsuarioLogueadoId] === 'ADMINISTRADOR')}],
      cedula: [''],
      telefono: [''],
      fechaNacimiento: [''],
      idFacultad: ['adc4'],
      idClub: [''],
      fotoPerfilUrl: ['']
    });

    this.formValidationsVerifier();
  }

  formValidationsVerifier() {
    if( this.data.cuentaUsuario ) {
      switch( this.rolUsuario ) {
        case RolEnum.ESTUDIANTE:
          const apellidosControl = this.actualizarCrearPerfilForm.get( 'apellidos' );
          const cedulaControl = this.actualizarCrearPerfilForm.get( 'cedula' );
          const telefonoControl = this.actualizarCrearPerfilForm.get( 'telefono' );
          const fechaNacimientoControl = this.actualizarCrearPerfilForm.get( 'fechaNacimiento' );
          const fechaNacimiento = new Date( this.data.cuentaUsuario?.datosEstudiante.fechaNacimiento as string );

          [Validators.maxLength(50)]
          apellidosControl?.setValue( this.data.cuentaUsuario?.datosEstudiante.apellidos );
          apellidosControl?.setValidators( [Validators.maxLength(50)] );
          apellidosControl?.updateValueAndValidity();
          cedulaControl?.setValue( this.data.cuentaUsuario?.datosEstudiante.cedula );
          cedulaControl?.setValidators( [Validators.required, Validators.minLength( 10 ), Validators.maxLength(10)] );
          cedulaControl?.updateValueAndValidity();
          telefonoControl?.setValue( this.data.cuentaUsuario?.datosEstudiante.telefono );
          telefonoControl?.setValidators( [Validators.required, Validators.minLength( 6 ), Validators.maxLength(12)] );
          telefonoControl?.updateValueAndValidity();
          fechaNacimientoControl?.setValue( fechaNacimiento );
          fechaNacimientoControl?.setValidators( [Validators.required] );
          fechaNacimientoControl?.updateValueAndValidity();
          break;

        case RolEnum.CLUB:
          const idClubControl = this.actualizarCrearPerfilForm.get( 'idClub' );
          idClubControl?.setValue( this.data.cuentaUsuario?.idClub );
          idClubControl?.setValidators( [Validators.required] );
          idClubControl?.updateValueAndValidity();
          break;

        default:
          break;
      }
    }
    else {
      switch( this.rolUsuario ) {
        case RolEnum.ESTUDIANTE:
          const apellidosControl = this.actualizarCrearPerfilForm.get( 'apellidos' );
          const cedulaControl = this.actualizarCrearPerfilForm.get( 'cedula' );
          const telefonoControl = this.actualizarCrearPerfilForm.get( 'telefono' );
          const fechaNacimientoControl = this.actualizarCrearPerfilForm.get( 'fechaNacimiento' );

          apellidosControl?.setValidators( [Validators.maxLength(50)] );
          apellidosControl?.updateValueAndValidity();
          cedulaControl?.setValidators( [Validators.required, Validators.minLength( 10 ), Validators.maxLength(10)] );
          cedulaControl?.updateValueAndValidity();
          telefonoControl?.setValidators( [Validators.required, Validators.minLength( 6 ), Validators.maxLength(12)] );
          telefonoControl?.updateValueAndValidity();
          fechaNacimientoControl?.setValidators( [Validators.required] );
          fechaNacimientoControl?.updateValueAndValidity();
          break;

        case RolEnum.CLUB:
          const idClubControl = this.actualizarCrearPerfilForm.get( 'idClub' );
          idClubControl?.setValidators( [Validators.required] );
          idClubControl?.updateValueAndValidity();
          break;

        default:
          break;
      }
    }
  }

  onSubmit() {
    this.dialogRef.close( this.getDataFromForm() );
  }

  getDataFromForm(): Partial<Cuenta> | Cuenta | void {
    if ( this.actualizarCrearPerfilForm.untouched || !this.actualizarCrearPerfilForm.dirty || this.actualizarCrearPerfilForm.invalid )
      return;

    const formData = this.actualizarCrearPerfilForm.value;

    if( this.data.cuentaUsuario ) {
      const updatedValues: Partial<Cuenta> = {}; // Se Crea un objeto parcial de Cuenta, vacío al inicio, dado que es parcial, todos sus miembros son opcionales.
      const keys = ['nombre', 'email', 'idRol', 'apellidos', 'cedula', 'telefono', 'fechaNacimiento', 'idFacultad', 'idClub', 'fotoPerfilUrl'];

      keys.forEach( key => {
        if ( key === "apellidos" || key === "cedula" || key === 'telefono' || key === 'fechaNacimiento' ) { // Se verifica si son atributos de estudiantes para haacer coincidir las estructuras por diferencias para practicidad con el form
          if ( this.data.cuentaUsuario?.datosEstudiante[key] !== formData[key] ) {
            if ( !updatedValues.datosEstudiante ){
              updatedValues.datosEstudiante = {
                apellidos: this.data.cuentaUsuario?.datosEstudiante.apellidos as string,
                cedula: this.data.cuentaUsuario?.datosEstudiante.cedula as string,
                telefono: this.data.cuentaUsuario?.datosEstudiante.telefono as string,
                fechaNacimiento: this.data.cuentaUsuario?.datosEstudiante.fechaNacimiento as string
              };
            }
            updatedValues.datosEstudiante[key] = formData[key];
          }
        }
        else {
          const originalValue = this.data.cuentaUsuario ? this.data.cuentaUsuario[key as keyof Cuenta] : undefined;
          // For objects, do a shallow comparison; for primitives, use !==
          const isDifferent = typeof originalValue === 'object' && originalValue !== null
            ? JSON.stringify( originalValue ) !== JSON.stringify( formData[key] )
            : originalValue !== formData[key];
          if ( isDifferent ) {
            updatedValues[key as keyof Cuenta] = formData[key]; // Si son diferentes, se asigna la propiedad directamente.
          }
        }
      });

      return updatedValues;
    }
    else {
      const newUserAccount = {
        id: 0,
        nombre: formData['nombre'],
        email: formData['email'],
        password: formData['password'],
        idRol: formData['idRol'],
        datosEstudiante: {
          apellidos: formData['apellidos'] ?? '',
          cedula: formData['cedula'] ?? '',
          telefono: formData['telefono'] ?? '',
          fechaNacimiento: formData['fechaNacimiento'] ?? '',
        },
        idFacultad: formData['idFacultad'],
        idClub: formData['idClub'] ?? '',
        fotoPerfilUrl: formData['fotoPerfilUrl'] ?? '',
        estadoActivo: true
      }

      return newUserAccount;
    }
  }

  onImagePreviewError( event: Event ) {
    onImageError( event.target as HTMLImageElement );
  }

  showHidePassword( event: MouseEvent ): void {
    this.hidePassword.set( !this.hidePassword() );
    event.stopPropagation();
  }

  cancel() {
    this.dialogRef.close( false );
  }
}
