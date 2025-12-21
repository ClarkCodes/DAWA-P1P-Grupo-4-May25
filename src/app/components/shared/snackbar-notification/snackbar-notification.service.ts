import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarNotification } from './snackbar-notification.component';

@Injectable({ providedIn: 'root' })
export class SnackbarNotificationService {
  private snackBar = inject( MatSnackBar );

  constructor() {}

  // Firmas de 2 sobrecargas disponibles para el método de apertura del snackbar

  /**
   * Abre la version 2.0 del componente Material SnackBar 100% personalizado y estilizado con el titulo, mensaje y tipo de estilos especificados
   * @param title Título de la notificación
   * @param message Mensaje a notificar al usuario
   * @param type Tipo visual de los estilos de notificación a mostrar de entre los disponibles: ['success', 'warning', 'error']. Cada estilo tiene colores e ícono relacionados al tipo indicado
   */
  openCustomNotification( title: string, message: string, type: string ): void;
  /**
   * Abre la version 2.0 del componente Material SnackBar 100% personalizado y estilizado con el título, mensaje, tipo de estilos especificados y opciones de comportamiento disponibles
   * @param title Título de la notificación
   * @param message Mensaje a notificar al usuario
   * @param type Tipo visual de los estilos de notificación a mostrar de entre los disponibles: ['success', 'warning', 'error']. Cada estilo tiene colores e ícono relacionados al tipo indicado
   * @param options Objeto de parámetros de comportamiento disponibles para el funcionamiento del snackbar, tanto el objeto options como sus parámetros son opcionales.
   * Existen 3 parámetros disponibles dentro del objeto: duration, horizontalPosition y verticalPosition:
   *    - duration: Duración en milisegundos del snackbar, por defecto es 5000
   *    - horizontalPosition: Posición horizontal del snackbar entre las disponibles: ['center', 'left', right, 'start', 'end'], por defecto es 'center'
   *    - verticalPosition: Posición vertical del snackbar entre las disponibles: ['top', 'bottom'], por defecto es 'top'
   */
  openCustomNotification(
    title: string,
    message: string,
    type: string,
    options?: {
      duration?: number;
      horizontalPosition?: MatSnackBarHorizontalPosition;
      verticalPosition?: MatSnackBarVerticalPosition;
    }
  ): void;


  // Implementación única del método contemplando sus sobrecargas

  openCustomNotification(
    title: string,
    message: string,
    type: string,
    options?: {
      duration?: number;
      horizontalPosition?: MatSnackBarHorizontalPosition;
      verticalPosition?: MatSnackBarVerticalPosition;
    }
  ): void
  {
    this.snackBar.openFromComponent( SnackBarNotification, {
      data: {
        icon: this.getIconName( type ),
        title: title,
        message: message,
        type: type
      },
      duration: options?.duration ?? 5000,
      horizontalPosition: options?.horizontalPosition ?? 'center',
      verticalPosition: options?.verticalPosition ?? 'top',
      panelClass: [`snackbar-notification-${type}`]
    });
  }

  /**
   * Devuelve el nombre del ícono a usar por el componente mat-icon en el template del
   * SnackBarNotification en función del tipo de notificación especificado
   * @param type Tipo de notificación
   * @returns Nombre del ícono que correponde al tipo de notificación especificada
   */
  private getIconName( type: string ): string {
      switch ( type ) {
      case 'success':
        return 'check';
      case 'error':
        return 'dangerous';
      case 'warning':
        return 'gpp_maybe';
      default:
        return 'exclamation';
    }
  }
}
