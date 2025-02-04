import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@promates.environments/environment';
import { APP_PATHS } from '../../../common/constants/app.constants';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent  implements OnInit {
   public route = inject(Router);
  constructor(public translate: TranslateService) {}

  ngOnInit(){

  }
  navigateToContactus(){
    this.route.navigate(['/'+APP_PATHS.CONTACT], {
          skipLocationChange: environment.ENABLE_SKIP_LOCATION,
        });
  }
}
