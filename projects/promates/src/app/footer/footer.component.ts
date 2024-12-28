import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_PATHS } from '../../app/constants/app.constants';
import { environment } from '@promates.environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  providers: [Router],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() isLoginPage = false;
  APP_PATHS = APP_PATHS;
  constructor(private router: Router) {

  }
  navigateTo(event: Event, path: any): void {
    event.preventDefault();
    this.router.navigate([`/${path}`], { skipLocationChange: environment.ENABLE_SKIP_LOCATION });
  }
}
