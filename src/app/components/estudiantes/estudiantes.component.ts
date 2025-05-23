import { Component , OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServEstudiantesService } from '../../services/serv-estudiantes-service';
import { Estudiantes } from '../../models/estudiantes';
//import { ServComentariosService } from '../../services/serv-estudiantes-service';
//import { Comentario } from '../../models/comentarios';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTable } from '@angular/material/table';
import { MatHeaderCell } from '@angular/material/table';
import { MatCellDef } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';


@Component({
  selector: 'app-estudiantes',
  providers: [provideNativeDateAdapter()],
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
    MatPaginator,
  ],
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.css'
})
export class EstudiantesComponent implements OnInit{
    filterValue: string = '';
    searchControl = new FormControl('');
    estudiantes: Estudiantes[] = [];
    estudiantesFiltrados: Estudiantes[] = [];
    estudiantesForm: FormGroup;
    editandoEstudiantes: Estudiantes | null = null;
     @ViewChild(MatSort) sort!: MatSort;
    dataSource = new MatTableDataSource<Estudiantes>
    displayedColumns: string[] = [
    'id',
    'fecha',
    'estudianteNombre',
    'nombreEvento',
    'telefono',
    'email',
    'edad',
    'aceptoTerminos',
    'opciones'
  ];

  protected readonly value = signal('');
  errorMessage = signal('');

    constructor(
      private fb: FormBuilder,
      private ServEstudiantesService: ServEstudiantesService
    ) {
      this.estudiantesForm = this.fb.group({
        id: [{ value: '', disabled: true }], 
        estudianteNombre: ['', [Validators.required, Validators.maxLength(50), this.nombreValido]],
        nombreEvento: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
        email: ['', [Validators.required, Validators.email]],
        edad: ['', Validators.required],
        aceptoTerminos: [true, this.aceptaTerminosValidator]
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

    this.dataSource.filterPredicate = (data: Estudiantes, filter: string) => {
      const filterValue = filter.trim().toLowerCase();
      // Filtra solo si el nombre o teléfono comienza con el texto ingresado
      return data.estudianteNombre.toLowerCase().startsWith(filterValue) ||
             data.telefono.toLowerCase().startsWith(filterValue);
    };

    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value || '';
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

    cargarRegistro(): void {
      this.ServEstudiantesService.getEstudiantes().subscribe( ( data: Estudiantes[] ) => {
        this.estudiantes = data;
        this.estudiantesFiltrados = data;
        this.dataSource.data = data;
      })
    }

    filtrarEstudiantes(texto: string): void {
      const filtro = texto.trim().toLowerCase();
      this.estudiantesFiltrados = this.estudiantes.filter(estudiante =>
        estudiante.estudianteNombre.toLowerCase().includes(filtro) ||
        estudiante.telefono.toLowerCase().includes(filtro)
      );
    }

  
    search( searchInput: HTMLInputElement ) {
        if( searchInput.value ){
        this.ServEstudiantesService.getEstudiantesSearch( searchInput.value ).subscribe( ( data: Estudiantes[] ) => {
        this.dataSource.data = data;
        } );
      }
      else{
        this.cargarRegistro();
      }
    }
  
    onSubmit(): void {
    if (this.estudiantesForm.invalid) return;
    const formValue = this.estudiantesForm.value;
  
    if (this.editandoEstudiantes) {
      const actualizado: Estudiantes = {
        ...this.editandoEstudiantes,
        estudianteNombre: formValue.estudianteNombre,
        nombreEvento: formValue.nombreEvento,
        telefono: formValue.telefono,
        email: formValue.email,
        edad: formValue.edad,
        fecha: new Date().toISOString(),
        aceptoTerminos: formValue.aceptoTerminos
      };
  
      this.ServEstudiantesService.actualizarEstudiantes(actualizado).subscribe(() => {
        alert('Actualización realizada con éxito');
        this.editandoEstudiantes = null;
        this.estudiantesForm.reset({
          estudianteNombre: '',
          nombreEvento: '',
          telefono: '',
          email: '',
          edad: '',
          aceptoTerminos: true
        });
        this.cargarRegistro();
      });
  
    } else {
      const nuevoRegistro: Estudiantes = {
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
        alert('Registro realizado con éxito');
        this.estudiantesForm.reset({
          estudianteNombre: '',
          nombreEvento: '',
          telefono: '',
          email: '',
          edad: '',
          aceptoTerminos: true
        });
        this.cargarRegistro();
      });
    }
  }
  
  
    editarRegistro(estudiantes: Estudiantes): void {
    this.editandoEstudiantes = estudiantes;
    this.estudiantesForm.setValue({
      id: estudiantes.id,
      estudianteNombre: estudiantes.estudianteNombre,
      nombreEvento: estudiantes.nombreEvento,
      telefono: estudiantes.telefono,
      email: estudiantes.email,
      edad: estudiantes.edad,
      aceptoTerminos: estudiantes.aceptoTerminos ?? true
    });
  }
  
    cancelarEdicion(): void {
      this.editandoEstudiantes = null;
      this.estudiantesForm.reset({
        estudianteNombre: '',
        nombreEvento: '',
        telefono: '',
        email: '',
        edad: '',
        aceptoTerminos: true
      });
    }
  
    eliminarRegistro(estudiantes: Estudiantes): void {
    const confirmation = confirm(`¿Está seguro de eliminar el comentario de ${estudiantes.estudianteNombre}?`);
    if (confirmation) {
      this.ServEstudiantesService.eliminarEstudiantes(estudiantes).subscribe({
        next: () => {
          alert('Comentario eliminado exitosamente');
        },
        error: () => {
          alert('Error al eliminar el comentario');
        }
      });
      this.cargarRegistro();
    }
  }
  
    nombreValido(control: AbstractControl): ValidationErrors | null {
      const valor = control.value;
      if (valor && !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
        return { nombreInvalido: true };
      }
      return null;
    }
  
    aceptaTerminosValidator(control: AbstractControl): ValidationErrors | null {
      return control.value === true ? null : { aceptaTerminosRequerido: true };
    }
  }