import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() overlay: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}