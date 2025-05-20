import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PaginaNoEncontradaComponent } from './components/pagina-no-encontrada/pagina-no-encontrada.component';
import { CrudFacultadesComponent } from './components/crud-facultades/crud-facultades.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'crud-facultades', component: CrudFacultadesComponent },
  { path: 'comentarios', component: ComentariosComponent },
  { path: '404', component: PaginaNoEncontradaComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "**", redirectTo:"404" },
];
