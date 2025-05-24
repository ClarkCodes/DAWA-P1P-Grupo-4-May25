import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-reutilizable',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './confirm-dialog-reutilizable.component.html',
  styleUrl: './confirm-dialog-reutilizable.component.css'
})
export class ConfirmDialogReutilizableComponent {

   constructor(
    public dialogRef: MatDialogRef<ConfirmDialogReutilizableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

   onConfirm(): void {
    this.dialogRef.close( true );
  }

  onCancel(): void {
    this.dialogRef.close( false );
  }
}
