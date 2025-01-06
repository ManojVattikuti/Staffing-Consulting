import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceInvokerService } from '../../services/api-invoker.service';
import { NotificationService } from '../../services/notification.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [LoaderComponent,CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit {
  constructor(
    private serviceInvoker: ServiceInvokerService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.getCompanies();
  }
  loading: boolean = true;
  companies: any = [];
  getCompanies() {
    this.serviceInvoker.invoke('get.companies', {}).subscribe((res: any) => {
      this.companies = res;
      this.loading = false;

    }, (err) => {
      this.notificationService.notify('Something went wrong', 'errror');
      this.loading = false;

    })
  }

}
