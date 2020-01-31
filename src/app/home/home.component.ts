import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  response: any[] = [];
  constructor(private api: ApiService, private authapi: AuthService, private router: Router) { }

  ngOnInit() {
  }

  getUserProfile() {

    if (!this.authapi.isTokenExpired()) {
      console.log('token expired, Regenerating')
      const reqBody = { refJwt: this.authapi.getRefreshToken().toString() };
      this.authapi.validateRefToken().subscribe(data => {
        this.authapi.setTokens(data);
        this.getUserData();
      }, err => {
        this.authapi.removeExpiredAccessTokens();
        this.authapi.removeExpiredRefToken();
        console.log("Unable to genarate refresh toke Login Again");
        this.router.navigate(['/', 'login']);
      });
    } else {
      this.getUserData();
    }
  }

  getUserData() {
    this.api.getUsers().subscribe(data => {
      console.log('data Refreshed');
      this.response = data;
    },
      err => {
        //console.log(err);
      });
  }

  logout() {
    console.log('logged out');
    this.authapi.removeExpiredAccessTokens();
    this.authapi.removeExpiredRefToken();
    this.router.navigate(['/', 'login']);
  }
}
