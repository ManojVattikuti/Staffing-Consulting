import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-information-technology',
  standalone: true,
 imports: [TranslateModule],
  providers:[TranslateService],
  templateUrl: './information-technology.component.html',
  styleUrl: './information-technology.component.scss'
})
export class InformationTechnologyComponent {
 constructor(public translate: TranslateService){}
}
