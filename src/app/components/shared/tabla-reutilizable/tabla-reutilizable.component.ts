import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Cuentas } from '../../../models/cuentas';
import { CuentasService } from '../../../services/SigninLogin/cuentas.service';

@Component({
  selector: 'app-tabla-reutilizable',
  imports: [MatTableModule, MatPaginatorModule, MatInputModule, MatIcon],
  templateUrl: './tabla-reutilizable.component.html',
  styleUrl: './tabla-reutilizable.component.css'
})
export class TablaReutilizableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'email', 'password', 'facultad', 'rol', 'actions'];
  dataSource = new MatTableDataSource<Cuentas>();

  @ViewChild( MatPaginator ) paginator!: MatPaginator;

  constructor( private cuentasService: CuentasService ){}

  ngOnInit(): void {
    this.loadCuentas();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCuentas(): void{
    this.cuentasService.getCuentas().subscribe( ( data: Cuentas[] ) => {
      this.dataSource.data = data;
    });
  }

  edit(_t68: any) {
    throw new Error('Method not implemented.');
  }

  delete( cuenta: Cuentas ) {
    const confirmation = confirm( `Esta seguro de eliminar la cuenta ${ cuenta.nombre }?` );

    if( confirmation )
      this.cuentasService.deleteCuentas( cuenta ).subscribe( () => {
        alert( "Cuenta eliminada exitosamente" );
        this.loadCuentas();
      } );
  }

}
