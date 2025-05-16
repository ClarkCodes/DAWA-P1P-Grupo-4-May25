import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

export const routes: Routes = [
    {path: '', redirectTo: 'signin', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LogInComponent},
    {path: 'signin', component: SignInComponent},
];
