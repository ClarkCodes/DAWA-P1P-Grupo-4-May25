import { Component, Inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snackbar-notification',
  imports:[MatIconModule],
  template: `
    <div class="NotificationContainer" [style.--noti-type]="data?.type">
      <button class="CloseButton" aria-label="Cerrar notificación" (click)="closeCustomSnackbarNotification()">
        <mat-icon [class]="getIconStylesClassName( data?.icon )" style="font-size: 20px;" >close</mat-icon>
      </button>
      <div class="IconBgClass">
        <mat-icon [class]="getIconStylesClassName( data?.icon )" >{{ data?.icon }}</mat-icon>
      </div>
      <div class="NotificationContent">
        <span class="TitleClass">{{ data?.title }}</span>
        <div class="MessageClass"><p>{{ data?.message }}</p></div>
      </div>
    </div>
  `,
  styleUrls: ['./snackbar-notification-styles.css']
})

export class SnackBarNotification {
  constructor(
    @Inject( MAT_SNACK_BAR_DATA ) public data?: { icon: string, title: string, message: string, type: string },
    private snackBarRef?: MatSnackBarRef<SnackBarNotification>
  ){}

  protected closeCustomSnackbarNotification() {
    this.snackBarRef?.dismiss();
  }

  protected getIconStylesClassName( icon: string | undefined ): string {
      switch ( icon ) {
      case 'check':
        return 'custom-snackbar-icon-success';
      case 'dangerous':
        return 'custom-snackbar-icon-error';
      case 'gpp_maybe':
        return 'custom-snackbar-icon-warning';
      default:
        return '';
    }
  }
}
