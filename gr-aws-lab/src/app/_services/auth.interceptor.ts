import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private fxMsg: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('id_token') || "";
    req = req.clone({
      setHeaders:
      {
        'id_token': idToken,
        'Content-Type': 'application/json'
      }
    });

    return next.handle(req).pipe(tap((event: any) => {
      if (event instanceof HttpResponse) {
        console.log('log from interceptor success block');
      }
    }), catchError(error => {
      if (error instanceof HttpErrorResponse) {
        console.log('log from interceptor error block');        
        this.fxMsg.add(
          {
            severity: 'error',
            summary: 'Error', detail: error.message, life: 3000
          })
      }
      return of(error)
    }));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];