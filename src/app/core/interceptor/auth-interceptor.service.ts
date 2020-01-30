import { Injectable } from '@angular/core';
import { HttpInterceptor} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  implements HttpInterceptor{


constructor(private authapi: AuthService) { }

intercept(request,next){

  if(request.url.toString().search("/authenticate") == -1 && 
   request.url.toString().search("/signUp") == -1 && request.url.toString().search("/refreshToken") == -1){
       request = this.addTokenHeaders(request);
  }

  return next.handle(request).pipe(
    map((event: HttpEvent<any>) => {
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Token expried Please signin', 'Unauthorized Access');
      } else {
        console.log("some err");
        console.log(error);
      }
      return throwError(error);
    }));
}

  addTokenHeaders(request){
    const token = localStorage.getItem('tk_access');
    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      request = request.clone({ headers: request.headers.set('Cache-Control', 'no-cache') });
      request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });
      return request;
  }
}
