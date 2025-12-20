import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { UpperCasePipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { EventoFacultad, EventosFacultadCategoria } from '../../../models/eventoFacultad';
import { Facultad } from "../../../models/facultad";
import { ServEventosFacultadesService } from '../../../services/EventosFacultades/serv-eventos-facultades.service';
import { DetallesEventoFacultadComponent } from '../detalles-evento-facultad/detalles-evento-facultad.component';
import { generateNewId, onImageError } from '../../../utils/utils';
import { ServAsistenciaEventosService } from '../../../services/AsistenciaEventos/serv-asistencia-eventos.service';
import { AsistenciaEvento } from '../../../models/asistenciaEvento';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { AVAILABLE_ROUTES } from '../../../utils/constants';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';
import { Cuenta } from '../../../models/cuenta';

@Component({
  selector: 'app-card-evento-facultad',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatChipsModule, CurrencyPipe, UpperCasePipe, DatePipe, NgClass],
  templateUrl: './card-evento-facultad.component.html',
  styleUrl: './card-evento-facultad.component.css'
})

export class CardEventoFacultadComponent implements OnInit {
  private eventosFacultadesService = inject( ServEventosFacultadesService );
  private asistenciaEventosService = inject( ServAsistenciaEventosService );
  private cuentasService = inject( CuentasService );
  private snackBarNotification = inject( SnackbarNotificationService );
  private detailsDialog = inject( MatDialog );
  private confirmDialog = inject( ConfirmationDialogService );
  private router = inject( Router );
  @Input() eventoFacultad: EventoFacultad | null = null;
  @Input() modoGestion: boolean = false;
  @Input() asistenciaUsuario: AsistenciaEvento | undefined = undefined;
  @Output() deleted = new EventEmitter<EventoFacultad>(); // Emit the deleted Event
  @Output() updated = new EventEmitter<EventoFacultad>(); // Emit the updated Event
  @Output() asistirEvento = new EventEmitter<AsistenciaEvento>(); // Emit the Event Assistance Event
  @Output() eliminarAsistencia = new EventEmitter<number>(); // Emit the Event Assistance Event
  isSessionLoggedIn: boolean = false;
  isOnManagementUrl: boolean = false;
  facultad: string = "";
  categoria: string = "";

  public isAssistButtonHovering = false;

  constructor() {}

  ngOnInit(): void {
    this.setFacultadName();
    this.setCategoriaName();
    this.checkSessionLoggedIn();
    this.checkManagementUrl();
  }

  setFacultadName(): void {
    this.eventosFacultadesService.getFacultadById( this.eventoFacultad?.facultadId! ).subscribe( ( data: Facultad[] ) => {
      this.facultad = data.at( 0 )?.nombre ?? '';
    });
  }

  setCategoriaName() {
    this.eventosFacultadesService.getCategoriaById( this.eventoFacultad?.categoriaId! ).subscribe( ( data: EventosFacultadCategoria[] ) => {
      this.categoria = data.at( 0 )?.nombre ?? '';
    });
  }

  checkSessionLoggedIn() {
    this.cuentasService.usuarioLogueado$.subscribe( ( cuenta: Cuenta | null ) => {
      this.isSessionLoggedIn = cuenta ? true : false;
    });
  }

  checkManagementUrl() {
    this.isOnManagementUrl = this.router.url == '/crud-eventos-facultades';
  }

  goToManage() {
    this.router.navigate( [AVAILABLE_ROUTES.get( 'crudEventosFacultades' )] );
  }

  onAficheImageError( event: Event ){
    onImageError( event.target as HTMLImageElement );
  }

  verDetalles() {
    const detailsDialogRef = this.detailsDialog.open( DetallesEventoFacultadComponent, {
      data: {
        eventoFacultad: this.eventoFacultad,
        categoriaName: this.categoria,
        facultadName: this.facultad,
        modoGestion: true
      },
      panelClass: 'GlassmorphicFullDialog'
    } );

    detailsDialogRef.afterClosed().subscribe( ( updatedEventoFacultad: EventoFacultad | undefined ) => {
      if ( updatedEventoFacultad ) {
        this.updated.emit( updatedEventoFacultad );
      }
    } );
  }

  eliminar(): void {
    this.deleted.emit( this.eventoFacultad! );
  }

  verDetallesEventoVistaEstudiante() {
    const studentDetailsDialogRef = this.detailsDialog.open( DetallesEventoFacultadComponent, {
      data: {
        eventoFacultad: this.eventoFacultad,
        categoriaName: this.categoria,
        facultadName: this.facultad,
        modoGestion: false,
        asistenciaMarcada: ( this.asistenciaUsuario ? true : false )
      },
      panelClass: 'GlassmorphicFullDialog'
    } );

    studentDetailsDialogRef.afterClosed().subscribe( ( inscribirRemoverAsistencia: boolean | undefined ) => {
      if ( inscribirRemoverAsistencia ) {
        this.inscribirRemoverAsistenciaEvento();
      }
    } );
  }

  inscribirRemoverAsistenciaEvento() {
    if( !this.isSessionLoggedIn ) {
      this.router.navigate( [AVAILABLE_ROUTES.get( 'login' )] );
      this.snackBarNotification.openCustomNotification( 'Sesión Requerida', 'Debe iniciar sesión para inscribirse a un evento', 'warning' );
      return;
    }

    if ( !this.asistenciaUsuario ) {
      const asistencia = {
        id: generateNewId<AsistenciaEvento>( this.asistenciaEventosService.getAsistencias() ) as number,
        idCuenta: 0,
        idTipoEvento: 1,
        idEvento: this.eventoFacultad?.id as number,
        fechaInscripcion: new Date( Date.now() ).toJSON()
      }

      this.asistenciaUsuario = asistencia;
      this.asistirEvento.emit( asistencia );
    }
    else {
      this.confirmDialog.openConfirmation( 'Eliminar asistencia', `¿Esta seguro de eliminar su asistencia al evento${this.eventoFacultad?.nombre}?` ).subscribe( ( result: boolean | undefined ) => {
        if ( result ) {
          this.eliminarAsistencia.emit( this.asistenciaUsuario?.id );
          this.asistenciaUsuario = undefined;
        }
      });
    }
  }

  onMouseEnter(): void {
    this.isAssistButtonHovering = true;
  }

  onMouseLeave(): void {
    this.isAssistButtonHovering = false;
  }
}
