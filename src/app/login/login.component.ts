import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  validRequest:boolean= false;
  constructor(private router: Router,private authApi: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username : new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z0-9_-]{3,15}$')]),
      password: new FormControl('',[Validators.required])
      });
    
  }

  login(){
    if(this.loginForm.status == 'VALID'){
      this.authApi.login(this.loginForm.value).subscribe(data=>{
        this.authApi.setTokens(data);
        this.router.navigate(['/','home']);
      },
      err =>{
        console.log(err);
        this.validRequest = true;
      });
    }else{
      this.loginForm.markAllAsTouched();
    } 
  }

  signup(){
    this.router.navigate(['/', 'register']);
  }

  /*
  testToken(data){
        let tokenArr = data.split(".")
        let obj = JSON.parse(atob(tokenArr[1]));
        console.log(obj);
        console.log(new Date(obj.exp * 1000));
        console.log('token validity '+ obj.acessType);
  } */


}
