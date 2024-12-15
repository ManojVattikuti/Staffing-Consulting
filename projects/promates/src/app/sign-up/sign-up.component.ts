import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '../../services/service-invoker.service';
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signupForm!: FormGroup;
  public route = inject(Router);
  constructor(private fb: FormBuilder,
    public notificationService: NotificationService,
    private serviceInvoker: ServiceInvokerService
  ) { }
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }
  get email() {
    return this.signupForm.get('email');
  } get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  checkPasswords(group: FormGroup) {
    const password = group?.get('password')?.value;
    const confirmPassword = group?.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }
  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Signup Successful!', this.signupForm.value); this.signupForm.reset();
    } else { console.log('Form not valid'); }
  }

  navigateToLogin(){
    this.route.navigate(['/login'],{skipLocationChange:environment.ENABLE_SKIP_LOCATION});
  }
}

