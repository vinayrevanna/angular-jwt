import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signupMsg = "";
  signAccepted:boolean = false;
  signRejected:boolean = false;
  constructor(private api: ApiService,private router:Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username : new FormControl('',[Validators.required,Validators.pattern('^[a-z][a-z0-9_-]+$'),Validators.maxLength(15),Validators.minLength(4)]),
      password: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9$#]+$'),Validators.maxLength(15),Validators.minLength(4)]),
      name: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      phonenumber: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{10,10}$')]),
      pincode: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{6,6}$')])
    });
  }

  register(){
    if(this.signupForm.status == 'VALID'){
      //console.log(this.signupForm.value);
      this.api.register(this.signupForm.value).subscribe(data=>{
        //console.log(data);
        this.signRejected = false;
        this.signAccepted = true;
        this.signupMsg = "User Signup Success";
        //this.signupForm.reset();
      },
      err =>{
        this.signAccepted = false;
        this.signupMsg = "User Signup Failed";
        this.signRejected = true;
      })
    }else{
      this.signupForm.markAllAsTouched();
    } 
  }

  login(){
    this.router.navigate(['/login']);
  }
}
