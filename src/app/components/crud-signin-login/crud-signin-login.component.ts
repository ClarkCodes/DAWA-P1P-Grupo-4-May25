import { Component } from '@angular/core';
import { TablaReutilizableComponent } from '../shared/tabla-reutilizable/tabla-reutilizable.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-crud-signin-login',
  standalone: true,
  imports: [TablaReutilizableComponent, MatIconModule, MatButtonModule],
  templateUrl: './crud-signin-login.component.html',
  styleUrl: './crud-signin-login.component.css'
})
export class CrudSigninLoginComponent {

}
