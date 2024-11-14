import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-freq-asked-que',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './freq-asked-que.component.html',
  styleUrl: './freq-asked-que.component.scss'
})
export class FreqAskedQueComponent {

}
