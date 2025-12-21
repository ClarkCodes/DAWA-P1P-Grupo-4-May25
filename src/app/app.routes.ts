import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PaginaNoEncontradaComponent } from './components/pagina-no-encontrada/pagina-no-encontrada.component';
import { CrudAdminPanelComponent } from './components/Admin/crud-admin-panel/crud-admin-panel.component';
import { EventosComponent } from './components/crud-eventos-clubes/crud-eventos-clubes.component';
import { CrudEventosFacultadesComponent } from './components/EventosFacultades/crud-eventos-facultades/crud-eventos-facultades.component';
import { PaginaEventosComponent } from './components/pagina-eventos/pagina-eventos.component';
import { PerfilUsuarioComponent } from './components/Perfil/perfil-usuario/perfil-usuario.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title: "Inicio - UG Eventos" },
  { path: 'eventos', component: PaginaEventosComponent, title: "Eventos - UG Eventos" },
  { path: 'login', component: LogInComponent, title: "Iniciar Sesión - UG Eventos" },
  { path: 'signup', component: SignUpComponent, title: "Registro - UG Eventos" },
  { path: 'perfil', component: PerfilUsuarioComponent, title: "Perfil - UG Eventos" },
  { path: 'crud-admin-panel', component: CrudAdminPanelComponent, title: "Panel de Administrador - UG Eventos" },
  { path: 'crud-eventos-facultades', component: CrudEventosFacultadesComponent, title: "Gestión de Eventos de Facultades - UG Eventos" },
  { path: 'crud-eventos-clubes', component: EventosComponent, title: "Gestión de Eventos de Clubes - UG Eventos" },
  { path: '404', component: PaginaNoEncontradaComponent, title: "Página no encontrada - UG Eventos" },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "**", redirectTo:"404" },
];
