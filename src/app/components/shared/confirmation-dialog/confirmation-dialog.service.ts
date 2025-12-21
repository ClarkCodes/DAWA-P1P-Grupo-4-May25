import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  private confirmationDialog = inject( MatDialog );

  constructor() {}

  /**
   * Abre un diálogo de confirmación con los parámetros indicados
   * @param title Título del cuadro de diálogo
   * @param message Mensaje a mostrar al usuario
   * @returns true si el usuario responde afirmativamente solo si da click en el botón de confirmación, false de cualquier otra forma
   */
  public openConfirmation( title: string, message: string ): Observable<boolean | undefined> {
    const confirmationDialogRef = this.confirmationDialog.open( ConfirmationDialogComponent, {
      data: {
        title: title,
        message: message
      },
      panelClass: 'GlassmorphicFitDialog'
    });

    return confirmationDialogRef.afterClosed();
  }
}
