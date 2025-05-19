import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Evento } from '../../models/crud-eventos-clubes.model';
import { EventosService } from '../../services/crud-eventos-clubes.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-eventos',
  standalone: true,
  templateUrl: './crud-eventos-clubes.component.html',
  styleUrl: './crud-eventos-clubes.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule
  ]
})
export class EventosComponent implements OnInit {
  formularioEvento!: FormGroup;
  eventos: Evento[] = [];
  editando: boolean = false;
  idEditando: number | null = null;
  columnas: string[] = ['titulo', 'categoria', 'fecha', 'lugar', 'nombreClub', 'acciones'];

  // Simulación de login
  nombreClubActual: string = 'Club de Tecnología';

  constructor(
    private fb: FormBuilder,
    private servicio: EventosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.formularioEvento = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['Charla', Validators.required],
      otraCategoria: [''],
      fecha: ['', Validators.required],
      esGratuito: [true, Validators.required],
      costo: [{ value: '', disabled: true }, Validators.min(0)],
      cupoMaximo: [0, [Validators.required, Validators.min(1)]],
      lugar: ['', Validators.required],
      aficheUrl: [''],
      etiquetas: ['']
    });

    this.formularioEvento.get('esGratuito')?.valueChanges.subscribe(valor => {
      const costoControl = this.formularioEvento.get('costo');
      if (valor === false) {
        costoControl?.enable();
        costoControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        costoControl?.disable();
        costoControl?.clearValidators();
        costoControl?.setValue('');
      }
      costoControl?.updateValueAndValidity();
    });

    // Suscribirse a los cambios del servicio
    this.servicio.getEventos().subscribe((datos: Evento[]) => {
      this.eventos = datos;
    });
  }

  mostrarOtraCategoria(): boolean {
    return this.formularioEvento.get('categoria')?.value === 'Otro';
  }

  guardar() {
    if (this.formularioEvento.invalid) {
      this.snackBar.open('Por favor, completa todos los campos obligatorios.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const formData = this.formularioEvento.getRawValue();
    const categoriaFinal = formData.categoria === 'Otro' && formData.otraCategoria
      ? formData.otraCategoria
      : formData.categoria;

    const nuevoEvento: Evento = {
      ...formData,
      id: this.editando && this.idEditando ? this.idEditando : Date.now(),
      categoria: categoriaFinal,
      nombreClub: this.nombreClubActual,
      etiquetas: formData.etiquetas
        ? formData.etiquetas.split(',').map((e: string) => e.trim())
        : []
    };

    if (this.editando) {
      this.servicio.actualizarEvento(nuevoEvento);
      this.snackBar.open('Evento actualizado correctamente.', 'Cerrar', { duration: 3000 });
    } else {
      this.servicio.agregarEvento(nuevoEvento);
      this.snackBar.open('Evento agregado correctamente.', 'Cerrar', { duration: 3000 });
    }

    this.cancelar();
  }

  editar(evento: Evento) {
    if (evento.nombreClub !== this.nombreClubActual) {
      this.snackBar.open('Solo puedes editar eventos creados por tu club.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.editando = true;
    this.idEditando = evento.id;

    const esCategoriaOtra = !['Charla', 'Taller', 'Concurso', 'Seminario'].includes(evento.categoria);

    this.formularioEvento.patchValue({
      ...evento,
      categoria: esCategoriaOtra ? 'Otro' : evento.categoria,
      otraCategoria: esCategoriaOtra ? evento.categoria : '',
      etiquetas: evento.etiquetas?.join(', ') || ''
    });

    if (!evento.esGratuito) {
      this.formularioEvento.get('costo')?.enable();
    }
  }

  eliminar(id: number) {
    const evento = this.eventos.find(e => e.id === id);

    if (evento?.nombreClub !== this.nombreClubActual) {
      this.snackBar.open('Solo puedes eliminar eventos creados por tu club.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const confirmado = confirm('¿Estás seguro de que deseas eliminar este evento?');
    if (confirmado) {
      this.servicio.eliminarEvento(id);
      this.snackBar.open('Evento eliminado.', 'Cerrar', {
        duration: 3000
      });
    }
  }

  cancelar() {
    this.editando = false;
    this.idEditando = null;
    this.formularioEvento.reset({
      categoria: 'Charla',
      esGratuito: true
    });
    this.formularioEvento.get('costo')?.disable();
  }
}