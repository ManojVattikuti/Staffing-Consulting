import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router,NavigationEnd  } from '@angular/router';
import { $localize } from '@angular/localize/init';
import { BannerComponent } from "./banner/banner.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from './footer/footer.component';
import { NotificationService } from '../services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
declare const AOS :any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TranslateModule],
  providers: [Router],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(translate: TranslateService,private router: Router,private authService:AuthService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    let tokenData = this.authService.getUserData();
    if(tokenData && tokenData.token){
      this.authService.login(); 
      this.authService.storeUserData(tokenData.token,tokenData.userData);
      
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Only react to NavigationEnd events
    ).subscribe(() => {
      setTimeout(() => {
        AOS.refreshHard()
      }, 100);

      window.scrollTo(0, 0); // Scroll to the top
    });
  }
  title = $localize`:Title for the app:Welcome to our application!`;
  welcomeMessage: string = $localize`Welcome to our localized app!`;
  isLoginPage = true;

}


