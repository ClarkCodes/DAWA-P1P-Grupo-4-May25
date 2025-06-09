import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UpperCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { EventoFacultad, EventosFacultadCategoria, Facultad } from '../../../models/eventoFacultad';
import { ServEventosFacultadesService } from '../../../services/EventosFacultades/serv-eventos-facultades.service';
import { DetallesEventoFacultadReutilizableComponent } from '../detalles-evento-facultad-reutilizable/detalles-evento-facultad-reutilizable.component';
import { Utils } from '../../shared/utils/utils';

@Component({
  selector: 'app-card-reutilizable',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatChipsModule, CurrencyPipe, UpperCasePipe, DatePipe],
  templateUrl: './card-reutilizable.component.html',
  styleUrl: './card-reutilizable.component.css'
})

export class CardReutilizableComponent implements OnInit {
  utils: Utils = new Utils();
  @Input() eventoFacultad: EventoFacultad | null = null;
  @Output() deleted = new EventEmitter<EventoFacultad>(); // Emit the deleted Event
  @Output() updated = new EventEmitter<EventoFacultad>(); // Emit the updated Event
  facultad: string = "";
  categoria: string = "";

  constructor(
    private eventosFacultadesService: ServEventosFacultadesService,
    private detailsDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setFacultadName();
    this.setCategoriaName();
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

  onAficheImageError( event: Event ){
    this.utils.onImageError( event.target as HTMLImageElement );
  }

  verDetalles() {
    const detailsDialogRef = this.detailsDialog.open( DetallesEventoFacultadReutilizableComponent, {
      data: {
        eventoFacultad: this.eventoFacultad,
        categoriaName: this.categoria,
        facultadName: this.facultad
      },
      panelClass: 'EventoDetailsDialogClass'
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
}
