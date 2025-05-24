import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Cuentas } from '../../../models/cuentas';
import { CuentasService } from '../../../services/SigninLogin/cuentas.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

// Define el componente Angular
@Component({
  selector: 'app-tabla-reutilizable',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './tabla-reutilizable.component.html',
  styleUrls: ['./tabla-reutilizable.component.css']
})
export class TablaReutilizableComponent implements OnInit, AfterViewInit {
  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['nombre', 'email', 'password', 'facultad', 'rol', 'actions'];

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<Cuentas>();

  // ID de la fila que se está editando
  editingRowId: number | null = null;

  // Formulario para edición de cuentas
  editForm: FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    facultad: FormControl<string>;
    rol: FormControl<string>;
  }>;

  // Referencia al paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Constructor con inyección de dependencias
  constructor(
    private cuentasService: CuentasService,
    private fb: FormBuilder
  ) {
    // Inicializa el formulario de edición
    this.editForm = this.fb.group({
      id: new FormControl<number>(0, { nonNullable: true }),
      nombre: new FormControl<string>('', { nonNullable: true }),
      email: new FormControl<string>('', { nonNullable: true }),
      password: new FormControl<string>('', { nonNullable: true }),
      facultad: new FormControl<string>('', { nonNullable: true }),
      rol: new FormControl<string>('', { nonNullable: true })
    });
  }

  // Inicializa el componente
  ngOnInit(): void {
    this.loadCuentas();
  }

  // Configura el paginador después de que la vista esté lista
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Carga las cuentas desde el servicio
  loadCuentas(): void {
    this.cuentasService.getCuentas().subscribe((data: Cuentas[]) => {
      this.dataSource.data = data;
    });
  }

  // Inicia la edición de una cuenta
  startEdit(cuenta: Cuentas): void {
    this.editingRowId = cuenta.id;
    this.editForm.patchValue(cuenta);
  }

  // Guarda los cambios de la cuenta editada
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

  // Cancela la edición actual
  cancelEdit(): void {
    this.editingRowId = null;
    this.editForm.reset();
  }

  // Elimina una cuenta tras confirmación
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