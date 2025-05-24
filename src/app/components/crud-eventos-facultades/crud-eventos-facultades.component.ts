import { Component, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { EventoFacultad } from '../../models/eventoFacultad';
import { CardReutilizableComponent } from '../shared/card-reutilizable/card-reutilizable.component';
import { ServEventosFacultadesService } from '../../services/EventosFacultades/serv-eventos-facultades.service';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogReutilizableComponent } from '../shared/confirm-dialog-reutilizable/confirm-dialog-reutilizable.component';
import { CrearEditarEventoFacultadReutilizableComponent } from '../shared/crear-editar-evento-facultad-reutilizable/crear-editar-evento-facultad-reutilizable.component';

@Component({
  selector: 'app-crud-eventos-facultades',
  imports: [MatInputModule, MatIcon, MatBottomSheetModule, CardReutilizableComponent],
  templateUrl: './crud-eventos-facultades.component.html',
  styleUrl: './crud-eventos-facultades.component.css'
})
export class CrudEventosFacultadesComponent {

  eventosFacultades: EventoFacultad[] | null = null;
  private snackBar = inject( MatSnackBar );
  private addEventBottomSheet = inject( MatBottomSheet );

  constructor(
    private eventosFacultadesService: ServEventosFacultadesService,
    private confirmDialog: MatDialog
  ){}

  ngOnInit(): void {
    this.loadEventosFacultades();
  }

  loadEventosFacultades(): void {
    this.eventosFacultadesService.getEventosFacultades().subscribe( ( data: EventoFacultad[] ) => {
      this.eventosFacultades = data;
    });
  }

  search( searchInput: HTMLInputElement ) {
    if( searchInput.value ) {
      this.eventosFacultadesService.getSearchOnEventosFacultades( searchInput.value.toLocaleLowerCase() ).subscribe( ( data: EventoFacultad[] ) => {
        this.eventosFacultades = data;
      });
    }
    else {
      this.loadEventosFacultades();
    }
  }

  addEvento(): void {
    const addedEventBottomSheetRef =  this.addEventBottomSheet.open( CrearEditarEventoFacultadReutilizableComponent, {
      data: { eventoFacultad: undefined },
      panelClass: 'AddEventoBottomSheetClass'
    });

    addedEventBottomSheetRef.afterDismissed().subscribe( ( createdEvent: EventoFacultad | undefined ) => {
      if ( createdEvent ) {
        this.eventosFacultadesService.addEventoFacultad( createdEvent ).subscribe( () => {
        this.openSnackBar( "✅ Evento " + createdEvent.nombre + " creado exitosamente 😊✨", 'snackbar-success' );
        this.loadEventosFacultades();
      } );
      }
    });
  }

  editEvento( eventoFacultad: EventoFacultad ) {
    this.eventosFacultadesService.editEventoFacultad( eventoFacultad ).subscribe( () => {
      this.openSnackBar( "✅ Evento actualizado exitosamente 💫", 'snackbar-success' );
      this.loadEventosFacultades();
    } );
  }

  deleteEvento( eventoFacultad: EventoFacultad ) {
    const dialogRef = this.confirmDialog.open( ConfirmDialogReutilizableComponent, {
      data: {
        title: 'Eliminar Evento',
        message: `¿Esta seguro de eliminar el evento ${ eventoFacultad.nombre }?`
      }
    } );

    dialogRef.afterClosed().subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.eventosFacultadesService.deleteEventoFacultad( eventoFacultad ).subscribe( () => {
          this.openSnackBar( "Evento " + eventoFacultad.nombre + " eliminado exitosamente", 'snackbar-success' );
          this.loadEventosFacultades();
        } );
      }
    } );
  }

  openSnackBar( message: string, type: string ) {
    this.snackBar.open( message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }
}
