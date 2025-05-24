import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgClass, UpperCasePipe, CurrencyPipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { EventoFacultad, EventosFacultadCategoria } from '../../../models/eventoFacultad';
import { ServEventosFacultadesService } from '../../../services/EventosFacultades/serv-eventos-facultades.service';
import { DetallesEventoFacultadReutilizableComponent } from '../detalles-evento-facultad-reutilizable/detalles-evento-facultad-reutilizable.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card-reutilizable',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatChipsModule, CurrencyPipe, NgClass],
  templateUrl: './card-reutilizable.component.html',
  styleUrl: './card-reutilizable.component.css'
})

export class CardReutilizableComponent implements OnInit {
  private snackBar = inject( MatSnackBar );
  hoveredCardId: number | null = null;
  @Input() eventoFacultad: EventoFacultad | null = null;
  @Output() deleted = new EventEmitter<EventoFacultad>(); // emit the ID or the item
  facultad: string = "";
  categoria: string = "";

  constructor(
    private eventosFacultadesService: ServEventosFacultadesService,
    private detailsDialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setFacultadName();
    this.setCategoriaName();
  }

  setFacultadName(): void {
    this.facultad = this.eventosFacultadesService.getFacultadById( this.eventoFacultad!.facultadId );
  }

  setCategoriaName() {
    this.eventosFacultadesService.getCategorias().subscribe( ( data: EventosFacultadCategoria[] ) => {
      this.categoria = data.filter( categoria => categoria.id === this.eventoFacultad!.categoriaId )[0].nombre;
    });
  }

  verDetalles() {
    const detailsDialogRef = this.detailsDialog.open( DetallesEventoFacultadReutilizableComponent, {
      data: {
        eventoFacultad: this.eventoFacultad
      },
      panelClass: 'EventoDetailsDialogClass'
    } );

    detailsDialogRef.afterClosed().subscribe( ( result: boolean | undefined ) => {
      if ( result ) {
        this.router.navigate(['/crear-editar-eventos-facultades'], {
          state: { eventoFacultad: this.eventoFacultad }
        });
      }
    } );
  }

  eliminar(): void {
    this.deleted.emit( this.eventoFacultad! );
  }

  openSnackBar( message: string, type: string ) {
    this.snackBar.open( message, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }
}
