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
  ) { }

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
 logginInProgress: Boolean = false;
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.logginInProgress = true;
      this.serviceInvoker.invoke('app.login', {}, this.loginForm.value, {}).subscribe((res: any) => {
        this.authService.storeUserData(res.token, res.user);
        this.authService.login();
        this.route.navigate([''], {
          skipLocationChange: environment.ENABLE_SKIP_LOCATION,
        });
        this.loginForm.reset();
        this.authService.login();
        this.notificationService.showSuccess('Login Successful!');
        this.logginInProgress = false;
      },(err: any) => {
        this.notificationService.showError(err);
        this.logginInProgress = false;
      });
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
