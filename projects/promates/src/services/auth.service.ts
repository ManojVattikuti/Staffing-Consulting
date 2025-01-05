import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private authenticated = false;
  private authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();
  token: any;
  userData: any;

  login() {
    // logic to authenticate the user
    this.authenticated.next(true);
  }

  logout() {
    // logic to log out the user
    this.clearUserData();
    this.authenticated.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticated.getValue();
  }

  getToken() {
    return this.token || null;
  }
  storeUserData(token: string, userData: any): void {
    if (token && userData) {
      this.token = token;
      this.userData = userData;
      localStorage.setItem('google_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
    }

  }

  getUserData() {
    const token = localStorage.getItem('google_token');
    const userData = localStorage.getItem('user_data');
    return token && userData ? { token, userData: JSON.parse(userData) } : null;
  }

  clearUserData(): void {
    if (this.token) {
      this.token = null;
    }
    localStorage.removeItem('google_token');
    localStorage.removeItem('user_data');
  }
}
