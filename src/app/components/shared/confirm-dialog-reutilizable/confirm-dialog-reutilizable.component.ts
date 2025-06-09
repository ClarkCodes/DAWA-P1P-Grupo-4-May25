import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog-reutilizable',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle, MatButton, MatIcon],
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
