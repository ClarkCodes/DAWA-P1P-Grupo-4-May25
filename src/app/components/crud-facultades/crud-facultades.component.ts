import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Facultad } from '../../models/Facultad';
import { ServFacultadesService } from '../../services/serv-facultades.service';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-crud-facultades',
  imports: [MatTableModule, MatPaginatorModule, MatInputModule, MatIcon],
  templateUrl: './crud-facultades.component.html',
  styleUrl: './crud-facultades.component.css'
})

export class CrudFacultadesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'direccion', 'horarioAtencion', 'sitioWeb', 'telefono', 'actions'];
  dataSource = new MatTableDataSource<Facultad>();

  @ViewChild( MatPaginator ) paginator!: MatPaginator;

  constructor( private facultadesService: ServFacultadesService ){}

  ngOnInit(): void {
    this.loadFacultades();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadFacultades(): void{
    this.facultadesService.getFacultades().subscribe( ( data: Facultad[] ) => {
      this.dataSource.data = data;
    });
  }

  search( searchInput: HTMLInputElement ) {
    if( searchInput.value ){
      this.facultadesService.getFacultadesSearch( searchInput.value ).subscribe( ( data: Facultad[] ) => {
        this.dataSource.data = data;
      } );
    }
    else{
      this.loadFacultades();
    }
  }

  edit(_t68: any) {
    throw new Error('Method not implemented.');
  }

  delete( facultad: Facultad ) {
    const confirmation = confirm( `Esta seguro de eliminar la Facultad ${ facultad.nombre }?` );

    if( confirmation )
      this.facultadesService.deleteFacultad( facultad ).subscribe( () => {
        alert( "Facultad eliminada exitosamente" );
        this.loadFacultades();
      } );
  }

}
