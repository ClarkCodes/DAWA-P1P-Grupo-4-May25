import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PaginaNoEncontradaComponent } from './components/pagina-no-encontrada/pagina-no-encontrada.component';
import { CrudFacultadesComponent } from './components/crud-facultades/crud-facultades.component';
import { CrudSigninLoginComponent } from './components/crud-signin-login/crud-signin-login.component';
import { EventosComponent } from './components/crud-eventos-clubes/crud-eventos-clubes.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'crud-signin-login', component: CrudSigninLoginComponent },
  { path: 'crud-facultades', component: CrudFacultadesComponent },
  { path: 'crud-eventos-clubes', component: EventosComponent },
  { path: '404', component: PaginaNoEncontradaComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "**", redirectTo:"404" },
];
