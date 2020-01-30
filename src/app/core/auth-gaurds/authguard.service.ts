import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  canActivate(){
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }else{
      return true;
    }
  }

  constructor(private authService: AuthService, private router: Router) { }
}
