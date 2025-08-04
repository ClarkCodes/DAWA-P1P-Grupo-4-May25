import { Component, ElementRef, Inject, inject, signal, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CuentasService } from '../../../services/SignupLogin/cuentas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cuenta } from '../../../models/cuenta';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormFieldErrorComponent } from '../../shared/form-field-error/form-field-error.component';

@Component({
  selector: 'app-cambiar-contrasenia-dialog',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormFieldErrorComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cambiar-contrasenia-dialog.component.html',
  styleUrl: './cambiar-contrasenia-dialog.component.css'
})
export class CambiarContraseniaDialogComponent {
  public cuentasService = inject( CuentasService );
  cambiarContraseniaForm!: FormGroup;
  @ViewChild( 'currentPwdControl' ) currentPwdControl!: ElementRef;

  // Signals para controlar la visibilidad de las contraseñas
  hideCurrentPwd = signal(true);
  hideNewPwd = signal(true);
  hideConfirmPwd = signal(true);

  constructor(
    public dialogRef: MatDialogRef<CambiarContraseniaDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: { cuentaUsuario: Cuenta },
    private fb: FormBuilder
  ){}

  ngOnInit() {
    this.initForm();
  }

  ngAfterInit() {
    this.currentPwdControl.nativeElement.focus();
  }

  initForm() {
    this.cambiarContraseniaForm = this.fb.group({
      currentPassword: ['', [Validators.required, this.notEqualValidator( this.data.cuentaUsuario.password )]],
      newPassword: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(17)]],
      confirmPassword: ['']
    });

    this.setConfirmPwdValidators();
  }

  setConfirmPwdValidators() {
    const confirmPwdControl = this.cambiarContraseniaForm.get( 'confirmPassword' );
    confirmPwdControl?.setValidators( [Validators.required, this.notEqualValidator( this.cambiarContraseniaForm.get( 'newPassword' ) )] );
    confirmPwdControl?.updateValueAndValidity();
  }

  /**
   * Custom Validator Function for current and confirm password matching comparison validation,
   * the value in the current password input control must match the already saved password in the database, and also
   * the new password value and the confirm password value must match
   * @param comparingItem Value to compare to, this would be a string value as the currently saved password gotten from a data service or an AbstractControl, in this case an input control to get it value as the new password
   * @returns The validation error if the 2 comparing values do not match, otherwise null
   */
  notEqualValidator( comparingItem: AbstractControl | null | string ): ValidatorFn {
    return ( control: AbstractControl ): ValidationErrors | null => {
      const comparingValue = comparingItem instanceof AbstractControl ? comparingItem?.value : comparingItem;
      return control.value !== comparingValue ? ( comparingItem instanceof AbstractControl ? { notEqualConfirmingPwd: true } : { notEqualCurrentPwd: true } ) : null;
    };
  }

  showHidePassword( event: MouseEvent, pwdType: string ): void {
    switch( pwdType ) {
      case 'currentPwd':
        this.hideCurrentPwd.set( !this.hideCurrentPwd() );
        break;
      case 'newPwd':
        this.hideNewPwd.set( !this.hideNewPwd() );
        break;
      case 'confirmPwd':
        this.hideConfirmPwd.set( !this.hideConfirmPwd() );
        break;
      default:
        break;
    }

    event.stopPropagation();
  }

  onSubmit() {
    this.dialogRef.close( this.getDataFromForm() );
  }

  getDataFromForm(): Partial<Cuenta> | void {
    if ( this.cambiarContraseniaForm.untouched || !this.cambiarContraseniaForm.dirty || this.cambiarContraseniaForm.invalid )
      return;

    const updatedValues: Partial<Cuenta> = {}; // Se Crea un objeto parcial de Cuenta, vacío al inicio, dado que es parcial, todos sus miembros son opcionales.
    const formValue = this.cambiarContraseniaForm.value;
    updatedValues['password'] = formValue['newPassword'];

    return updatedValues;
  }

}
