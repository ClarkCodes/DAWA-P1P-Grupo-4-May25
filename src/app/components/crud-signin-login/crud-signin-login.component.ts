import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TablaReutilizableComponent } from '../shared/tabla-reutilizable/tabla-reutilizable.component';


@Component({
  selector: 'app-crud-signin-login',
  standalone: true,
  imports: [TablaReutilizableComponent],
  templateUrl: './crud-signin-login.component.html',
  styleUrl: './crud-signin-login.component.css'
})
export class CrudSigninLoginComponent {

}
