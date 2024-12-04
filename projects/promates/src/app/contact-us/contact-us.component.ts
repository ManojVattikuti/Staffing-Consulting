import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '../../services/service-invoker.service';
@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;
  constructor(private fb: FormBuilder,
    public notificationService: NotificationService,
    private serviceInvoker:ServiceInvokerService
  ) { }
  ngOnInit(): void {
    this.contactForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        message: ['', Validators.required]
      });
  }
  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value)
        this.serviceInvoker.invoke('app.test',{},this.contactForm.value,{}).subscribe((res:any)=>{

        },(err:any)=>{
          this.notificationService.showSuccess('saved successfully')
        })
    } else {
      this.markAllFieldsAsTouched();
    }
  }

   // Mark all form controls as touched
   markAllFieldsAsTouched(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
