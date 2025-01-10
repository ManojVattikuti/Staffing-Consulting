import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-build-business-needs',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './build-business-needs.component.html',
  styleUrl: './build-business-needs.component.scss',
})
export class BuildBusinessNeedsComponent {
  constructor(public translate: TranslateService) {}
}
