import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export class SnackBarNotification {
  private snackBar = inject( MatSnackBar ); // Inyeccion del Material Snackbar

  constructor(){}

  /**
   * Abre un componente Material Snackbar personalizado y estilizado con el mensaje y tipo de estilo especificados
   * @param message Mensaje a notificar al usuario
   * @param type Tipo de estilo de notificación a mostrar: success, warning o error
   */
  public openSnackBar( message: string, type: string ) {
    this.snackBar.open( message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
  }
}
