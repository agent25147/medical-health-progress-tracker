import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/auth/google';
  }

  handleAuthCallback(code: string): Observable<any> {
    return this.http.get(`http://localhost:5000/auth/google/callback?code=${code}`, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            const token = response.token;
            localStorage.setItem('token', token);

            // Decode the token to extract user information
            const decodedToken = jwtDecode(token) as any;
            console.log(decodedToken);
            const user = {
              id: decodedToken.id,
              email: decodedToken.email,
              name: decodedToken.name
            } as User;

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser')!) as User;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue.id;
  }
}
