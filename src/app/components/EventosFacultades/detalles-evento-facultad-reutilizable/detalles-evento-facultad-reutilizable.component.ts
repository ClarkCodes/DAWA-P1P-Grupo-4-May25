import { Component, inject, Inject } from '@angular/core';
import { EventoFacultad } from '../../../models/eventoFacultad';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-detalles-evento-facultad-reutilizable',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe, UpperCasePipe, DatePipe],
  templateUrl: './detalles-evento-facultad-reutilizable.component.html',
  styleUrl: './detalles-evento-facultad-reutilizable.component.css'
})

export class DetallesEventoFacultadReutilizableComponent {
  constructor(
    public dialogRef: MatDialogRef<DetallesEventoFacultadReutilizableComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: { eventoFacultad: EventoFacultad, categoriaName: string, facultadName: string }
  ) {}

  editar(): void {
    this.dialogRef.close( this.data.eventoFacultad );
  }

  onCancel(): void {
    this.dialogRef.close( false );
  }
}
