import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule,TranslateModule],
    providers:[TranslateService],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  constructor(public translate: TranslateService){}
}
