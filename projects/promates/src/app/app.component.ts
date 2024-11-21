import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { $localize } from '@angular/localize/init';
import { BannerComponent } from "./banner/banner.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from './footer/footer.component';
import { NotificationService } from '../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TranslateModule],
  providers:[],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = $localize`:Title for the app:Welcome to our application!`;
  welcomeMessage: string = $localize`Welcome to our localized app!`;
}
