import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'app-post-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDropdownModule, LoaderComponent],
  templateUrl: './post-jobs.component.html',
  styleUrl: './post-jobs.component.scss'
})
export class PostJobsComponent implements OnInit {
  jobForm: FormGroup;
  isSubmitting: boolean = false;

  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  experienceLevels = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead'];

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      salary: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      benefits: [''],
      applicationDeadline: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.jobForm.valid) {
      console.log(this.jobForm.value);
      // Here you would typically call a service to save the job posting
    }
  }
}
