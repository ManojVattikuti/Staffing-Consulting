import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-staffing',
  standalone: true,
  imports: [TranslateModule],
  providers: [TranslateService],
  templateUrl: './staffing.component.html',
  styleUrl: './staffing.component.scss',
})
export class StaffingComponent {
  constructor(public translate: TranslateService) {}
}
