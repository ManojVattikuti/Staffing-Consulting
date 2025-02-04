import { Component ,inject} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
import { APP_PATHS } from '../../../common/constants/app.constants';
@Component({
  selector: 'app-transfrom-business',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './transfrom-business.component.html',
  styleUrl: './transfrom-business.component.scss',
})
export class TransfromBusinessComponent {
  public route = inject(Router);
  constructor(public translate: TranslateService) {}
  navigateToContactus(){
    this.route.navigate(['/'+APP_PATHS.CONTACT], {
          skipLocationChange: environment.ENABLE_SKIP_LOCATION,
        });
  }
}
