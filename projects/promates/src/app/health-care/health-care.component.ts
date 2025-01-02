import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-health-care',
  standalone: true,
  imports: [TranslateModule],
  providers:[TranslateService],
  templateUrl: './health-care.component.html',
  styleUrl: './health-care.component.scss'
})
export class HealthCareComponent {
  constructor(public translate: TranslateService){}
}
