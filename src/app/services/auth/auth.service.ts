import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';


interface LoginRequest {
  email: string;
  password: string;
}

interface UsernameResponse{
  username: string
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = API_URL + "/users";

  private accessToken: string | null = null;

  private readonly loggedInSubject = new BehaviorSubject<boolean>(false);

  readonly loggedIn$ = this.loggedInSubject.asObservable();

  private refreshInProgress$: Observable<void> | null = null;

  constructor(
  private readonly http: HttpClient,
  private readonly router: Router
) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  emailExists(email: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/email-exists?email=${encodeURIComponent(email)}`)
  }

  usernameExists(username: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/username-exists?username=${encodeURIComponent(username)}`)
  }

  login(email: string, password: string): Observable<void> {
  const body: LoginRequest = { email, password };

  return this.http
    .post<void>(`${this.apiUrl}/login`, body, {
      observe: 'response',
      withCredentials: true,
    })
    .pipe(
      tap((response) => {
        this.setAccessTokenFromResponse(response);
        this.loggedInSubject.next(true);
      }),
      map(() => void 0)
    );
}

  register(email: string, username: string, password: string): Observable<void> {
    const body: RegisterRequest = {
      username,
      password,
      email
    };

    return this.http
      .post<void>(`${this.apiUrl}/register`, body, {
        observe: 'response',
        withCredentials: false,
      })
      .pipe(
        map(() => void 0)
      );
  }

  refresh(): Observable<void> {
  if (this.refreshInProgress$) {
    return this.refreshInProgress$;
  }

  this.refreshInProgress$ = this.http
    .post<void>(
      `${this.apiUrl}/refresh`,
      {},
      {
        observe: 'response',
        withCredentials: true,
      },
    )
    .pipe(
      tap((response) => {
        this.setAccessTokenFromResponse(response);
        this.loggedInSubject.next(true);
      }),
      map(() => void 0),
      finalize(() => {
        this.refreshInProgress$ = null;
      }),
      shareReplay(1),
    );

  return this.refreshInProgress$;
}

  logout(): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap(() => {
          this.clearAuthentication();
          this.router.navigate([`/login`]);
        }),
      );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAuthentication(): void {
    this.accessToken = null;
    this.loggedInSubject.next(false);
  }

  private setAccessTokenFromResponse(response: HttpResponse<unknown>): void {
    const authorization = response.headers.get('Authorization');

    if (!authorization?.startsWith('Bearer ')) {
      throw new Error('The server did not return a valid access token');
    }

    this.accessToken = authorization.substring('Bearer '.length);
  }

  getUsername(): Observable<UsernameResponse>{
    return this.http.get<UsernameResponse>(`${this.apiUrl}/username`)
  }
}
