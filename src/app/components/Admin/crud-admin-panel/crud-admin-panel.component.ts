import { Component } from '@angular/core';
import { TablaUsuariosComponent } from '../tabla-usuarios/tabla-usuarios.component';

@Component({
  selector: 'app-crud-admin-panel',
  standalone: true,
  imports: [TablaUsuariosComponent],
  templateUrl: './crud-admin-panel.component.html',
  styleUrl: './crud-admin-panel.component.css'
})
export class CrudAdminPanelComponent {

}
