import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverUrl = environment.serverUrl;
  private readonly JWT_TOKEN = 'tk_access';
  private readonly REFRESH_TOKEN = 'ref_access';
  private readonly EXP_TIME = 'exp_time_acess_tk';
  constructor(private http: HttpClient) { }
  

  login(objectBody): Observable<any> {
    const body = JSON.stringify(objectBody);
    const httpOptions = {
      headers: new HttpHeaders({
         'Content-Type': 'application/json'
      }), observe: 'response' as 'body'
    };
    return this.http
      .post(this.serverUrl + "/authenticate", body, httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  setTokens(data){
        localStorage.setItem("tk_access",data.body.jwt);
        localStorage.setItem("ref_access",data.body.refJwt);
        localStorage.setItem("exp_time_acess_tk",data.body.expTime);
  }

  isLoggedIn() {
    //console.log(!!this.getJwtToken(),'token present');
    //console.log(this.isTokenExpired(),'token exp');
    return !!this.getJwtToken();
  }

  isTokenExpired(){
    const expTime = this.getExpfromToken();
    if(expTime != null){
      if(new Date(expTime.toString()) > new Date()){
        return true;
      }else{
        return false;
      }
    }else{
      return true;
    }
    
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

   getExpfromToken(){
    return localStorage.getItem(this.EXP_TIME);
  }

  removeExpiredAccessTokens(){
    localStorage.removeItem("tk_access");
    localStorage.removeItem("exp_time_acess_tk");
  }

  removeExpiredRefToken(){
    localStorage.removeItem("ref_access");
  }

  validateRefToken(){

    const body = JSON.stringify(this.getRefreshToken());
    const httpOptions = {
      headers: new HttpHeaders({
         'Content-Type': 'application/json'
      }), observe: 'response' as 'body'
    };
    return this.http
      .post(this.serverUrl + '/refreshToken', body, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error as any;
      errMsg = body.description ? body.description : body.errorMessage;
    } else {
      const body = error;
      if (body.error) {
        errMsg = body.error.errorMessage;
      } else {
        errMsg = error.message ? error.message : error.toString();
      }
    }
    return throwError(errMsg);
  }

}
