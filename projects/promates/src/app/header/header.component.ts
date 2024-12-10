import { Component, inject, Input } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isLoginPage = false;
  public route = inject(Router);
  navigateToHome(){
    this.route.navigate(['home'],{skipLocationChange:environment.ENABLE_SKIP_LOCATION}); 
  }
  navigateToLogin(){
    this.route.navigate(['login'],{skipLocationChange:environment.ENABLE_SKIP_LOCATION}); 
  }
}
