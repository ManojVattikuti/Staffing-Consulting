import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-retail',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './retail.component.html',
  styleUrl: './retail.component.scss',
})
export class RetailComponent {
  constructor(public translate: TranslateService) {}
}
