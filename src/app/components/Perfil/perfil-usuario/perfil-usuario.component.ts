import { Component, inject } from '@angular/core';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';
import { Cuenta, Rol } from '../../../models/cuenta';
import { Facultad } from '../../../models/facultad';
import { Club } from '../../../models/eventoClub';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ActualizarPerfilInfoDialogComponent } from '../actualizar-perfil-info-dialog/actualizar-perfil-info-dialog.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CambiarContraseniaDialogComponent } from '../cambiar-contrasenia-dialog/cambiar-contrasenia-dialog.component';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DatePipe],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})

export class PerfilUsuarioComponent {
  public cuentasService = inject( CuentasService );
  private updateProfileDialog = inject( MatDialog );
  private confirmDialog = inject( ConfirmationDialogService );
  private snackBarNotification = inject( SnackbarNotificationService );
  private router = inject( Router );
  usuarioLogueado: Cuenta | null = null;
  rolUsuarioLogueado: Rol | null = null;
  nombreFacultad: string = '';
  nombreClub: string = '';

  ngOnInit() {
    this.cuentasService.usuarioLogueado$.subscribe( cuenta => {
      this.usuarioLogueado = cuenta;
    });

    this.cuentasService.rolUsuarioLogueado$.subscribe( rol => {
      this.rolUsuarioLogueado = rol;
    });

    if ( this.usuarioLogueado?.idFacultad ) {
      this.getNombreFacultad();
    }

    if ( this.usuarioLogueado?.idClub ) {
      this.getNombreClub();
    }
  }

  getNombreFacultad() {
    this.cuentasService.getFacultadById( this.usuarioLogueado?.idFacultad as string ).subscribe({
      next: ( facultad: Facultad[] ) => {
        if ( facultad.length > 0 ) {
          this.nombreFacultad = facultad[0].nombre;
        } else {
          console.error( 'No se encontró la facultad para la cuenta logueada.' );
        }
      },
      error: ( err ) => {
        console.error( 'Error al obtener la facultad: ', err );
      }
    } );
  }

  getNombreClub() {
    this.cuentasService.getClubById( this.usuarioLogueado?.idClub as string ).subscribe({
      next: ( club: Club[] ) => {
        if ( club.length > 0 ) {
          this.nombreClub = club[0].nombre;
        } else {
          console.error( 'No se encontró el club para la cuenta logueada.' );
        }
      },
      error: ( err ) => {
        console.error( 'Error al obtener el club: ', err );
      }
    } );
  }

  editarImagenPerfil() {
    // TODO: Pendiente de implementar una manera efectiva de subir una imagen desde el equipo del usuario y desde una url textual, ambas posibilidades, y subirla al backend para almacenarla con la informacion de perfil,  recuperarla cada vez que se inicia sesión y ponerla como imagen de perfil
  }

  actualizarInfoPerfil(): void {
    const updateProfileDialogRef = this.updateProfileDialog.open( ActualizarPerfilInfoDialogComponent, {
      data: { cuentaUsuario: this.usuarioLogueado },
      panelClass: 'GlassmorphicMidDialog'
    });

    updateProfileDialogRef.afterClosed().subscribe( ( cuentaUpdatedData: Partial<Cuenta> | undefined ) => {
      if ( cuentaUpdatedData ) {
        const cuentaId: number = this.usuarioLogueado?.id as number;

        this.cuentasService.updateCuenta( cuentaId, cuentaUpdatedData ).subscribe( () => {
          this.cuentasService.resetCuentaActualizada( cuentaId );
          this.snackBarNotification.openCustomNotification( "Perfil Actualizado", "Información de perfil actualizada exitosamente 💫", 'success' );
        } );
      }
    });
  }

  cambiarContrasenia() {
    const changePwdDialogRef = this.updateProfileDialog.open( CambiarContraseniaDialogComponent, {
      data: { cuentaUsuario: this.usuarioLogueado },
      panelClass: 'GlassmorphicMidDialog'
    });

    changePwdDialogRef.afterClosed().subscribe( ( cuentaUpdatedData: Partial<Cuenta> | undefined ) => {
      if ( cuentaUpdatedData ) {
        const cuentaId: number = this.usuarioLogueado?.id as number;

        this.cuentasService.updateCuenta( cuentaId, cuentaUpdatedData ).subscribe( () => {
          this.cuentasService.resetCuentaActualizada( cuentaId );
          this.snackBarNotification.openCustomNotification( "Cambio de Contraseña", "Contraseña actualizada exitosamente 💫", 'success' );
        } );
      }
    });
  }

  eliminarCuenta() {
    this.confirmDialog.openConfirmation( 'Eliminar cuenta', `Una vez realizada, esta acción no se podrá deshacer o revertir. \n\n¿Esta seguro eliminar su cuenta?` ).subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.cuentasService.deleteCuentas( this.usuarioLogueado as Cuenta ).subscribe( () => {
          this.cuentasService.logout();
          this.router.navigate(['/home']);
          this.snackBarNotification.openCustomNotification( "Cuenta eliminada", "Cuenta de usuario eliminada exitosamente", 'success' );
        } );
      }
    });
  }
}
