import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cuenta, Rol } from '../../../models/cuenta';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { Facultad } from '../../../models/facultad';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ActualizarPerfilInfoDialogComponent } from '../../Perfil/actualizar-perfil-info-dialog/actualizar-perfil-info-dialog.component';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css']
})

export class TablaUsuariosComponent implements OnInit, AfterViewInit {
  private confirmDialog: ConfirmationDialogService = new ConfirmationDialogService();
  private updateProfileDialog = inject( MatDialog );

  // Shared SnackBar para notificaciones consistentes en todo el sitio
  private snackBarNotification = inject( SnackbarNotificationService );

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['nombre', 'email', 'password', 'facultad', 'rol', 'actions'];

  // Control de búsqueda para filtrar los datos de la tabla
  searchControl = new FormControl('');

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<Cuenta>();

  // Arreglos de Facultad y Rol
  facultades: Facultad[] = [];
  roles: Rol[] = [];

  // ID de la fila que se está editando
  editingRowId: number | null = null;

  editForm: FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    idRol: FormControl<string>;
    datosEstudiante: FormGroup<{
      cedula: FormControl<string>;
      telefono: FormControl<string>;
      fechaNacimiento: FormControl<string>;
    }>;
    idFacultad: FormControl<string>;
    idClub: FormControl<string>;
    fotoPerfilUrl: FormControl<string>;
    estadoActivo: FormControl<boolean>;
  }>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cuentasService: CuentasService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      id: new FormControl<number>(0, { nonNullable: true }),
      nombre: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s'-]*$")
] }),
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl<string>('', { nonNullable: true }),
      idRol: new FormControl<string>('', { nonNullable: true }),
      datosEstudiante: this.fb.group({
        cedula: new FormControl<string>('', { nonNullable: true }),
        telefono: new FormControl<string>('', { nonNullable: true }),
        fechaNacimiento: new FormControl<string>('', { nonNullable: true })
      }),
      idFacultad: new FormControl<string>('', { nonNullable: true }),
      idClub: new FormControl<string>('', { nonNullable: true }),
      fotoPerfilUrl: new FormControl<string>('', { nonNullable: true }),
      estadoActivo: new FormControl<boolean>(true, { nonNullable: true })
    });
  }

  ngOnInit(): void {
    this.loadCuentas();
    this.loadFacultades();
    this.loadRoles();

    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCuentas(): void {
    this.cuentasService.getCuentas().subscribe( ( cuentas: Cuenta[] ) => {
      this.dataSource.data = cuentas;

      this.dataSource.filterPredicate = ( searchingData: Cuenta, filter: string ): boolean => {
        const filterValue = filter.trim().toLowerCase();
        // Filtra solo si el nombre, email, rol o facultad incluyen el texto ingresado
        return ( searchingData.nombre.toLowerCase().includes( filterValue ) ||
          searchingData.email.toLowerCase().includes( filterValue ) ||
          this.facultades.find( facultad => facultad.id === searchingData.idFacultad )?.nombre.toLowerCase().includes( filterValue ) ||
          this.roles.find( rol => rol.id === searchingData.idRol )?.nombre.toLowerCase().includes( filterValue ) as boolean );
      };

      this.searchControl.valueChanges.subscribe( value => {
        this.dataSource.filter = value || '';
      });
    });
  }

  // Obtiene todos los Roles desde el servicio
  loadRoles(): void {
    this.cuentasService.getRoles().subscribe( ( roles: Rol[] ) => {
      this.roles = roles;
    });
  }

  // Obtiene el nombre del Rol desde el arreglo de roles cargados
  getRolNameById( id: string ): string {
    return this.roles.find( rol => rol.id === id )?.nombre ?? '';
  }

  // Obtiene todas las Facultades desde el servicio
  loadFacultades(): void {
    this.cuentasService.getFacultades().subscribe( ( facultades: Facultad[] ) => {
      this.facultades = facultades;
    });
  }

  // Obtiene el nombre del Facultad desde el arreglo de facultades cargados
  getFacultadNameById( id: string ): string {
    return this.facultades.find( facultad => facultad.id === id )?.nombre ?? '';
  }

  // Inicia la edición de una cuenta
  startEdit( cuenta: Cuenta ): void {
    this.editingRowId = cuenta.id;
    this.editForm.patchValue( cuenta );
  }

  saveEdit(): void {
    if (this.editForm.valid) {
      const updatedCuenta: Cuenta = this.editForm.value as Cuenta;
      this.cuentasService.editCuentas( updatedCuenta ).subscribe( () => {
        this.cancelEdit();
        this.loadCuentas();
        this.cuentasService.refrezcarCuentaActualizada( updatedCuenta );
        this.snackBarNotification.openCustomNotification( 'Actualización', 'Cuenta actualizada exitosamente 💫', 'success' );
      });
    } else {
      this.snackBarNotification.openCustomNotification( 'Cancelado', 'Edición Cancelada', 'warning' );
      this.cancelEdit();
      this.loadCuentas();
    }
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.editForm.reset();
  }

  // Método para agregar una nueva cuenta
  addCuenta(): void {
    const createAccountDialogRef = this.updateProfileDialog.open( ActualizarPerfilInfoDialogComponent, {
      data: { cuentaUsuario: null },
      panelClass: 'GlassmorphicMidDialog'
    });

    createAccountDialogRef.afterClosed().subscribe( ( nuevaCuentaData: Cuenta | undefined ) => {
      if ( nuevaCuentaData ) {
        this.cuentasService.addCuentas( nuevaCuentaData ).subscribe( () => {
          this.snackBarNotification.openCustomNotification( "Nueva cuenta", "Nueva cuenta creada exitosamente 👌🏼✨", 'success' );
        } );
      }
    });
  }

  deepUpdate( cuenta: Cuenta ) {
    const updateProfileDialogRef = this.updateProfileDialog.open( ActualizarPerfilInfoDialogComponent, {
      data: { cuentaUsuario: cuenta },
      panelClass: 'GlassmorphicMidDialog'
    });

    updateProfileDialogRef.afterClosed().subscribe( ( cuentaUpdatedData: Partial<Cuenta> | undefined ) => {
      if ( cuentaUpdatedData ) {
        const cuentaId: number = cuenta.id as number;

        this.cuentasService.updateCuenta( cuentaId, cuentaUpdatedData ).subscribe( () => {
          this.snackBarNotification.openCustomNotification( "Cuenta Actualizada", "Cuenta actualizada exitosamente 💫", 'success' );
        } );
      }
    });
  }

  // Elimina una cuenta tras confirmación
  delete( cuenta: Cuenta ) {
    this.confirmDialog.openConfirmation( 'Eliminar cuenta', `¿Está seguro de eliminar la cuenta perteneciente a ${cuenta.nombre}?` ).subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.cuentasService.deleteCuentas( cuenta ).subscribe( () => {
          this.loadCuentas();
          this.snackBarNotification.openCustomNotification( 'Eliminación', 'Cuenta eliminada exitosamente 👌🏼', 'success' );
        });
      }
    });
  }
}
