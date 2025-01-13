import { Component } from '@angular/core';
import { BannerComponent } from '../features/Home/banner/banner.component';
import { FreqAskedQueComponent } from '../features/Home/freq-asked-que/freq-asked-que.component';
import { FeedbackComponent } from '../features/Home/feedback/feedback.component';
import { AboutSecComponent } from '../features/Home/about-sec/about-sec.component';
import { BuildBusinessNeedsComponent } from '../features/Home/build-business-needs/build-business-needs.component';
import { TransfromBusinessComponent } from '../features/Home/transfrom-business/transfrom-business.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BannerComponent,
    FreqAskedQueComponent,
    FeedbackComponent,
    AboutSecComponent,
    BuildBusinessNeedsComponent,
    TransfromBusinessComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
