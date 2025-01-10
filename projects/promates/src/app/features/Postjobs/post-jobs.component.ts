import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../../common/components/loader/loader.component';
import { NotificationService } from '../../common/services/notification.service';
import { ServiceInvokerService } from '../../common/services/api-invoker.service';

@Component({
  selector: 'app-post-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDropdownModule, LoaderComponent],
  templateUrl: './post-jobs.component.html',
  styleUrl: './post-jobs.component.scss',
})
export class PostJobsComponent {
  jobForm: FormGroup;
  isSubmitting: boolean = false;
  savingInProgress: boolean = false;
  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  experienceLevels = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead'];
  public notificationService = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private serviceInvoker: ServiceInvokerService,
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      employmentType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      salaryRange: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      benefits: [''],
      applicationDeadline: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      console.log(this.jobForm.value);
      this.savingInProgress = true;
      this.serviceInvoker.invoke('post.job', {}, this.jobForm.value, {}).subscribe(
        (res: any) => {
          this.notificationService.showSuccess(res.message ? res.message : 'saved successfully');
          this.jobForm.reset();
          this.savingInProgress = false;
        },
        (err: any) => {
          this.savingInProgress = false;
          this.notificationService.showError(err);
        },
      );
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  markAllFieldsAsTouched(): void {
    Object.keys(this.jobForm.controls).forEach((field) => {
      const control = this.jobForm.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
