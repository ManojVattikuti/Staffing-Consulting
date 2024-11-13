import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { FreqAskedQueComponent } from '../freq-asked-que/freq-asked-que.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { AboutSecComponent } from "../about-sec/about-sec.component";
import { BuildBusinessNeedsComponent } from "../build-business-needs/build-business-needs.component";
import { TransfromBusinessComponent } from "../transfrom-business/transfrom-business.component";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [BannerComponent, FreqAskedQueComponent, FeedbackComponent, AboutSecComponent, BuildBusinessNeedsComponent, TransfromBusinessComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

}
