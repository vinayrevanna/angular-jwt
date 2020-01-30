import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showLogout:boolean = false;
  constructor(private router: Router, private authapi: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    //this.showLogout = !this.authapi.isLoggedIn()? false:true;
  }

  logout(){
    console.log('logged out');
    this.authapi.removeExpiredAccessTokens();
    this.authapi.removeExpiredRefToken();
    this.router.navigate(['/', 'login']);
  }
}
