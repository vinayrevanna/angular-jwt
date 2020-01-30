import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthguardService } from './core/auth-gaurds/authguard.service';
import { LoginguardService } from './core/auth-gaurds/loginguard.service';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent,canActivate: [LoginguardService] }, 
  { path: 'register', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService]},
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
