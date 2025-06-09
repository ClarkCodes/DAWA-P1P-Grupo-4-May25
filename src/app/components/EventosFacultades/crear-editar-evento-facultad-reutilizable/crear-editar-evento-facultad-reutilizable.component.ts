import { ChangeDetectionStrategy, Component, inject, Inject, signal, ViewChild } from '@angular/core';
import { EventoFacultad, EventosFacultadCategoria, Facultad } from '../../../models/eventoFacultad';
import { ServEventosFacultadesService } from '../../../services/EventosFacultades/serv-eventos-facultades.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatChipInputEvent, MatChipRow, MatChipsModule } from '@angular/material/chips';
import { FormFieldErrorComponent } from '../../shared/form-field-error/form-field-error.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Utils } from '../../shared/utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-crear-editar-evento-facultad-reutilizable',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    ReactiveFormsModule,
    FormFieldErrorComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatCheckboxModule,
    MatButton,
    MatIcon,
    MatStepper,
    MatStep,
    MatRadioGroup,
    MatRadioButton,
    MatChipsModule,
    MatChipRow,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-editar-evento-facultad-reutilizable.component.html',
  styleUrl: './crear-editar-evento-facultad-reutilizable.component.css'
})

export class CrearEditarEventoFacultadReutilizableComponent {
  @ViewChild('stepper') eventosFacultadStepper!: MatStepper;
  readonly reactiveTags = signal( [''] );
  announcer = inject( LiveAnnouncer );
  utils = new Utils();
  eventoFacultad: EventoFacultad | null = null;
  categorias: EventosFacultadCategoria[] | null = null;
  facultades: Facultad[] | null = null;
  selectedCategoriaId: string = '';
  selectedFacultadId: string = '';
  date: Date | undefined;
  dateTo: Date | undefined;
  finalStepReached: boolean = false;
  eventoFacultadForm!: FormGroup;
  nextStepLabel: string = 'Siguiente';
  previousStepLabel: string = 'Atras';
  etiquetasToolTipMsj: string = 'Puedes agregar varias etiquetas de una vez separandolas por un espacio en blanco';

  constructor(
    public dialogRef: MatDialogRef<CrearEditarEventoFacultadReutilizableComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: { eventoFacultad: EventoFacultad | null },
    private eventosFacultadesService: ServEventosFacultadesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.eventoFacultad = this.data.eventoFacultad;
    this.loadCategorias();
    this.loadFacultades();

    if ( this.eventoFacultad ) { // If the object exists then it has been passed for edit an event and this must be in edit mode
      this.loadEventoDataOnForm();
    }
    else { // Otherwise a new event is being created and the form should be empty and with default data
      this.loadDefaultDataOnForm();
    }

    this.organizadorExternoDisabler(); // Se registran funciones para deshabilitar condicionalmente cajas de texto en base a su respectivo slider
    this.esGratuitoDisabler();
    this.noTagsVerifier(); // Se verifica el tag grid si tiene un elemento vacio
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

  organizadorExternoDisabler() {
    const optionsControl = this.eventoFacultadForm.get( 'step3.organizadorRadioGroup' );
    const organizadorControl = this.eventoFacultadForm.get( 'step3.organizadorExterno' );

    optionsControl?.valueChanges.subscribe( ( optionValue: string ) => {
      if ( optionValue === 'facultad' ) {
        organizadorControl?.disable();
        organizadorControl?.reset();
      } else {
        organizadorControl?.enable();
        organizadorControl?.setValidators( [Validators.required, Validators.minLength( 3 )] );
      }

      organizadorControl?.updateValueAndValidity();
    });
  }

  esGratuitoDisabler() {
    const isFreeControl = this.eventoFacultadForm.get( 'step5.esGratuito' );
    const priceControl = this.eventoFacultadForm.get( 'step5.costo' );

    isFreeControl?.valueChanges.subscribe( ( isFree: boolean ) => {
      if ( isFree ) {
        priceControl?.disable();
        priceControl?.reset();
      } else {
        priceControl?.enable();
        priceControl?.setValidators( [Validators.required, Validators.min( 0.0 )] );
      }

      priceControl?.updateValueAndValidity();
    });
  }

  loadDefaultDataOnForm() { // Cuando se crea un evento: Se carga el formulario del stepper mayormente vacio y/o con datos iniciales por defecto
    this.date = new Date( Date.now() );
    this.date.setHours( 8, 0, 0 );
    this.selectedCategoriaId = this.categorias?.at( 0 )?.id!;
    this.selectedFacultadId = this.facultades?.at( 0 )?.id!;

    this.eventoFacultadForm = this.fb.group({
      step1: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        descripcionCorta: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
        descripcionDetalles: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(700)]],
      }),
      step2: this.fb.group({
        area: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        categoriaCombo: [this.selectedCategoriaId, [Validators.required]],
        facultadCombo: [this.selectedFacultadId, [Validators.required]],
      }),
      step3: this.fb.group({
        organizadorRadioGroup: ['facultad'],
        organizadorExterno: [{value: '', disabled: true}],
      }),
      step4: this.fb.group({
        variosDias: [false],
        fecha: [{value: this.date, startAt: this.date}, [Validators.required, Validators.min( Date.now() )]],
        fechaHasta: [{value: this.date, startAt: this.date}],
        hora: [this.date, [Validators.required]],
      }),
      step5: this.fb.group({
        esGratuito: [true],
        costo: [{value: '', disabled: true}],
      }),
      step6: this.fb.group({
        direccion: ['', [Validators.maxLength(150)]],
        lugar: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      }),
      step7: this.fb.group({
        aficheUrl: [''],
        sitioWeb: [''],
        telefonoContacto: ['', [Validators.pattern(/^[0-9]+$/), Validators.maxLength(15)]],
      }),
      step8: this.fb.group({
        etiquetasInput: ['']
      })
    });
  }

  loadEventoDataOnForm() { // Cuando se edita un evento: Se cargan los datos en el formulario del stepper en modo edicion
    if( this.eventoFacultad?.etiquetas )
      this.reactiveTags.update( () => this.eventoFacultad?.etiquetas! );

    this.selectedCategoriaId = this.eventoFacultad?.categoriaId!;
    this.selectedFacultadId = this.eventoFacultad?.facultadId!;
    const strDate: string = this.eventoFacultad?.fechaHora!;
    strDate.replace( 'Z', '-05:00' );
    this.date = new Date( strDate );
    this.dateTo = this.eventoFacultad?.fechaHasta ? new Date( this.eventoFacultad?.fechaHasta! ) : new Date( Date.now() );

    this.eventoFacultadForm = this.fb.group({
      step1: this.fb.group({
        nombre: [this.eventoFacultad?.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        descripcionCorta: [this.eventoFacultad?.descripcion.descripcionCorta, [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
        descripcionDetalles: [this.eventoFacultad?.descripcion.descripcionDetalles, [Validators.required, Validators.minLength(15), Validators.maxLength(700)]],
      }),
      step2: this.fb.group({
        area: [this.eventoFacultad?.area, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        categoriaCombo: [this.selectedCategoriaId, [Validators.required]],
        facultadCombo: [this.selectedFacultadId, [Validators.required]],
      }),
      step3: this.fb.group({
        organizadorRadioGroup: [this.eventoFacultad?.organizadorExterno ? 'externo' : 'facultad'],
        organizadorExterno: [this.eventoFacultad?.organizadorExterno ? this.eventoFacultad?.organizadorExterno : {value: '', disabled: true}, this.eventoFacultad?.organizadorExterno ? [Validators.required, Validators.minLength(3)] : []],
      }),
      step4: this.fb.group({
        variosDias: [this.eventoFacultad?.variosDias],
        fecha: [this.date, [Validators.required]],
        fechaHasta: [this.dateTo],
        hora: [this.date, [Validators.required]],
      }),
      step5: this.fb.group({
        esGratuito: [this.eventoFacultad?.esGratuito],
        costo: [this.eventoFacultad?.esGratuito ? {value: '', disabled: true} : this.eventoFacultad?.costo, this.eventoFacultad?.esGratuito ? [] : [Validators.required, Validators.min( 0.0 )]],
      }),
      step6: this.fb.group({
        direccion: [this.eventoFacultad?.direccion ?? '', [Validators.maxLength(150)]],
        lugar: [this.eventoFacultad?.lugar, [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      }),
      step7: this.fb.group({
        aficheUrl: [this.eventoFacultad?.aficheUrl ?? ''],
        sitioWeb: [this.eventoFacultad?.sitioWeb ?? ''],
        telefonoContacto: [this.eventoFacultad?.telefonoContacto ?? '', [Validators.pattern(/^[0-9]+$/), Validators.maxLength(15)]],
      }),
      step8: this.fb.group({
        etiquetasInput: ['']
      })
    });
  }

  noTagsVerifier() {
    const tags = this.reactiveTags(); // El arreglo signal de las tags no puede estar completamente vacio en su declaracion porque da error, debe tener al menos un elemento vacio
    if ( tags.length === 1 && !tags[0] ) { // En la creacion de un evento nuevo Se verifica si el arreglo de tags tiene solo un elemento vacio y se lo remueve
      this.reactiveTags.update( tags => {
        tags.pop();
        return tags;
      });
    }
  }

  addReactiveTag( event: MatChipInputEvent ): void {
    const value = ( event.value || '' ).trim();
    let arrayTagsValue: string[] = [];

    if ( value ) {
      if( value.includes( ' ' ) ) { // Se evalua si hay espacios en blanco probablemente hayan varias tags y se las inserta todas
        arrayTagsValue = value.split( ' ' );
        arrayTagsValue.forEach( singleTValue => {
          this.reactiveTags.update( tags => [...tags, singleTValue.trim()] );
        } );

        this.announcer.announce( `Se añadieron ${arrayTagsValue} a las etiquetas` ); // For accesibility
      }
      else { // Si no hay espacios en blanco se inserta solo la tag especificada
        this.reactiveTags.update( tags => [...tags, value] );
        this.announcer.announce( `Se añadió ${value} a las etiquetas` ); // For accesibility
      }
    }

    event.chipInput!.clear(); // Clear the input value
  }

  removeReactiveTag( tag: string ): void {
    this.reactiveTags.update( tags => {
      const index = tags.indexOf( tag );
      if ( index < 0 )
        return tags;

      tags.splice( index, 1 );
      this.announcer.announce( `Se removió ${tag} de las etiquetas` );
      return [...tags];
    });
  }

  onSubmit() {
    if( this.eventoFacultadForm.invalid )
      return;

    if ( this.eventoFacultad ) {
      this.edit();
    }
    else {
      this.create();
    }
  }

  edit() {
    const eventoActualizado: EventoFacultad = this.getEventDataFromForm();
    eventoActualizado.id = this.eventoFacultad!.id;
    this.dialogRef.close( eventoActualizado );
  }

  create() {
    const nuevoEvento: EventoFacultad = this.getEventDataFromForm();
    this.dialogRef.close( nuevoEvento );
  }

  getEventDataFromForm(): EventoFacultad {
    this.date = this.eventoFacultadForm.get( 'step4.fecha' )?.value;
    const time: Date = this.eventoFacultadForm.get( 'step4.hora' )?.value;
    this.date?.setHours( time.getHours(), time.getMinutes(), 0, 0 );
    this.dateTo = this.eventoFacultadForm.get( 'step4.fechaHasta' )?.value;

    return {
      id: '',
      nombre: this.eventoFacultadForm.get( 'step1.nombre' )?.value,
      descripcion: {
        descripcionCorta: this.eventoFacultadForm.get( 'step1.descripcionCorta' )?.value,
        descripcionDetalles: this.eventoFacultadForm.get( 'step1.descripcionDetalles' )?.value
      },
      categoriaId: this.selectedCategoriaId,
      facultadId: this.selectedFacultadId,
      area: this.eventoFacultadForm.get( 'step2.area' )?.value,
      organizadorExterno: this.eventoFacultadForm.get( 'step3.organizadorRadioGroup' )?.value === 'externo' ? this.eventoFacultadForm.get( 'step3.organizadorExterno' )?.value : '',
      variosDias: this.eventoFacultadForm.get( 'step4.variosDias' )?.value,
      fechaHora: this.date!.toJSON(),
      fechaHasta: this.eventoFacultadForm.get( 'step4.variosDias' )?.value ? this.dateTo!.toJSON() : '',
      esGratuito: this.eventoFacultadForm.get( 'step5.esGratuito' )?.value,
      costo: !this.eventoFacultadForm.get( 'step5.esGratuito' )?.value ? this.eventoFacultadForm.get( 'step5.costo' )?.value : 0,
      direccion: this.eventoFacultadForm.get( 'step6.direccion' )?.value,
      lugar: this.eventoFacultadForm.get( 'step6.lugar' )?.value,
      aficheUrl: this.eventoFacultadForm.get( 'step7.aficheUrl' )?.value,
      sitioWeb: this.eventoFacultadForm.get( 'step7.sitioWeb' )?.value,
      telefonoContacto: this.eventoFacultadForm.get( 'step7.telefonoContacto' )?.value,
      etiquetas: this.reactiveTags()
    };
  }

  onImagePreviewError( event: Event ) {
    this.utils.onImageError( event.target as HTMLImageElement );
  }

  onStepChange( stepIndex: number ) {
    if ( stepIndex === 8 && !this.finalStepReached )
      this.finalStepReached = true;
  }

  onPrevious() {
    this.eventosFacultadStepper.previous();
  }

  onNext() {
    this.eventosFacultadStepper.next();
  }

  cancel() {
    this.dialogRef.close( false );
  }
}
