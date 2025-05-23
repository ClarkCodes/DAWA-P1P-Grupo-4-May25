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
import { EventosService } from '../../services/crud-eventos-clubes.service';
import { Evento } from '../../models/crud-eventos-clubes.model';
import { ClubCuenta } from '../../services/crud-eventos-clubes.service';
import { MatRadioModule } from '@angular/material/radio';


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
    this.cargarClubLogueado();
    this.cargarEventos();
  }

  inicializarFormulario(): void {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      fecha: ['', Validators.required],
      esGratuito: ['si', Validators.required],
      costo: [{ value: '', disabled: true }, Validators.required],
      lugar: ['', Validators.required],
      nombreClub: ['', Validators.required],
      aficheUrl: ['', Validators.required],
      etiquetas: ['', Validators.required]
    });

    this.eventoForm.get('esGratuito')?.valueChanges.subscribe(valor => {
      const costoControl = this.eventoForm.get('costo');
      if (valor === 'no') {
        costoControl?.enable();
      } else {
        costoControl?.disable();
        costoControl?.reset();
      }
    });

    this.eventoForm.get('aficheUrl')?.valueChanges.subscribe(url => {
      this.imagenPreview = url;
    });
  }

  cargarClubLogueado(): void {
    this.eventosService.obtenerClubes().subscribe(clubes => {
      this.clubes = clubes;
      this.clubLogueado = this.clubes[0]; // Simulación: primer club
      if (this.clubLogueado) {
        this.eventoForm.patchValue({ nombreClub: this.clubLogueado.nombre });
      }
    });
  }

  cargarEventos(): void {
    this.eventosService.obtenerEventos().subscribe(eventos => {
      this.eventos = eventos;
    });
  }

  guardarEvento(): void {
    if (this.eventoForm.invalid) return;

    const nuevoEvento: Evento = {
      ...this.eventoForm.getRawValue(),
      id: this.idEventoEditando ?? Date.now()
    };

    if (this.editarModo && this.idEventoEditando !== null) {
      this.eventosService.actualizarEvento(nuevoEvento).subscribe(() => {
        const index = this.eventos.findIndex(e => e.id === this.idEventoEditando);
        if (index !== -1) this.eventos[index] = nuevoEvento;
        this.resetFormulario();
      });
    } else {
      this.eventosService.agregarEvento(nuevoEvento).subscribe((eventoCreado: Evento) => {
        this.eventos.push(eventoCreado);
        this.resetFormulario();
      });
    }
  } 
  editarEvento(evento: Evento): void { 
    this.editarModo = true;
    this.idEventoEditando = evento.id;
    this.eventoForm.patchValue(evento);
    if (!evento.esGratuito) {
      this.eventoForm.get('costo')?.enable();
    }
    this.imagenPreview = evento.aficheUrl ?? '';
}

  eliminarEvento(id: number): void {
    this.eventosService.eliminarEvento(id).subscribe(() => {
      this.eventos = this.eventos.filter(e => e.id !== id);
    });
  }

  resetFormulario(): void {
    this.eventoForm.reset();
    this.imagenPreview = '';
    this.editarModo = false;
    this.idEventoEditando = null;
    this.eventoForm.patchValue({
      esGratuito: 'si',
      nombreClub: this.clubLogueado?.nombre ?? ''
    });
    this.eventoForm.get('costo')?.disable();
  }
}