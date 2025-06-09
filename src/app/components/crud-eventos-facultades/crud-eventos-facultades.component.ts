import { Component } from '@angular/core';
import { EventoFacultad } from '../../models/eventoFacultad';
import { ServEventosFacultadesService } from '../../services/EventosFacultades/serv-eventos-facultades.service';
import { CardReutilizableComponent } from '../EventosFacultades/card-reutilizable/card-reutilizable.component';
import { ConfirmDialogReutilizableComponent } from '../shared/confirm-dialog-reutilizable/confirm-dialog-reutilizable.component';
import { CrearEditarEventoFacultadReutilizableComponent } from '../EventosFacultades/crear-editar-evento-facultad-reutilizable/crear-editar-evento-facultad-reutilizable.component';
import { SnackBarNotification } from '../shared/snackbar-notification/snackbar-notification';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-crud-eventos-facultades',
  standalone: true,
  imports: [MatInputModule, MatIcon, MatTooltipModule, CardReutilizableComponent],
  templateUrl: './crud-eventos-facultades.component.html',
  styleUrl: './crud-eventos-facultades.component.css'
})

export class CrudEventosFacultadesComponent {
  private snackBar: SnackBarNotification = new SnackBarNotification();
  private searchingSubject = new Subject<string>();
  eventosFacultades: EventoFacultad[] | null = null;
  searchToolTipMsj: string = "Puedes buscar por: Nombre del evento, Organizador externo, Área, Dirección, Lugar, Sitio web, Telefono de Contacto y Etiquetas";

  constructor(
    private eventosFacultadesService: ServEventosFacultadesService,
    private confirmDialog: MatDialog,
    private createOrEditEventDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEventosFacultades();
    this.registerSearchingSubjectFunction();
  }

  ngOnDestroy(): void {
    this.searchingSubject.complete();
  }

  loadEventosFacultades(): void {
    this.eventosFacultadesService.getEventosFacultades().subscribe( ( data: EventoFacultad[] ) => {
      this.eventosFacultades = data;
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
      const eventoId = Number( evento.id );
      if( eventoId > topId )
        topId = eventoId;
    } );

    return topId;
  }

  addEvento(): void {
    const createEventDialogRef = this.createOrEditEventDialog.open( CrearEditarEventoFacultadReutilizableComponent, {
      data: { eventoFacultad: null },
      panelClass: 'CreateOrEditEventDialogClass'
    });

    createEventDialogRef.afterClosed().subscribe( ( createdEvent: EventoFacultad | undefined ) => {
      if ( createdEvent ) {
        createdEvent.id = String( ( this.getTopId() + 1 ) );

        this.eventosFacultadesService.addEventoFacultad( createdEvent ).subscribe( () => {
          this.loadEventosFacultades();
          this.snackBar.openSnackBar( "✅ Evento " + createdEvent.nombre + " creado exitosamente 😊✨", 'success' );
        });
      }
    });
  }

  updateEvento( eventoFacultadToUpdate: EventoFacultad ) {
    const updateEventDialogRef = this.createOrEditEventDialog.open( CrearEditarEventoFacultadReutilizableComponent, {
      data: { eventoFacultad: eventoFacultadToUpdate },
      panelClass: 'CreateOrEditEventDialogClass'
    });

    updateEventDialogRef.afterClosed().subscribe( ( updatedEvent: EventoFacultad | undefined ) => {
      if ( updatedEvent ) {
        this.eventosFacultadesService.editEventoFacultad( updatedEvent ).subscribe( () => {
          this.loadEventosFacultades();
          this.snackBar.openSnackBar( "✅ Evento " + updatedEvent.nombre + " actualizado exitosamente 💫", 'success' );
        } );
      }
    });
  }

  deleteEvento( eventoFacultad: EventoFacultad ) {
    const deleteConfirmationDialogRef = this.confirmDialog.open( ConfirmDialogReutilizableComponent, {
      data: {
        title: 'Eliminar Evento',
        message: `¿Esta seguro de eliminar el evento ${ eventoFacultad.nombre }?`
      },
      panelClass: 'DeleteConfirmationDialogClass'
    });

    deleteConfirmationDialogRef.afterClosed().subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.eventosFacultadesService.deleteEventoFacultad( eventoFacultad ).subscribe( () => {
          this.loadEventosFacultades();
          this.snackBar.openSnackBar( "👌 Evento '" + eventoFacultad.nombre + "' eliminado exitosamente", 'success' );
        } );
      }
    });
  }
}
