import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-submit-resume',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  templateUrl: './submit-resume.component.html',
  styleUrl: './submit-resume.component.scss'
})
export class SubmitResumeComponent {

}
