import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CcStarRatingComponent } from '../../shared/cc-star-rating/cc-star-rating.component';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';
import { ServComentariosService } from '../../../services/Comentarios/serv-comentarios.service';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { Comentario, ComentarioAccountData } from '../../../models/comentario';
import { generateNewId } from '../../../utils/utils';
import { Cuenta } from '../../../models/cuenta';
import { Router } from '@angular/router';
import { AVAILABLE_ROUTES } from '../../../utils/constants';

@Component({
  selector: 'app-agregar-editar-comentario',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CcStarRatingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './agregar-editar-comentario.component.html',
  styleUrl: './agregar-editar-comentario.component.css'
})
export class AgregarEditarComentarioComponent {
  private snackBarNotification = inject( SnackbarNotificationService ); // Shared SnackBar para notificaciones consistentes en todo el sitio
  private comentariosService = inject( ServComentariosService );
  private cuentasService = inject( CuentasService );
  private router = inject( Router );
  private fb = inject( FormBuilder );
  public isCommentFormFieldFocused: boolean = false;
  newOrEditingCommentForm!: FormGroup;
  usuarioLogueadoComentarioAccountData: ComentarioAccountData | undefined;
  isSessionLoggedIn: boolean = false;

  @Input() idTipoEvento: number = 1; // Tipo de Evento: 1 para Eventos de Facultades, 2 para Eventos de Clubes
  @Input() idEvento: number = 0; // ID del Evento al que se le va a agregar el comentario
  @Input() comentarioOnEdit: Comentario | undefined = undefined; // Comentario que se va a editar si se pasa como Input
  @Output() commentAddedUpdated = new EventEmitter<void>(); // Emit the updated Event
  @Output() commentEditCanceled = new EventEmitter<void>(); // Emit the updated Event

  ngOnInit() {
    this.loadUsuarioLogueadoComentarioAccountData()
    this.newOrEditingComentarioFormInit();
    this.checkSessionLoggedIn();
  }

  loadUsuarioLogueadoComentarioAccountData() {
    this.cuentasService.usuarioLogueado$.subscribe( ( usuarioLogueado: Cuenta | null ) => {
      if( usuarioLogueado ) {
        this.usuarioLogueadoComentarioAccountData = {
          idCuenta: usuarioLogueado.id,
          nombre: usuarioLogueado.nombre,
          fotoPerfilUrl: usuarioLogueado.fotoPerfilUrl
        };
      }
    });
  }

  checkSessionLoggedIn() {
    this.cuentasService.usuarioLogueado$.subscribe( ( cuenta: Cuenta | null ) => {
      this.isSessionLoggedIn = cuenta ? true : false;
    });
  }

  newOrEditingComentarioFormInit() {
    this.newOrEditingCommentForm = this.fb.group({
      mensaje: [ this.comentarioOnEdit?.mensaje ?? '' ],
      calificacion: [ this.comentarioOnEdit?.calificacion ?? 0 ]
    });
  }

  onSubmitComment() {
    if ( !this.newOrEditingCommentForm.valid )
      return;

    if ( this.comentarioOnEdit ) {
      const updatedComment: Partial<Comentario> = this.getCommentFormData();
      this.comentariosService.actualizarComentario( this.comentarioOnEdit.id, updatedComment as Partial<Comentario> ).subscribe( ( comentario: Comentario ) => {
        this.snackBarNotification.openCustomNotification( 'Comentario actualizado', 'Comentario actualizado exitosamente 👌🏼💫', 'success' );
      });
    }
    else {
      const newComment: Comentario = this.getCommentFormData() as Comentario;
      this.comentariosService.agregarComentario( newComment as Comentario ).subscribe( ( comentario: Comentario ) => {
        this.snackBarNotification.openCustomNotification( 'Comentario guardado', 'Comentario agregado exitosamente 👌🏼✨', 'success' );
      });
    }

    this.commentAddedUpdated.emit(); // Emit the created or updated Comment kind of signal pulse
    this.onCancelResetComment();
  }

  getCommentFormData(): Comentario | Partial<Comentario> {
    const newOrEditingCommentFormData = this.newOrEditingCommentForm.value;

    if ( this.comentarioOnEdit ) {
      const updatedComment: Partial<Comentario> = {
        calificacion: newOrEditingCommentFormData['calificacion'] ?? 0,
        mensaje: newOrEditingCommentFormData['mensaje'] ?? ''
      };

      return updatedComment;
    }

    const newComment: Comentario = {
      id: generateNewId<Comentario>( this.comentariosService.getComentarios() ) as number,
      idCuenta: this.usuarioLogueadoComentarioAccountData?.idCuenta ?? 0,
      idTipoEvento: this.idTipoEvento,
      idEvento: this.idEvento,
      calificacion: newOrEditingCommentFormData['calificacion'] ?? 0,
      mensaje: newOrEditingCommentFormData['mensaje'] ?? '',
      fechaComentado: new Date( Date.now() ).toJSON()
    }

    return newComment;
  }

  onCancelResetComment() {
    this.newOrEditingCommentForm.reset();
    this.commentEditCanceled.emit(); // Emit the cancel event
  }

  onCommentFormFieldFocus() {
    if( !this.isSessionLoggedIn ) {
      this.router.navigate( [AVAILABLE_ROUTES.get( 'login' )] );
      this.commentEditCanceled.emit(); // Emit the cancel event
      this.snackBarNotification.openCustomNotification( 'Sesión Requerida', 'Debe iniciar sesión para agregar un comentario a un evento', 'warning' );
      return;
    }

    this.isCommentFormFieldFocused = true;
  }

  onCommentFormFieldBlur() {
    this.isCommentFormFieldFocused = false;
  }
}
