import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventosService, ClubCuenta } from '../../services/crud-eventos-clubes.service';
import { Evento } from '../../models/crud-eventos-clubes.model';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-crud-eventos-clubes',
  standalone: true,
  templateUrl: './crud-eventos-clubes.component.html',
  styleUrls: ['./crud-eventos-clubes.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class EventosComponent implements OnInit {
  loggedClubName: string = 'UG Emprende';
  eventoForm!: FormGroup;
  eventos: Evento[] = [];
  clubes: ClubCuenta[] = [];
  clubLogueado: ClubCuenta | null = null;
  editarModo: boolean = false;
  idEventoEditando: number | null = null;
  imagenPreview: string = '';
  categorias: string[] = [];
  displayedColumns: string[] = [
    'titulo', 'descripcion', 'categoria', 'fecha',
    'esGratuito', 'costo', 'lugar', 'nombreClub', 'aficheUrl', 'etiquetas', 'acciones'
  ];

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarClubes();
    this.cargarCategoriasEventos();
    this.cargarEventos();
  }

  inicializarFormulario(): void {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      fecha: ['', Validators.required],
      esGratuito: [true, Validators.required],
      costo: [{ value: null, disabled: true }],
      lugar: ['', Validators.required],
      nombreClub: ['', Validators.required],
      aficheUrl: ['', Validators.required],
      etiquetas: ['', Validators.required]
    });

    this.eventoForm.get('esGratuito')?.valueChanges.subscribe(valor => {
      const costoControl = this.eventoForm.get('costo');
      if (valor === false) {
        costoControl?.enable();
        costoControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        costoControl?.disable();
        costoControl?.reset(null);
        costoControl?.clearValidators();
      }
      costoControl?.updateValueAndValidity();
    });

    this.eventoForm.get('aficheUrl')?.valueChanges.subscribe(url => {
      this.imagenPreview = url;
    });
  }

  cargarClubes(): void {
    this.eventosService.obtenerClubes().subscribe(clubes => {
      this.clubes = clubes;
      this.clubLogueado = this.clubes[0];
      if (this.clubLogueado) {
        this.eventoForm.patchValue({ nombreClub: this.clubLogueado.nombre });
      }
    });
  }

  cargarCategoriasEventos(): void {
    this.eventosService.obtenerCategoriasDesdeEventos().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  cargarEventos(): void {
    this.eventosService.obtenerEventos().subscribe(eventos => {
      this.eventos = eventos;
    });
  }

  guardarEvento(): void {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      return;
    }

    const formValue = this.eventoForm.getRawValue();
    const fechaParaGuardar = formValue.fecha instanceof Date 
      ? formValue.fecha.toISOString().split('T')[0] 
      : formValue.fecha;

    const eventoToSave: Evento = {
      ...formValue,
      fecha: fechaParaGuardar,
      ...(this.editarModo && this.idEventoEditando !== null ? { id: this.idEventoEditando } : {})
    };

    if (this.editarModo && this.idEventoEditando !== null) {
      this.eventosService.actualizarEvento(eventoToSave).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarEventos();
          this.cargarCategoriasEventos();
        },
        error: (error) => console.error('Error al actualizar el evento:', error)
      });
    } else {
      delete eventoToSave.id;
      this.eventosService.agregarEvento(eventoToSave).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarEventos();
          this.cargarCategoriasEventos();
        },
        error: (error) => console.error('Error al crear el evento:', error)
      });
    }
  }

  editarEvento(evento: Evento): void {
    this.editarModo = true;
    this.idEventoEditando = evento.id ?? null;
    
    const fechaParaFormulario = typeof evento.fecha === 'string' 
      ? new Date(evento.fecha) 
      : evento.fecha;

    this.eventoForm.patchValue({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      categoria: evento.categoria,
      fecha: fechaParaFormulario,
      esGratuito: evento.esGratuito,
      costo: evento.costo,
      lugar: evento.lugar,
      nombreClub: evento.nombreClub,
      aficheUrl: evento.aficheUrl,
      etiquetas: evento.etiquetas
    });

    const costoControl = this.eventoForm.get('costo');
    if (!evento.esGratuito) {
      costoControl?.enable();
      costoControl?.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      costoControl?.disable();
      costoControl?.clearValidators();
    }
    costoControl?.updateValueAndValidity();
    
    this.imagenPreview = evento.aficheUrl ?? '';
    document.querySelector('.formulario-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  eliminarEvento(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.eventosService.eliminarEvento(id).subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.id !== id);
          this.cargarCategoriasEventos();
        },
        error: (err) => console.error('Error al eliminar evento:', err)
      });
    }
  }

  resetFormulario(): void {
    this.eventoForm.reset();
    this.imagenPreview = '';
    this.editarModo = false;
    this.idEventoEditando = null;
    this.eventoForm.patchValue({
      esGratuito: true,
      nombreClub: this.clubLogueado?.nombre ?? ''
    });
    this.eventoForm.get('costo')?.disable();
    this.eventoForm.get('costo')?.clearValidators();
    this.eventoForm.get('costo')?.updateValueAndValidity();
  }

  getRowClass(evento: Evento) {
    return {
      'highlighted': this.editarModo && this.idEventoEditando === evento.id
    };
  }
}