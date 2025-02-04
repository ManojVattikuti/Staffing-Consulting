import { Component,inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
import { APP_PATHS } from '../../../common/constants/app.constants';
@Component({
  selector: 'app-about-sec',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './about-sec.component.html',
  styleUrl: './about-sec.component.scss',
})
export class AboutSecComponent {
     public route = inject(Router);
  constructor(public translate: TranslateService) {}

  navigateToContactus(){
    this.route.navigate(['/'+APP_PATHS.CONTACT], {
          skipLocationChange: environment.ENABLE_SKIP_LOCATION,
        });
  }
}
