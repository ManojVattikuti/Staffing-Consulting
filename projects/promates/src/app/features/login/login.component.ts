import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../common/services/notification.service';
import { ServiceInvokerService } from '../../common/services/service-invoker.service';
import { AuthService } from '../../common/services/auth.service';
import { environment } from '@promates.environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  public route = inject(Router);
  constructor(
    private fb: FormBuilder,
    public notificationService: NotificationService,
    private serviceInvoker: ServiceInvokerService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'),
        ],
      ],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login Successful!', this.loginForm.value);
      this.notificationService.showSuccess('Login Successful!');
      this.loginForm.reset();
      this.authService.login();
    } else {
      console.log('Form not valid');
    }
  }

  navigateTo(path: String) {
    this.route.navigate([`${path}`], { skipLocationChange: environment.ENABLE_SKIP_LOCATION });
  }
}
