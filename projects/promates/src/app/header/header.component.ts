import { Component, inject, Input, OnInit } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { ServiceInvokerService } from '../../services/api-invoker.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationComponent, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() isLoginPage = false;
  public route = inject(Router);
  public authService = inject(AuthService);
  public notificationService = inject(NotificationService);
  subscription: Subscription = new Subscription();
  isAuthenticated: any;
  logginInProgress: Boolean = false;
  constructor(private serviceInvoker: ServiceInvokerService,
    private http: HttpClient,
  ) {

  }
  ngOnInit(): void {
    this.subscription.add(this.authService.authenticated$.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    }));
  }
  navigateToHome() {
    this.route.navigate([''], { skipLocationChange: environment.ENABLE_SKIP_LOCATION });
  }
  navigateToLogin() {
    this.logginInProgress = true;
    this.serviceInvoker.invoke('app.login', {}, {}, {}).subscribe((res: any) => {
      this.authService.storeUserData(res.token, res.user)
      this.notificationService.showSuccess('Login Successful!');
      this.authService.login();
      this.navigateToHome();
      this.logginInProgress = false;
    }, (err: any) => {
      this.logginInProgress = false;
       this.notificationService.notify('Login Failed! check whether google account is logged in','error');
    })

  }

  logoutUser() {
    this.logginInProgress = true;

    setTimeout(() => {
      this.logginInProgress = false;
      this.authService.logout();
      this.navigateToHome();
      this.notificationService.notify("Logged out successfully", 'success');
    }, 1000);
  }

  ngOnDestry() {
    this.subscription.unsubscribe();
  }
}
