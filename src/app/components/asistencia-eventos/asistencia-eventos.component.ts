import { Component , inject, OnInit, signal, ViewChild } from '@angular/core';
import { ServAsistenciaEventosService } from '../../services/AsistenciaEventos/serv-asistencia-eventos.service';
import { AsistenciaEvento } from '../../models/asistenciaEvento';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTable } from '@angular/material/table';
import { MatHeaderCell } from '@angular/material/table';
import { MatCellDef } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { ServEventosClubesService } from '../../services/EventosClubes/crud-eventos-clubes.service';
import { EventoClub } from '../../models/eventoClub';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { SnackbarNotificationService } from '../shared/snackbar-notification/snackbar-notification.service';

@Component({
  selector: 'app-asistencia-eventos',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogContent,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTable,
    MatHeaderCell,
    MatCellDef,
    MatTableModule,
    MatPaginator
  ],
  templateUrl: './asistencia-eventos.component.html',
  styleUrl: './asistencia-eventos.component.css'
})
export class AsistenciaEventosComponent implements OnInit {
  private confirmDialog = inject( ConfirmationDialogService );
  private snackBarNotification = inject( SnackbarNotificationService );
  filterValue: string = '';
  searchControl = new FormControl('');
  asistencias: AsistenciaEvento[] = [];
  estudiantesFiltrados: AsistenciaEvento[] = [];
  estudiantesForm: FormGroup;
  eventosDisponibles: EventoClub[] = [];
  editandoEstudiantes: AsistenciaEvento | null = null;
  @ViewChild( MatSort ) sort!: MatSort;
  dataSource = new MatTableDataSource<AsistenciaEvento>
  displayedColumns: string[] = [
    'id',
    'fecha',
    'estudianteNombre',
    'nombreEvento',
    'telefono',
    'email',
    'aceptoTerminos',
    'opciones'
  ];

  protected readonly value = signal('');
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private ServAsistenciaEventosService: ServAsistenciaEventosService,
    private eventosService: ServEventosClubesService
  ) {
    this.estudiantesForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      estudianteNombre: ['', [Validators.required, Validators.maxLength(50), this.nombreValido]],
      nombreEvento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10),
      this.soloNumerosValidator()]],
      email: ['', [Validators.required, Validators.email]]
    });

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  get email() {
    return this.estudiantesForm.get('email')!;
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  ngOnInit(): void {
    this.cargarRegistro();

    /*this.dataSource.filterPredicate = (data: AsistenciaEvento, filter: string) => {
      const filterValue = filter.trim().toLowerCase();
      // Filtra solo si el nombre o teléfono comienza con el texto ingresado
      return data.estudianteNombre.toLowerCase().startsWith(filterValue) ||
        data.telefono.toLowerCase().startsWith(filterValue);
    };*/

    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value || '';
    });

    this.eventosService.obtenerEventos().subscribe(data => {
      this.eventosDisponibles = data;
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  cargarRegistro(): void {
    this.ServAsistenciaEventosService.getAsistencias().subscribe( ( data: AsistenciaEvento[] ) => {
      this.asistencias = data;
      this.estudiantesFiltrados = data;
      this.dataSource.data = data;
    })
  }

  /*filtrarEstudiantes(texto: string): void {
    const filtro = texto.trim().toLowerCase();
    this.estudiantesFiltrados = this.asistencias.filter(estudiante =>
      estudiante.estudianteNombre.toLowerCase().includes(filtro) ||
      estudiante.telefono.toLowerCase().includes(filtro)
    );
  }*/

  /*search( searchInput: HTMLInputElement ) {
    if( searchInput.value ){
      this.ServAsistenciaEventosService.getAsistenciasSearch( searchInput.value ).subscribe( ( data: Estudiante[] ) => {
        this.dataSource.data = data;
      } );
    }
    else{
      this.cargarRegistro();
    }
  }*/

  onSubmit(): void {
    if ( this.estudiantesForm.invalid ) return;
    const formValue = this.estudiantesForm.value;

    if (this.editandoEstudiantes) {
      /*const actualizado: AsistenciaEvento = {
        ...this.editandoEstudiantes,
        estudianteNombre: formValue.estudianteNombre,
        nombreEvento: formValue.nombreEvento,
        telefono: formValue.telefono,
        email: formValue.email,
        fecha: new Date().toISOString(),
        aceptoTerminos: formValue.aceptoTerminos
      };

      this.ServAsistenciaEventosService.actualizarEstudiantes( actualizado ).subscribe(() => {
        this.snackBarNotification.openCustomNotification( "Actualizado", "Actualización realizada con éxito 💫", 'success' );
        this.editandoEstudiantes = null;
        this.estudiantesForm.reset({
          estudianteNombre: '',
          nombreEvento: '',
          telefono: '',
          email: '',
          aceptoTerminos: true
        });
        this.cargarRegistro();
      });*/

    } else {
      /*const nuevoRegistro: AsistenciaEvento = {
        id: formValue.id,
        estudianteNombre: formValue.estudianteNombre,
        nombreEvento: formValue.nombreEvento,
        telefono: formValue.telefono,
        email: formValue.email,
        edad: formValue.edad,
        fecha: new Date().toISOString(),
        aceptoTerminos: formValue.aceptoTerminos
      };

      this.ServEstudiantesService.agregarEstudiantes(nuevoRegistro).subscribe(() => {
        this.snackBarNotification.openCustomNotification( "Registro", "Registro realizado con éxito 💫", 'success' );
        this.estudiantesForm.reset({
          estudianteNombre: '',
          nombreEvento: '',
          telefono: '',
          email: '',
          aceptoTerminos: true
        });
        this.cargarRegistro();
      });*/
    }
  }

  editarRegistro( asistencia: AsistenciaEvento ): void {
    /*this.editandoEstudiantes = estudiantes;
    this.estudiantesForm.setValue({
      id: estudiantes.id,
      estudianteNombre: estudiantes.estudianteNombre,
      nombreEvento: estudiantes.nombreEvento,
      telefono: estudiantes.telefono,
      email: estudiantes.email,
      aceptoTerminos: estudiantes.aceptoTerminos ?? true
    });*/
  }

  cancelarEdicion(): void {
    this.editandoEstudiantes = null;
    this.estudiantesForm.reset({
      estudianteNombre: '',
      nombreEvento: '',
      telefono: '',
      email: '',
      aceptoTerminos: true
    });
  }

  eliminarRegistro( asistencia: AsistenciaEvento ): void {
    this.confirmDialog.openConfirmation( 'Eliminar comentario', `¿Está seguro de eliminar el comentario de ${asistencia.idCuenta}?` ).subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.ServAsistenciaEventosService.eliminarAsistencia( asistencia.id ).subscribe({
          next: () => {
            this.snackBarNotification.openCustomNotification( "Eliminacion", "Se ha eliminado la inscripcion de asistencia exitosamente 💫", 'success' );
          },
          error: () => {
            this.snackBarNotification.openCustomNotification( "Error", "Error al eliminar el las inscripcion de asistencia", 'error' );
          }
        });

        this.cargarRegistro();
      }
    });
  }

  nombreValido(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (valor && !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
      return { nombreInvalido: true };
    }
    return null;
  }

  soloNumerosValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const soloNumeros = /^\d+$/;
      if (control.value && !soloNumeros.test(control.value)) {
        return { soloNumeros: true };
      }
      return null;
    };
  }

  soloNumeros(event: KeyboardEvent): void {
    const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    // Permitir teclas especiales
    if (teclasPermitidas.includes(event.key)) {
      return;
    }

    // Permitir solo números del 0 al 9
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
