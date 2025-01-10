import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about-sec',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './about-sec.component.html',
  styleUrl: './about-sec.component.scss',
})
export class AboutSecComponent {
  constructor(public translate: TranslateService) {}
}
