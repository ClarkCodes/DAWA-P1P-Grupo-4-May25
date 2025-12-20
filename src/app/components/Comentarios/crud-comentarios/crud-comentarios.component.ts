import { Component , inject, OnInit } from '@angular/core';
import { ServComentariosService } from '../../../services/Comentarios/serv-comentarios.service';
import { Comentario } from '../../../models/comentario';
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
import { ReactiveFormsModule } from '@angular/forms';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { Cuenta } from '../../../models/cuenta';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';

@Component({
  selector: 'app-crud-comentarios',
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
  templateUrl: './crud-comentarios.component.html',
  styleUrl: './crud-comentarios.component.css'
})
export class CrudComentariosComponent implements OnInit {
  private confirmDialog = inject( ConfirmationDialogService );
  private snackBarNotification = inject( SnackbarNotificationService );
  comentarios: Comentario[] = [];
  comentariosFiltrados: Comentario[] = [];
  comentarioForm: FormGroup;
  editandoComentario: Comentario | null = null;
  dataSource = new MatTableDataSource<Comentario>();
  searchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private servComentariosService: ServComentariosService,
    private servCuentasService: CuentasService
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

  filtrarComentario( texto: string ): void {
    const filtro = texto.trim().toLowerCase();
    this.comentariosFiltrados = this.comentarios.filter( comentario =>
      //this.getNombreUsuario( comentario.idCuenta ).toLowerCase().includes( filtro )
      this.servCuentasService.getCuentaById( comentario.idCuenta ).subscribe( ( cuenta: Cuenta[] ) => {
        return ( cuenta.length > 0 ? cuenta[0].nombre : '' ).toLowerCase().includes( filtro );
      })
    );
  }

  getNombreUsuario( id: number ) {
    this.servCuentasService.getCuentaById( id ).subscribe( ( cuenta: Cuenta[] ) => {
      return cuenta.length > 0 ? cuenta[0].nombre : '';
    });
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
    if ( this.comentarioForm.invalid ) return;

    const formValue = this.comentarioForm.value;

    if ( this.editandoComentario ) {
      const comentarioActualizado: Partial<Comentario> = {
        calificacion: formValue.experiencia,
        mensaje: formValue.mensaje
      };

      this.servComentariosService.actualizarComentario( this.editandoComentario.id, comentarioActualizado ).subscribe(() => {
        alert('Actualización realizada con éxito');
        this.editandoComentario = null;
        this.comentarioForm.reset();
        this.cargarComentarios();
      });

    } else {
      const nuevoComentario: Comentario = {
        id: formValue.id,
        idCuenta: formValue.estudianteNombre,
        idTipoEvento: 1,
        idEvento: formValue.nombreEvento,
        calificacion: formValue.experiencia,
        mensaje: formValue.mensaje,
        fechaComentado: new Date().toISOString()
      };

      this.servComentariosService.agregarComentario(nuevoComentario).subscribe(() => {
        alert('Registro realizado con éxito');
        this.comentarioForm.reset({
          cuenta: '',
          evento: '',
          experiencia: '',
          mensaje: ''
        });
        this.cargarComentarios();
      });
    }
  }

  editarComentario( comentario: Comentario ): void {
    this.editandoComentario = comentario;
    this.comentarioForm.setValue({
      cuenta: comentario.idCuenta,
      evento: comentario.idEvento,
      calificacion: comentario.calificacion,
      mensaje: comentario.mensaje
    });
  }

  cancelarEdicion(): void {
    this.editandoComentario = null;
    this.comentarioForm.reset({
      cuenta: '',
      evento: '',
      experiencia: '',
      mensaje: ''
    });
  }

  eliminarComentario( comentario: Comentario ): void {
    this.confirmDialog.openConfirmation( 'Eliminar comentario', `¿Está seguro de eliminar el comentario de ${comentario.idCuenta}?` ).subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.servComentariosService.eliminarComentario( comentario.id ).subscribe({
          next: () => {
            this.snackBarNotification.openCustomNotification( "Eliminación", "Comentario eliminado exitosamente", 'success' );
          },
          error: () => {
            this.snackBarNotification.openCustomNotification( "Error", "Error al eliminar el comentario", 'error' );
          }
        });

        this.cargarComentarios();
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

  aceptaTerminosValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : { aceptaTerminosRequerido: true };
  }
}
