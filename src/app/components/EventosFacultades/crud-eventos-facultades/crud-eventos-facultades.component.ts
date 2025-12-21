import { Component, inject } from '@angular/core';
import { EventoFacultad } from '../../../models/eventoFacultad';
import { ServEventosFacultadesService } from '../../../services/EventosFacultades/serv-eventos-facultades.service';
import { CardEventoFacultadComponent } from '../../EventosFacultades/card-evento-facultad/card-evento-facultad.component';
import { CrearEditarEventoFacultadComponent } from '../../EventosFacultades/crear-editar-evento-facultad/crear-editar-evento-facultad.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { SnackbarNotificationService } from '../../shared/snackbar-notification/snackbar-notification.service';

@Component({
  selector: 'app-crud-eventos-facultades',
  standalone: true,
  imports: [MatInputModule, MatIcon, MatTooltipModule, CardEventoFacultadComponent],
  templateUrl: './crud-eventos-facultades.component.html',
  styleUrl: './crud-eventos-facultades.component.css'
})

export class CrudEventosFacultadesComponent {
  private eventosFacultadesService = inject( ServEventosFacultadesService );
  private createOrEditEventDialog = inject( MatDialog );
  private confirmDialog = inject( ConfirmationDialogService );
  private snackBarNotification = inject( SnackbarNotificationService ); // Shared SnackBar para notificaciones consistentes en todo el sitio
  private searchingSubject = new Subject<string>();
  eventosFacultades: EventoFacultad[] | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadEventosFacultades();
    this.registerSearchingSubjectFunction();
  }

  ngOnDestroy(): void {
    this.searchingSubject.complete();
  }

  loadEventosFacultades(): void {
    this.eventosFacultadesService.getEventosFacultades().subscribe( ( eventos: EventoFacultad[] ) => {
      this.eventosFacultades = eventos;
    });
  }

  registerSearchingSubjectFunction() { // Funcion de Busqueda con un tiempo de espera a que el usuario termine de escribir para no buscar cada vez que se teclea sino solo una vez que el usuario termina de escribir
    this.searchingSubject.pipe( debounceTime( 250 ) ).subscribe( searchInput => {
      this.eventosFacultadesService.getSearchOnEventosFacultades( searchInput ).subscribe( ( data: EventoFacultad[] ) => {
        this.eventosFacultades = data;
      });
    });
  }

  search( searchInput: HTMLInputElement ) {
    if( searchInput.value ) {
      this.searchingSubject.next( searchInput.value.toLocaleLowerCase() );
    }
    else {
      this.loadEventosFacultades();
    }
  }

  getTopId(): number {
    let topId: number = 0;

    this.eventosFacultades?.forEach( evento => {
      if( evento.id > topId )
        topId = evento.id;
    } );

    return topId;
  }

  addEvento(): void {
    const createEventDialogRef = this.createOrEditEventDialog.open( CrearEditarEventoFacultadComponent, {
      data: { eventoFacultad: null },
      panelClass: 'GlassmorphicFullDialog'
    });

    createEventDialogRef.afterClosed().subscribe( ( createdEvent: EventoFacultad | undefined ) => {
      if ( createdEvent ) {
        createdEvent.id = this.getTopId() + 1;

        this.eventosFacultadesService.addEventoFacultad( createdEvent ).subscribe( () => {
          this.loadEventosFacultades();
          this.snackBarNotification.openCustomNotification( "Evento creado", createdEvent.nombre + " creado exitosamente 😊✨", 'success' );
        });
      }
    });
  }

  updateEvento( eventoFacultadToUpdate: EventoFacultad ) {
    const updateEventDialogRef = this.createOrEditEventDialog.open( CrearEditarEventoFacultadComponent, {
      data: { eventoFacultad: eventoFacultadToUpdate },
      panelClass: 'GlassmorphicFullDialog'
    });

    updateEventDialogRef.afterClosed().subscribe( ( updatedEvent: EventoFacultad | undefined ) => {
      if ( updatedEvent ) {
        this.eventosFacultadesService.editEventoFacultad( updatedEvent ).subscribe( () => {
          this.loadEventosFacultades();
          this.snackBarNotification.openCustomNotification( "Evento actualizado", "Evento " + updatedEvent.nombre + " actualizado exitosamente 💫", 'success' );
        } );
      }
    });
  }

  deleteEvento( eventoFacultad: EventoFacultad ) {
    this.confirmDialog.openConfirmation( 'Eliminar evento', `¿Esta seguro de eliminar el evento ${ eventoFacultad.nombre }?` ).subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.eventosFacultadesService.deleteEventoFacultad( eventoFacultad ).subscribe( () => {
          this.loadEventosFacultades();
          this.snackBarNotification.openCustomNotification( "Evento eliminado", "Evento '" + eventoFacultad.nombre + "' eliminado exitosamente 👌🏼", 'success' );
        } );
      }
    });
  }
}
