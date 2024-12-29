import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutus',
  standalone: true,
 imports: [TranslateModule],
  providers:[TranslateService],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss'
})
export class AboutusComponent {
 constructor(public translate: TranslateService){}
}
