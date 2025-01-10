import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './logistics.component.html',
  styleUrl: './logistics.component.scss',
})
export class LogisticsComponent {
  constructor(public translate: TranslateService) {}
}
