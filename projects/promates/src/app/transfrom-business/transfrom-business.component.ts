import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-transfrom-business',
  standalone: true,
  imports: [TranslateModule],
  providers:[TranslateService],
  templateUrl: './transfrom-business.component.html',
  styleUrl: './transfrom-business.component.scss'
})
export class TransfromBusinessComponent {
  constructor(public translate: TranslateService){}
}
