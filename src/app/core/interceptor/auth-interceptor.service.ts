import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { map, catchError, retry, retryWhen, shareReplay, delay, mergeMap, finalize, switchMap, filter, take } from 'rxjs/operators';
import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth.service';
import { delayedRetry } from '../operators/retry-custom';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authapi: AuthService) { }

  intercept(request, next: HttpHandler) {
    const regExp = new RegExp('.*\/authenticate$|.*\/signUp$|^.*\/refreshToken');
    if (!regExp.test(request.url)) {
      return this.nextHandler(this.addTokenHeaders(request), next);
    } else {
    return this.nextHandler(request, next);
    }
  }

  nextHandler(request, next: HttpHandler) {
    return next.handle(request)
      .pipe(
        map((event: HttpEvent<any>) => {
          //console.log(event);
          return event;
        }),
        //this.delayedRetry1(1000, 3),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('Token expried Please signin', 'Unauthorized Access');
            return this.handle401Error(request, next);
          } else {
            console.log('Some Error in interceptor');
            //return this.handle401Error(request, next);
            console.log(error);
          }
          return throwError(error);
        })
      );
  }

  addTokenHeaders(request) {
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

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authapi.validateRefToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.authapi.setTokens(token);
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addTokenHeaders(request));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addTokenHeaders(request));
        }));
    }
  }


}
