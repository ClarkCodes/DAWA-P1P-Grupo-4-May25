import { Component, HostListener, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CuentasService } from './services/SignupLogin/cuentas.service';
import { Cuenta } from './models/cuenta';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { getUserName, RolEnum } from './utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject( Router );
  public cuentasService = inject( CuentasService );
  public rolEnum = RolEnum;
  public usuarioLogueadoRolId: number = 0;
  usuarioLogueado: Cuenta | null = null;

  @ViewChildren( MatMenuTrigger ) menuTriggers!: QueryList<MatMenuTrigger>;

  ngOnInit() {
    this.cuentasService.usuarioLogueado$.subscribe( cuenta => {
      this.usuarioLogueado = cuenta;
      this.usuarioLogueadoRolId = Number( cuenta?.idRol );
    });
  }

  @HostListener( 'window:resize' ) //, ['$event']
  onWindowResize() {
    this.menuTriggers.forEach( trigger => { // Iterate over all the triggers and close any that are open
      if ( trigger.menuOpen )
        trigger.closeMenu();
    });
  }

  getUserName(): string {
    return getUserName( this.usuarioLogueado?.nombre as string );
  }

  getPageTitleIcon(): string {
    switch( this.getCurrentUrl() ){
      case '/home':
      case '/':
        return 'home';
      case '/eventos':
        return 'event';
      case '/crud-eventos-facultades':
      case '/crud-eventos-clubes':
        return 'event_upcoming';
      case '/crud-signin-login':
        return 'admin_panel_settings';
      case '/perfil':
        return 'person';
      case '/login':
        return 'login';
      case '/signin':
        return 'signature';
      default:
        return 'help';
    }
  }

  getPageTitleName() {
    switch( this.getCurrentUrl() ){
      case '/home':
      case '/':
        return 'Inicio';
      case '/eventos':
        return 'Eventos';
      case '/crud-eventos-facultades':
        return 'Gestion de Eventos(Facultad)';
      case '/crud-eventos-clubes':
        return 'Gestion de Eventos(Club)';
      case '/crud-signin-login':
        return 'Visualización';
      case '/perfil':
        return 'Perfil';
      case '/login':
        return 'Iniciar Sesión';
      case '/signin':
        return 'Registrarse';
      default:
        return 'help';
    }
  }

  private getCurrentUrl() {
    return this.router.url;
  }

  logout() {
    this.cuentasService.logout();
    this.usuarioLogueadoRolId = 0;
    this.router.navigate(['/home']);
  }
}
