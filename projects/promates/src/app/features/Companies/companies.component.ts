import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceInvokerService } from '../../common/services/api-invoker.service';
import { NotificationService } from '../../common/services/notification.service';
import { LoaderComponent } from '../../common/components/loader/loader.component';
@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [LoaderComponent, CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent implements OnInit {
  loading: boolean = true;
  companies: any = [];
  public notificationService = inject(NotificationService);

  constructor(private serviceInvoker: ServiceInvokerService) {}

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.serviceInvoker.invoke('get.companies', {}).subscribe(
      (res: any) => {
        this.companies = res;
        this.loading = false;
      },
      (err) => {
        this.notificationService.notify('Something went wrong', 'errror');
        this.loading = false;
      },
    );
  }
}
