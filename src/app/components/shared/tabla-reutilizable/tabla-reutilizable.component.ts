// src/app/components/tabla-reutilizable/tabla-reutilizable.component.ts
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cuentas } from '../../../models/cuentas';
import { CreateCuentas } from '../../../models/createCuentas';
import { FacultadDatos } from '../../../models/facultadDatos';
import { RolDatos } from '../../../models/rolDatos';
import { CuentasService } from '../../../services/SigninLogin/cuentas.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule // Agregado para comboboxes
  ],
  templateUrl: './tabla-reutilizable.component.html',
  styleUrls: ['./tabla-reutilizable.component.css']
})
export class TablaReutilizableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'email', 'facultadNombre', 'rolNombre', 'actions'];
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource<Cuentas>();
  editingRowId: number | null = null;
  facultades: FacultadDatos[] = [];
  roles: RolDatos[] = [];

  editForm: FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    facultadId: FormControl<string>;
    rolId: FormControl<string>;
  }>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cuentasService: CuentasService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      id: new FormControl<number>(0, { nonNullable: true }),
      nombre: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s'-]*$")
] }),
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl<string>('', { nonNullable: true }),
      facultadId: new FormControl<string>('', { nonNullable: true }),
      rolId: new FormControl<string>('', { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.loadCuentas();
    this.loadFacultades();
    this.loadRoles();

    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCuentas(): void {
    this.cuentasService.getCuentas().subscribe({
      next: (data: Cuentas[]) => {
        this.dataSource.data = data;
        this.dataSource.filterPredicate = (data: Cuentas, filter: string) => {
          const filterValue = filter.trim().toLowerCase();
          return (
            data.nombre.toLowerCase().includes(filterValue) ||
            data.email.toLowerCase().includes(filterValue) ||
            data.facultadNombre.toLowerCase().includes(filterValue) ||
            data.rolNombre.toLowerCase().includes(filterValue)
          );
        };
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  loadFacultades(): void {
    this.cuentasService.getFacultades().subscribe({
      next: (data: FacultadDatos[]) => {
        this.facultades = data;
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  loadRoles(): void {
    this.cuentasService.getRoles().subscribe({
      next: (data: RolDatos[]) => {
        this.roles = data;
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  startEdit(cuenta: Cuentas): void {
    this.editingRowId = cuenta.id;
    this.editForm.patchValue({
      id: cuenta.id,
      nombre: cuenta.nombre,
      email: cuenta.email,
      password: cuenta.password,
      facultadId: cuenta.facultadId,
      rolId: cuenta.rolId
    });
  }

  saveEdit(): void {
    if (this.editForm.valid) {
      const updatedCuenta: CreateCuentas = {
        id: this.editForm.value.id!,
        nombre: this.editForm.value.nombre!,
        email: this.editForm.value.email!,
        password: this.editForm.value.password!,
        facultadId: this.editForm.value.facultadId!,
        rolId: this.editForm.value.rolId!
      };
      const id = this.editingRowId || 0;
      this.cuentasService.editCuentas(id, updatedCuenta).subscribe({
        next: (response) => {
          alert('Cuenta actualizada exitosamente');
          this.loadCuentas();
          this.cancelEdit();
        },
        error: (err) => {
          alert(err.message);
        }
      });
    } else {
      alert('Edición Cancelada');
      this.loadCuentas();
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.editForm.reset();
  }

  delete(cuenta: Cuentas): void {
    const confirmation = confirm(`¿Está seguro de eliminar la cuenta ${cuenta.nombre}?`);
    if (confirmation) {
      this.cuentasService.deleteCuentas(cuenta.id).subscribe({
        next: () => {
          alert('Cuenta eliminada exitosamente');
          this.loadCuentas();
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }

  // Método para agregar una nueva cuenta
  addCuenta(): void {
    if (this.editForm.valid) {
      const newCuenta: CreateCuentas = {
        id: 0, // El ID será asignado por el backend
        nombre: this.editForm.value.nombre!,
        email: this.editForm.value.email!,
        password: this.editForm.value.password!,
        facultadId: this.editForm.value.facultadId!,
        rolId: this.editForm.value.rolId! 
      };
      this.cuentasService.addCuentas(newCuenta).subscribe({
        next: (response) => {
          alert('Cuenta creada exitosamente');
          this.loadCuentas();
          this.cancelEdit();
        },
        error: (err) => {
          alert(err.message);
        }
      });
    } else {
      alert('Por favor, complete todos los campos requeridos correctamente.');
      this.loadCuentas();
      this.cancelEdit();
    }
  }
}