import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PaginaNoEncontradaComponent } from './components/pagina-no-encontrada/pagina-no-encontrada.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { CrudSigninLoginComponent } from './components/crud-signin-login/crud-signin-login.component';
import { EventosComponent } from './components/crud-eventos-clubes/crud-eventos-clubes.component';
import { CrudEventosFacultadesComponent } from './components/crud-eventos-facultades/crud-eventos-facultades.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title: "Inicio - UG Eventos" },
  { path: 'login', component: LogInComponent, title: "Iniciar Sesión - UG Eventos" },
  { path: 'signin', component: SignInComponent, title: "Registro - UG Eventos" },
  { path: 'crud-signin-login', component: CrudSigninLoginComponent, title: "Gestión de Registro e Inicio de Sesión - UG Eventos" },
  { path: 'crud-eventos-facultades', component: CrudEventosFacultadesComponent, title: "Gestión de Eventos de Facultades - UG Eventos" },
  { path: 'crud-eventos-clubes', component: EventosComponent, title: "Gestión de Eventos de Clubes - UG Eventos" },
  { path: 'comentarios', component: ComentariosComponent, title: "Comentarios - UG Eventos" },
  { path: 'estudiantes', component: EstudiantesComponent, title: "Estudiantes - UG Eventos" },
  { path: '404', component: PaginaNoEncontradaComponent, title: "Página no encontrada - UG Eventos" },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "**", redirectTo:"404" },
];
