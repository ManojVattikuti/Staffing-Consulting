import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-consulting',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './consulting.component.html',
  styleUrl: './consulting.component.scss',
})
export class ConsultingComponent {
  constructor(public translate: TranslateService) {}
}
