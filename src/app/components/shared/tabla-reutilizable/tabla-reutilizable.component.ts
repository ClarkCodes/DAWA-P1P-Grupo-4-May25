import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Cuentas } from '../../../models/cuentas';
import { CuentasService } from '../../../services/SigninLogin/cuentas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-reutilizable',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './tabla-reutilizable.component.html',
  styleUrls: ['./tabla-reutilizable.component.css']
})
export class TablaReutilizableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'email', 'password', 'facultad', 'rol', 'actions'];
  dataSource = new MatTableDataSource<Cuentas>();
  editingRowId: number | null = null;
  editForm: FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    facultad: FormControl<string>;
    rol: FormControl<string>;
  }>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cuentasService: CuentasService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      id: new FormControl<number>(0, { nonNullable: true }),
      nombre: new FormControl<string>('', { nonNullable: true }),
      email: new FormControl<string>('', { nonNullable: true }),
      password: new FormControl<string>('', { nonNullable: true }),
      facultad: new FormControl<string>('', { nonNullable: true }),
      rol: new FormControl<string>('', { nonNullable: true })
    });
  }

  ngOnInit(): void {
    this.loadCuentas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCuentas(): void {
    this.cuentasService.getCuentas().subscribe((data: Cuentas[]) => {
      this.dataSource.data = data;
    });
  }

  startEdit(cuenta: Cuentas): void {
    this.editingRowId = cuenta.id;
    this.editForm.patchValue(cuenta);
  }

  saveEdit(): void {
    if (this.editForm.valid) {
      const updatedCuenta: Cuentas = this.editForm.value as Cuentas;
      this.cuentasService.editCuentas(updatedCuenta).subscribe(() => {
        alert('Cuenta actualizada exitosamente');
        this.loadCuentas();
        this.cancelEdit();
      });
    }
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.editForm.reset();
  }

  delete(cuenta: Cuentas): void {
    const confirmation = confirm(`¿Está seguro de eliminar la cuenta ${cuenta.nombre}?`);
    if (confirmation) {
      this.cuentasService.deleteCuentas(cuenta).subscribe(() => {
        alert('Cuenta eliminada exitosamente');
        this.loadCuentas();
      });
    }
  }
}