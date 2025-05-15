import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';

@Component({
  selector: 'app-sign-in',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatStepperModule],
    standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup: FormGroup = this._formBuilder.group({firstCtrl: ['']});
  secondFormGroup: FormGroup = this._formBuilder.group({secondCtrl: ['']});

}
