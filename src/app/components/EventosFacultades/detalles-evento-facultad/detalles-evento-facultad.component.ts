import { Component, inject, Inject, signal } from '@angular/core';
import { EventoFacultad } from '../../../models/eventoFacultad';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Comentario } from '../../../models/comentario';
import { ServComentariosService } from '../../../services/Comentarios/serv-comentarios.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComentarioComponent } from '../../Comentarios/comentario/comentario.component';
import { AgregarEditarComentarioComponent } from '../../Comentarios/agregar-editar-comentario/agregar-editar-comentario.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';

@Component({
  selector: 'app-detalles-evento-facultad',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatTooltipModule,
    AgregarEditarComentarioComponent,
    ComentarioComponent,
    CurrencyPipe,
    UpperCasePipe,
    DatePipe,
    NgClass
],
  templateUrl: './detalles-evento-facultad.component.html',
  styleUrl: './detalles-evento-facultad.component.css'
})
export class DetallesEventoFacultadComponent {
  private comentariosService = inject( ServComentariosService );
  private snackBarNotification = inject( SnackbarNotificationService );
  public isAttendButtonHovering = false;
  comentarios: Comentario[] = [];
  comentariosDescMode = signal( true );

  constructor(
    public dialogRef: MatDialogRef<DetallesEventoFacultadComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: {
      eventoFacultad: EventoFacultad,
      categoriaName: string,
      facultadName: string,
      modoGestion: boolean,
      asistenciaMarcada: boolean | undefined
    }
  ) {}

  ngOnInit() {
    if ( !this.data.modoGestion )
      this.loadComentarios();
  }

  loadComentarios() { // By default in Descending Order
    this.comentariosService.getComentariosOfEvento( 1, this.data.eventoFacultad.id ).subscribe({
      next: ( comentarios: Comentario[] ) => {
        this.comentarios = comentarios;
        this.sortComments();
      },
      error: ( err ) => this.snackBarNotification.openCustomNotification( 'Oopss', `Hubo un error al obtener los comentarios, informe al administrador del sistema por favor. ${err}`, 'error' )
    });
  }

  toggleCommentsOrder() {
    this.comentariosDescMode.set( !this.comentariosDescMode() );
    this.sortComments();
  }

  sortComments() {
    if ( this.comentarios ) {
      this.comentarios.sort( ( a, b ) => { //Sorting comments using a ternary
        return this.comentariosDescMode() ?
          this.getTotalMilisecondsTime( b.fechaComentado ) - this.getTotalMilisecondsTime( a.fechaComentado ) :
          this.getTotalMilisecondsTime( a.fechaComentado ) - this.getTotalMilisecondsTime( b.fechaComentado );
      });
    }
  }

  getTotalMilisecondsTime( storedDate: string ): number {
    return new Date( storedDate ).getTime();
  }

  onCommentAddedUpdated() {
    this.loadComentarios();
  }

  editar(): void {
    this.dialogRef.close( this.data.eventoFacultad );
  }

  inscribirRemoverAsistencia() {
    this.dialogRef.close( true );
  }

  onCancel(): void {
    this.dialogRef.close( false );
  }

  onAttendBtnMouseEnter(): void {
    this.isAttendButtonHovering = true;
  }

  onAttendBtnMouseLeave(): void {
    this.isAttendButtonHovering = false;
  }

}
