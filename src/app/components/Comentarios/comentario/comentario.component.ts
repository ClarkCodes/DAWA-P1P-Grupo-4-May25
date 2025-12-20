import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Comentario, ComentarioAccountData } from '../../../models/comentario';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { Cuenta } from '../../../models/cuenta';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { CcStarRatingComponent } from '../../shared/cc-star-rating/cc-star-rating.component';
import { ServComentariosService } from '../../../services/Comentarios/serv-comentarios.service';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { AgregarEditarComentarioComponent } from '../agregar-editar-comentario/agregar-editar-comentario.component';
import { TimeAgoPipe } from '../../../utils/time-ago.pipe';

@Component({
  selector: 'app-comentario',
  imports: [
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    DatePipe,
    TimeAgoPipe,
    CcStarRatingComponent,
    AgregarEditarComentarioComponent,
  ],
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.css'
})
export class ComentarioComponent {
  private cuentasService = inject( CuentasService );
  private comentariosService = inject( ServComentariosService );
  private snackBarNotification = inject( SnackbarNotificationService ); // Shared SnackBar para notificaciones consistentes en todo el sitio
  private confirmDialog = inject( ConfirmationDialogService );
  comentarioAccountData: ComentarioAccountData | undefined;
  isLoggedInUserPropietary: boolean = false;
  isCommentOnEditMode: boolean = false;
  @Input() comentario: Comentario | undefined;
  @Output() commentAddedUpdated = new EventEmitter<void>(); // Emit the updated Event

  constructor(){}

  ngOnInit() {
    this.loadAccountData();
    this.checkPropietary();
  }

  loadAccountData() {
    if ( this.comentario ) {
      this.cuentasService.getCuentaById( this.comentario?.idCuenta as number ).subscribe( ( cuenta: Cuenta[] | null ) => {
        if( cuenta ) {
          const cuentaData = cuenta[0] as Cuenta;

          this.comentarioAccountData = {
            idCuenta: cuentaData.id,
            nombre: cuentaData.nombre,
            fotoPerfilUrl: cuentaData.fotoPerfilUrl
          };
        }
      });
    }
  }

  checkPropietary() {
    this.cuentasService.usuarioLogueado$.subscribe( ( usuarioLogueado: Cuenta | null ) => {
      if( usuarioLogueado && this.comentario ) {
        this.isLoggedInUserPropietary = usuarioLogueado.id === this.comentario.idCuenta;
      }
    });
  }

  editComment() {
    this.isCommentOnEditMode = true;
  }

  editCanceled() {
    this.isCommentOnEditMode = false;
  }

  onCommentAddedUpdated() {
    this.isCommentOnEditMode = false;
    this.commentAddedUpdated.emit(); // Emit the created or updated Comment kind of signal pulse
  }

  deleteComment() {
    this.confirmDialog.openConfirmation( 'Eliminar comentario', '¿Está seguro de eliminar este comentario?' ).subscribe( ( result: boolean | undefined ) => {
      if ( result && this.comentario && this.isLoggedInUserPropietary ) {
        this.comentariosService.eliminarComentario( this.comentario.id ).subscribe( () => {
          this.snackBarNotification.openCustomNotification( 'Eliminado', 'Comentario eliminado exitosamente 👌🏼⭕', 'success' );
        });
      }
    });
  }
}
