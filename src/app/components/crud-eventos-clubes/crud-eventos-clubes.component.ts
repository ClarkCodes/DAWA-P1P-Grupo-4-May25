import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Keep if used, otherwise can remove
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventosService, ClubCuenta } from '../../services/crud-eventos-clubes.service';
import { Evento } from '../../models/crud-eventos-clubes.model';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

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
  ]
})
export class EventosComponent implements OnInit {
  loggedClubName: string = 'UG Emprende'; // This should probably come from an authentication service in a real app
  eventoForm!: FormGroup;
  eventos: Evento[] = [];
  clubes: ClubCuenta[] = []; // Stores the list of club accounts
  clubLogueado: ClubCuenta | null = null; // Simulates the logged-in club's account
  editarModo: boolean = false;
  idEventoEditando: number | null = null;
  imagenPreview: string = '';
  categorias: string[] = []; // This array will hold unique categories obtained from events
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
    this.cargarClubes(); // Load club accounts (to set loggedClubName)
    this.cargarCategoriasEventos(); // Load categories from events for the dropdown
    this.cargarEventos(); // Load all existing events for the table
  }

  inicializarFormulario(): void {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required], // This will be populated dynamically
      fecha: ['', Validators.required],
      esGratuito: [true, Validators.required], // Initialize as boolean 'true'
      costo: [{ value: null, disabled: true }], // Initialize with null for number type, disabled
      lugar: ['', Validators.required],
      nombreClub: ['', Validators.required],
      aficheUrl: ['', Validators.required],
      etiquetas: ['', Validators.required]
    });

    // Subscribe to changes in 'esGratuito' to enable/disable 'costo' control
    this.eventoForm.get('esGratuito')?.valueChanges.subscribe(valor => {
      const costoControl = this.eventoForm.get('costo');
      if (valor === false) { // If 'esGratuito' is boolean `false` (not free)
        costoControl?.enable();
        costoControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else { // If 'esGratuito' is boolean `true` (free)
        costoControl?.disable();
        costoControl?.reset(null); // Reset to null for number type
        costoControl?.clearValidators();
      }
      costoControl?.updateValueAndValidity();
    });

    // Update image preview when aficheUrl changes
    this.eventoForm.get('aficheUrl')?.valueChanges.subscribe(url => {
      this.imagenPreview = url;
    });
  }

  // Method to load club accounts and identify the logged-in club (simulated)
  cargarClubes(): void {
    this.eventosService.obtenerClubes().subscribe(clubes => {
      this.clubes = clubes;
      // Simulate logging in as the first club for demonstration purposes
      this.clubLogueado = this.clubes[0];
      if (this.clubLogueado) {
        this.eventoForm.patchValue({ nombreClub: this.clubLogueado.nombre });
      }
    });
  }

  // Method to populate the 'categorias' array from existing events
  cargarCategoriasEventos(): void {
    this.eventosService.obtenerCategoriasDesdeEventos().subscribe(categorias => {
      this.categorias = categorias; // The service already sorts them
    });
  }

  // Method to load all events for the table
  cargarEventos(): void {
    this.eventosService.obtenerEventos().subscribe(eventos => {
      this.eventos = eventos;
    });
  }

  guardarEvento(): void {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    const formValue = this.eventoForm.getRawValue();

    // Handle date conversion from Date object (from mat-datepicker) to string (YYYY-MM-DD) for the model
    const fechaParaGuardar = formValue.fecha instanceof Date
      ? formValue.fecha.toISOString().split('T')[0]
      : formValue.fecha; // If it's already a string, use it directly (e.g., when editing)

    const nuevoEvento: Evento = {
      ...formValue, // Spread all form values
      fecha: fechaParaGuardar, // Use the converted date string
      id: this.idEventoEditando ?? Date.now() // Assign new ID or existing ID for update
    };

    if (this.editarModo && this.idEventoEditando !== null) {
      // Update existing event
      this.eventosService.actualizarEvento(nuevoEvento).subscribe(() => {
        const index = this.eventos.findIndex(e => e.id === this.idEventoEditando);
        if (index !== -1) {
          this.eventos[index] = nuevoEvento; // Update in local array
        }
        this.resetFormulario();
        this.cargarEventos(); // Reload events to ensure data consistency
        this.cargarCategoriasEventos(); // Refresh categories in case a new one was added/updated
      });
    } else {
      // Add new event
      this.eventosService.agregarEvento(nuevoEvento).subscribe((eventoCreado: Evento) => {
        this.eventos.push(eventoCreado); // Add to local array
        this.resetFormulario();
        this.cargarEventos(); // Reload events
        this.cargarCategoriasEventos(); // Refresh categories in case a new one was added
      });
    }
  }

  editarEvento(evento: Evento): void {
    this.editarModo = true;
    this.idEventoEditando = evento.id;

    // Convert date string from model to Date object for the datepicker to display correctly
    const fechaParaFormulario = typeof evento.fecha === 'string' ? new Date(evento.fecha) : evento.fecha;

    // Patch form with event data
    this.eventoForm.patchValue({
      ...evento,
      fecha: fechaParaFormulario, // Use the Date object for the form's date picker
    });

    // Adjust 'costo' control state and validators based on 'esGratuito' (which is boolean)
    if (evento.esGratuito === false) { // Correct comparison with boolean `false`
      this.eventoForm.get('costo')?.enable();
      this.eventoForm.get('costo')?.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      this.eventoForm.get('costo')?.disable();
      this.eventoForm.get('costo')?.clearValidators();
    }
    this.eventoForm.get('costo')?.updateValueAndValidity(); // Update validators and value
    this.imagenPreview = evento.aficheUrl ?? ''; // Set image preview
  }

  eliminarEvento(id: number): void {
    this.eventosService.eliminarEvento(id).subscribe(() => {
      this.eventos = this.eventos.filter(e => e.id !== id); // Remove from local array
      this.cargarEventos(); // Reload events
      this.cargarCategoriasEventos(); // Refresh categories after deletion
    });
  }

  resetFormulario(): void {
    this.eventoForm.reset(); // Resets all form controls
    this.imagenPreview = ''; // Clear image preview
    this.editarModo = false; // Exit edit mode
    this.idEventoEditando = null; // Clear editing ID
    // Set default values after reset
    this.eventoForm.patchValue({
      esGratuito: true, // Default to free
      nombreClub: this.clubLogueado?.nombre ?? '' // Set logged club name
    });
    // Ensure costo is disabled and validators are cleared when resetting to free
    this.eventoForm.get('costo')?.disable();
    this.eventoForm.get('costo')?.clearValidators();
    this.eventoForm.get('costo')?.updateValueAndValidity();
  }
}