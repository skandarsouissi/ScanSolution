import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token);
  }

  login(email: string, password: string): Observable<boolean> {
    // Implement actual login logic here
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem('token', 'fake-jwt-token');
        this.isLoggedInSubject.next(true);
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
