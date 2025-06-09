import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-form-field-error',
  imports: [MatError],
  templateUrl: './form-field-error.component.html',
  styleUrl: './form-field-error.component.css'
})

export class FormFieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() customMessages: { [key: string]: string } = {};

  get errorMessage(): string | null {
    if ( !this.control || !this.control.errors || !( this.control.touched || this.control.dirty ) )
      return null;

    for ( const errorKey of Object.keys( this.control.errors ) ) {
      if ( this.customMessages[errorKey] )
        return this.customMessages[errorKey];

      // fallback por defecto
      switch ( errorKey ) {
        case 'required': return 'Este campo es obligatorio';
        case 'email': return 'El formato del email es inválido';
        case 'minlength': return `Debe tener al menos ${this.control.errors['minlength'].requiredLength} caracteres`;
        case 'maxlength': return `No puede exceder ${this.control.errors['maxlength'].requiredLength} caracteres`;
        case 'min': return `Debe ser mayor o igual a ${this.control.errors['min'].min}`;
        case 'max': return `Debe ser menor o igual a ${this.control.errors['max'].max}`;
        case 'pattern': return 'El valor no coincide con el patrón requerido';
        default: return 'Campo inválido';
      }
    }

    return null;
  }
}
