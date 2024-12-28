import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private authenticated = false;
  private authenticated = new BehaviorSubject<boolean>(false); 
  authenticated$ = this.authenticated.asObservable();

  login() {
    // logic to authenticate the user
    this.authenticated.next(true);
  }

  logout() {
    // logic to log out the user
    this.authenticated.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticated.getValue();
  }

  getToken(){
    return 'test'
  }
}
