import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventoFacultad, EventosFacultadCategoria, EventosFacultadTopId, Facultad } from '../../../models/eventoFacultad';
import { ServEventosFacultadesService } from '../../../services/EventosFacultades/serv-eventos-facultades.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-editar-evento-facultad-reutilizable',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatDatepickerModule, MatTimepickerModule, ReactiveFormsModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-editar-evento-facultad-reutilizable.component.html',
  styleUrl: './crear-editar-evento-facultad-reutilizable.component.css'
})

export class CrearEditarEventoFacultadReutilizableComponent {
  constructor(
    private eventosFacultadesService: ServEventosFacultadesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const initialValue = new Date();
    initialValue.setHours(12, 30, 0);
    this.formControl = new FormControl(initialValue);
  }

  eventoFacultad: EventoFacultad | null = null;
  formControl: FormControl<Date | null>;
  form!: FormGroup;

  topId: number = 0;
  categorias: EventosFacultadCategoria[] = [];
  facultades: Facultad[] = [];
  categoria: string = "";
  facultad: string = "";

  ngOnInit(): void {
    if ( this.router.getCurrentNavigation() ){
      const nav = this.router.getCurrentNavigation();
      this.eventoFacultad = nav?.extras.state?.['eventoFacultad'];
    }
    else{
      this.eventoFacultad = history.state?.['eventoFacultad'];
    }

    if ( this.eventoFacultad ) {
      this.loadEventoDataOnControls();
    }
    else {
      this.getTopId();
    }
    this.loadCategorias();
    this.loadFacultades();


    this.form = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
      categoria: new FormControl(0, [Validators.required]),
      facultad: new FormControl(0, [Validators.required]),
      organizadorExterno: new FormControl(''),
      descripcionCorta: new FormControl('', [Validators.required, Validators.minLength(5)]),
      descripcionDetalles: new FormControl('', [Validators.required, Validators.minLength(10)]),
      area: new FormControl('', [Validators.required, Validators.minLength(5)]),
      variosDias: new FormControl( false ),
      fecha: new FormControl('', [Validators.required] ),
      fechaHasta: new FormControl(''),
      hora: new FormControl('', [Validators.required] ),
      esGratuito: new FormControl( true ),
      costo: new FormControl( 0, [Validators.pattern(/^[0-9.]+$/)] ),
      direccion: new FormControl(''),
      lugar: new FormControl('', [Validators.required, Validators.minLength(5)] ),
      aficheUrl: new FormControl(''),
      sitioWeb: new FormControl(''),
      telefonoContacto: new FormControl( '', [Validators.pattern(/^[0-9]+$/)] ),
      etiquetas: new FormControl('')
    });
  }

  getTopId(): void {
    this.eventosFacultadesService.getEventosFacultadTopId().subscribe( ( data: EventosFacultadTopId ) => {
      this.topId = data.topId;
    });
  }

  loadCategorias() {
    this.eventosFacultadesService.getCategorias().subscribe( ( data: EventosFacultadCategoria[] ) => {
      this.categorias = data;
    });
  }

  loadFacultades() {
    this.eventosFacultadesService.getFacultades().subscribe( ( data: Facultad[] ) => {
      this.facultades = data;
    });
  }

  loadEventoDataOnControls(){
    this.form.setValue({
      nombre: this.eventoFacultad?.nombre,
      categoria: this.eventoFacultad?.categoriaId,
      facultad: this.eventoFacultad?.facultadId,
      organizadorExterno: this.eventoFacultad?.organizadorExterno,
      descripcionCorta: this.eventoFacultad?.descripcion.descripcionCorta,
      descripcionDetalles: this.eventoFacultad?.descripcion.descripcionDetalles,
      area: this.eventoFacultad?.area,
      variosDias: this.eventoFacultad?.variosDias,
      fecha: this.eventoFacultad?.fecha,
      fechaHasta: this.eventoFacultad?.fechaHasta,
      hora: this.eventoFacultad?.hora,
      esGratuito: this.eventoFacultad?.esGratuito,
      costo: this.eventoFacultad?.costo,
      direccion: this.eventoFacultad?.direccion,
      lugar: this.eventoFacultad?.lugar,
      aficheUrl: this.eventoFacultad?.aficheUrl,
      sitioWeb: this.eventoFacultad?.sitioWeb,
      telefonoContacto: this.eventoFacultad?.telefonoContacto,
      etiquetas: this.eventoFacultad?.etiquetas
    });
  }

  onSubmit() {
    if( this.form.invalid ) {
      return;
    }

    if ( this.eventoFacultad ){
      this.edit();
    }
    else
    {
      this.create();
    }
  }

  create() {
    const newId: EventosFacultadTopId = {
      topId: this.topId + 1
    }

    const nuevoEvento: EventoFacultad = this.form.value;
    nuevoEvento.id = newId.topId;

    /* {
      id: newId.topId,
      nombre: "",
      categoriaId: 0,
      facultadId: "",
      organizadorExterno: "",
      descripcion: {
        descripcionCorta: "",
        descripcionDetalles: ""
      },
      area: "",
      variosDias: false,
      fecha: "",
      fechaHasta: "",
      hora: "",
      esGratuito: true,
      costo: 0,
      direccion: "",
      lugar: "",
      aficheUrl: "",
      sitioWeb: "",
      telefonoContacto: "",
      etiquetas: []
    }; */

    this.eventosFacultadesService.upodateEventosFacultadTopId( newId );
  }

  edit() {
    const eventoActualizado: EventoFacultad = this.form.value;
    eventoActualizado.id = this.eventoFacultad!.id;
    /* {
      id: newId.topId,
      nombre: "",
      categoriaId: 0,
      facultadId: "",
      organizadorExterno: "",
      descripcion: {
        descripcionCorta: "",
        descripcionDetalles: ""
      },
      area: "",
      variosDias: false,
      fecha: "",
      fechaHasta: "",
      hora: "",
      esGratuito: true,
      costo: 0,
      direccion: "",
      lugar: "",
      aficheUrl: "",
      sitioWeb: "",
      telefonoContacto: "",
      etiquetas: []
    }; */

  }

  cancel() {

  }
}
