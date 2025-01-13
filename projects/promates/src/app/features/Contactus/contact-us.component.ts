import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../common/services/notification.service';
import { ServiceInvokerService } from '../../common/services/service-invoker.service';

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
  private notificationService = inject(NotificationService);
  private serviceInvoker = inject(ServiceInvokerService);

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      companyName: ['', Validators.required],
      companyLocation: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.serviceInvoker.invoke('app.test', {}, this.contactForm.value, {}).subscribe(
        (res: any) => {
          this.notificationService.showSuccess('saved successfully');
          this.contactForm.reset();
        },
        (err: any) => {
          this.notificationService.showSuccess('saved successfully');
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
