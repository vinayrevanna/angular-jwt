import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  serverUrl = environment.serverUrl;

   register(objectBody): Observable<any> {
    const body = JSON.stringify(objectBody);
    const httpOptions = {
      headers: new HttpHeaders({
         'Content-Type': 'application/json'
      }), observe: 'response' as 'body'
    };
    return this.http
      .post(this.serverUrl + '/signUp', body, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUsers(): Observable<any> {
    return this.http
      .get(this.serverUrl + '/customers')
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
