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
import { AVAILABLE_ROUTES } from './utils/constants';

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
  ROUTES = AVAILABLE_ROUTES;

  @ViewChildren( MatMenuTrigger ) menuTriggers!: QueryList<MatMenuTrigger>;

  ngOnInit() {
    this.cuentasService.usuarioLogueado$.subscribe( cuenta => {
      this.usuarioLogueado = cuenta;
      this.usuarioLogueadoRolId = Number( cuenta?.idRol );
    });
  }

  @HostListener( 'window:resize' )
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
      case this.ROUTES.get( 'home' ):
      case '/':
        return 'home';
      case this.ROUTES.get( 'eventos' ):
        return 'event';
      case this.ROUTES.get( 'crudEventosFacultades' ):
      case this.ROUTES.get( 'crudEventosClubes' ):
        return 'event_upcoming';
      case this.ROUTES.get( 'adminPanel' ):
        return 'admin_panel_settings';
      case this.ROUTES.get( 'perfil' ):
        return 'person';
      case this.ROUTES.get( 'login' ):
        return 'login';
      case this.ROUTES.get( 'signup' ):
        return 'signature';
      default:
        return 'help';
    }
  }

  getPageTitleName() {
    switch( this.getCurrentUrl() ){
      case this.ROUTES.get( 'home' ):
      case '/':
        return 'Inicio';
      case this.ROUTES.get( 'eventos' ):
        return 'Eventos';
      case this.ROUTES.get( 'crudEventosFacultades' ):
        return 'Gestion de Eventos(Facultad)';
      case this.ROUTES.get( 'crudEventosClubes' ):
        return 'Gestion de Eventos(Club)';
      case this.ROUTES.get( 'adminPanel' ):
        return 'Panel de Admin';
      case this.ROUTES.get( 'perfil' ):
        return 'Perfil';
      case this.ROUTES.get( 'login' ):
        return 'Iniciar Sesión';
      case this.ROUTES.get( 'signup' ):
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
    this.router.navigate([this.ROUTES.get( 'home' )]);
  }
}
