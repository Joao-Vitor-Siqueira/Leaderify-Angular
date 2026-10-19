import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { catchError, throwError, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getAccessToken();

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status !== 401 || req.url.endsWith('/refresh') || req.url.endsWith("/register")) {
        return throwError(() => error);
      }
      return authService.refresh().pipe(
        switchMap(() => {
          const newToken = authService.getAccessToken();

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          authService.clearAuthentication();

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
