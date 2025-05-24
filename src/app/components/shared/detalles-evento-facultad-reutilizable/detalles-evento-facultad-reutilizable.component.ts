import { Component, Inject } from '@angular/core';
import { EventoFacultad } from '../../../models/eventoFacultad';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { NgClass, CurrencyPipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-detalles-evento-facultad-reutilizable',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe],
  templateUrl: './detalles-evento-facultad-reutilizable.component.html',
  styleUrl: './detalles-evento-facultad-reutilizable.component.css'
})
export class DetallesEventoFacultadReutilizableComponent {
  constructor(
    public dialogRef: MatDialogRef<DetallesEventoFacultadReutilizableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventoFacultad: EventoFacultad }
  ) {}

  editar(): void {
    this.dialogRef.close( true );
  }

  onCancel(): void {
    this.dialogRef.close( false );
  }
}
