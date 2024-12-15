import { Component, inject, Input, OnInit } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() isLoginPage = false;
  public route = inject(Router);
  public authService = inject(AuthService);
  public notificationService = inject(NotificationService);
  subscription:Subscription = new Subscription();
  isAuthenticated:any;
  ngOnInit(): void {
    this.subscription.add(this.authService.authenticated$.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    }));
  }
  navigateToHome(){
    this.route.navigate(['home'],{skipLocationChange:environment.ENABLE_SKIP_LOCATION}); 
  }
  navigateToLogin(){
    this.route.navigate(['login'],{skipLocationChange:environment.ENABLE_SKIP_LOCATION}); 
  }

  logoutUser(){
    this.authService.logout()
    this.notificationService.notify("Logged out successfully",'success')
  }

  ngOnDestry(){
    this.subscription.unsubscribe();
  }
}
