import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-life-sciences',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './life-sciences.component.html',
  styleUrl: './life-sciences.component.scss',
})
export class LifeSciencesComponent {
  constructor(public translate: TranslateService) {}
}
