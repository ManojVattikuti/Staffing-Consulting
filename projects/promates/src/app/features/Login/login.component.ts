import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../common/services/notification.service';
import { ServiceInvokerService } from '../../common/services/api-invoker.service';
import { Router } from '@angular/router';
import { environment } from '@promates.environments/environment';
import { AuthService } from '../../common/services/auth.service';

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
  private authService = inject(AuthService);
  public notificationService = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private serviceInvoker: ServiceInvokerService,
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
    this.route.navigate([`${path}`], {
      skipLocationChange: environment.ENABLE_SKIP_LOCATION,
    });
  }
}