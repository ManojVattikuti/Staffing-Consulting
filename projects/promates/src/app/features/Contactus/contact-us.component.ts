import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../common/services/notification.service';
import { ServiceInvokerService } from '../../common/services/api-invoker.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  providers: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;
  savingInProgress: boolean = false;
  public notificationService = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private serviceInvoker: ServiceInvokerService,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      companyName: ['', Validators.required],
      companyLocation: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.savingInProgress = true;
      this.serviceInvoker.invoke('post.contactus', {}, this.contactForm.value, {}).subscribe(
        (res: any) => {
          this.notificationService.showSuccess(res.message ? res.message : 'saved successfully');
          this.contactForm.reset();
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

  // Mark all form controls as touched
  markAllFieldsAsTouched(): void {
    Object.keys(this.contactForm.controls).forEach((field) => {
      const control = this.contactForm.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
