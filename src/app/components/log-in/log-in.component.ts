import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatLabel } from '@angular/material/input';


@Component({
  selector: 'app-log-in',
  imports: [MatButtonModule, TextFieldModule, MatInputModule, MatFormFieldModule, MatLabel],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  email!: boolean;
  password!: boolean;
}



