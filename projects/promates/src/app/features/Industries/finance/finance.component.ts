import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss',
})
export class FinanceComponent {
  constructor(public translate: TranslateService) {}
}
