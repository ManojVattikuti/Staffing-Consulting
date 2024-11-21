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
        this.serviceInvoker.invoke('app.test').subscribe((res:any)=>{
          console.log("asd")
        },(err:any)=>{
          this.notificationService.showError(err)
        })
    } else {
      this.notificationService.notify("Please fill the mandatory fields", "warning")
    }
  }

  get firstName() { return this.contactForm.get('firstName'); } get lastName() { return this.contactForm.get('lastName'); } get email() { return this.contactForm.get('email'); } get message() { return this.contactForm.get('message'); }
}
