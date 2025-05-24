import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServComentariosService } from '../../services/serv-comentarios.service';
import { Comentario } from '../../models/comentarios';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatRadioButton } from '@angular/material/radio';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogContent,
    MatRadioButton,
    MatRadioGroup,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit{
  comentarios: Comentario[] = [];
  comentariosFiltrados: Comentario[] = [];
  comentarioForm: FormGroup;
  editandoComentario: Comentario | null = null;
  dataSource = new MatTableDataSource<Comentario>();
  searchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private servComentariosService: ServComentariosService
  ) {
    this.comentarioForm = this.fb.group({
      id: [{ value: '', disabled: true }], 
      estudianteNombre: ['', [Validators.required, Validators.maxLength(50), this.nombreValido]],
      nombreEvento: ['', Validators.required],
      experiencia: ['', Validators.required],
      mensaje: ['', Validators.required],
      aceptoTerminos: [true, this.aceptaTerminosValidator]
    });
  }

  ngOnInit(): void {
    this.cargarComentarios();
    this.searchControl.valueChanges.subscribe(value => {
      this.filtrarComentario(value || '');
    });
  }

  filtrarComentario(texto: string): void {
    const filtro = texto.trim().toLowerCase();
    this.comentariosFiltrados = this.comentarios.filter(comentario =>
      comentario.estudianteNombre.toLowerCase().includes(filtro)
    );
  }

  cargarComentarios(): void {
    this.servComentariosService.getComentarios().subscribe( ( data: Comentario[] ) => {
      this.comentarios = data;
      this.comentariosFiltrados = data; 
    });
  }

  search( searchInput: HTMLInputElement ) {
    if( searchInput.value ){
      this.servComentariosService.getComentariosSearch( searchInput.value ).subscribe( ( data: Comentario[] ) => {
      this.dataSource.data = data;
      } );
    }
    else{
      this.cargarComentarios();
    }
  }

  onSubmit(): void {
  if (this.comentarioForm.invalid) return;

  const formValue = this.comentarioForm.value;

  if (this.editandoComentario) {
    const actualizado: Comentario = {
      ...this.editandoComentario,
      estudianteNombre: formValue.estudianteNombre,
      nombreEvento: formValue.nombreEvento,
      experiencia: formValue.experiencia,
      mensaje: formValue.mensaje,
      fecha: new Date().toISOString(),
      aceptoTerminos: formValue.aceptoTerminos
    };

    this.servComentariosService.actualizarComentario(actualizado).subscribe(() => {
      alert('Actualización realizada con éxito');
      this.editandoComentario = null;
      this.comentarioForm.reset({
        estudianteNombre: '',
        nombreEvento: '',
        experiencia: '',
        mensaje: '',
        aceptoTerminos: true
      });
      this.cargarComentarios();
    });

  } else {
    const nuevoComentario: Comentario = {
      id: formValue.id,
      estudianteNombre: formValue.estudianteNombre,
      nombreEvento: formValue.nombreEvento,
      experiencia: formValue.experiencia,
      mensaje: formValue.mensaje,
      fecha: new Date().toISOString(),
      aceptoTerminos: formValue.aceptoTerminos
    };

    this.servComentariosService.agregarComentario(nuevoComentario).subscribe(() => {
      alert('Registro realizado con éxito');
      this.comentarioForm.reset({
        estudianteNombre: '',
        nombreEvento: '',
        experiencia: '',
        mensaje: '',
        aceptoTerminos: true
      });
      this.cargarComentarios();
    });
  }
}


  editarComentario(comentario: Comentario): void {
  this.editandoComentario = comentario;
  this.comentarioForm.setValue({
    id: comentario.id,
    estudianteNombre: comentario.estudianteNombre,
    nombreEvento: comentario.nombreEvento,
    experiencia: comentario.experiencia,
    mensaje: comentario.mensaje,
    aceptoTerminos: comentario.aceptoTerminos ?? true
  });
}

  cancelarEdicion(): void {
    this.editandoComentario = null;
    this.comentarioForm.reset({
      estudianteNombre: '',
      nombreEvento: '',
      experiencia: '',
      mensaje: '',
      aceptoTerminos: true
    });
  }

  eliminarComentario(comentario: Comentario): void {
  const confirmation = confirm(`¿Está seguro de eliminar el comentario de ${comentario.estudianteNombre}?`);
  if (confirmation) {
    this.servComentariosService.eliminarComentario(comentario).subscribe({
      next: () => {
        alert('Comentario eliminado exitosamente');
      },
      error: () => {
        alert('Error al eliminar el comentario');
      }
    });
    this.cargarComentarios();
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