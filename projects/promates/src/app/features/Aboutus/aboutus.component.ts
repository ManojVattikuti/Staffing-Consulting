import { Component,inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
import { APP_PATHS } from '../../common/constants/app.constants';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss',
})
export class AboutusComponent {
     public route = inject(Router);
  constructor(public translate: TranslateService) {}

  navigateToContactus(){
    this.route.navigate(['/'+APP_PATHS.CONTACT], {
          skipLocationChange: environment.ENABLE_SKIP_LOCATION,
        });
  }
}
