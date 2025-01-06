import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceInvokerService } from '../../services/api-invoker.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { NotificationService } from '../../services/notification.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-search-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, LoaderComponent,NgbPaginationModule],
  templateUrl: './search-jobs.component.html',
  styleUrl: './search-jobs.component.scss'
})
export class SearchJobsComponent implements OnInit {

  constructor(private serviceInvoker: ServiceInvokerService,
    public notificationService: NotificationService,
  ) {

  }

  listing: any = [];
  searchJobsQuery: any = {
    title: '',
    location: '',
    type: ''
  }
  jobListingQuery: any = {
    location: '',
    type: ''
  }
  searchJobsDummy = [
    {
      "title": "Angular Java Spring boot SQL Developer",
      "description": "We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.",
      "date": "09/27/2024",
      "type": "Full time",
      "location": "Hyderabad"
    },
    {
      "title": "Angular Java Spring boot SQL Developer",
      "description": "We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.",
      "date": "09/27/2024",
      "type": "Full time",
      "location": "Hyderabad"
    },
    {
      "title": "Angular Java Spring boot SQL Developer",
      "description": "We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.",
      "date": "09/27/2024",
      "type": "Full time",
      "location": "Hyderabad"
    },
    {
      "title": "Angular Java Spring boot SQL Developer sdf",
      "description": "We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.",
      "date": "09/27/2024",
      "type": "Full time",
      "location": "Hyderabad"
    },
    {
      "title": "Angular Java Spring boot SQL Developer",
      "description": "We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.",
      "date": "09/27/2024",
      "type": "Full time",
      "location": "Hyderabad"
    }
  ]

  jobTypes = [
    {
      title: "Contract",
      value: "Contract"
    },
    {
      title: "Contract to Hire",
      value: "Contract to Hire"
    },
    {
      title: "Permanent",
      value: "Permanent"
    },
    {
      title: "Offshore",
      value: "Offshore"
    }
  ]
  searchJobs: any = [];
  dummyListing: any = [
    {
      title: "Content Manager",
      description: "San Francisco, CA, USA"
    },
    {
      title: "Content Manager",
      description: "San Francisco, CA, USA"
    },
    {
      title: "Content Manager",
      description: "San Francisco, CA, USA"
    },
    {
      title: "Content Manager",
      description: "San Francisco, CA, USA"
    },
    {
      title: "Content Manager",
      description: "San Francisco, CA, USA"
    }
  ];

  loading: boolean = false;
  ngOnInit() {
    this.getListing()

  }
  page = 1;
  limit = 10;

  getListing() {
    this.loading = true;
    // let params = {
    //   page: this.page,
    //   limit: this.limit
    // }
    this.serviceInvoker.invoke('get.jobs', {}).subscribe((res: any) => {
      this.searchJobs = res;
      this.loading = false;
    }, (err) => {
      this.searchJobs = [];
      this.listing = [];
      this.loading = false;
      this.notificationService.showError(err)
    })
  }

  selectedJobSearch: any = {};
  selectedJobListing: any = {};
  jobtypeSelection(job: any, type: any) {
    if (type === 'search') {
      this.searchJobsQuery.type = job.value;
      this.selectedJobSearch = job;
    } else if (type === 'listing') {
      this.jobListingQuery.type = job.value;
      this.selectedJobListing = job;
    }
  }

  getSearchJobs() {
    this.loading = true;
    let params: any = {
      page: this.page,
      limit: this.limit
    }
    if (this.searchJobsQuery.title) {
      params.limit = params.limit + '&title=' + this.searchJobsQuery.title;
    }
    if (this.searchJobsQuery.location) {
      params.limit = params.limit + '&location=' + this.searchJobsQuery.location;
    }
    if (this.searchJobsQuery.type) {
      params.limit = params.limit + '&type=' + this.searchJobsQuery.type;
    }
    this.serviceInvoker.invoke('get.jobs', params).subscribe((res: any) => {
      this.searchJobs = res;
      this.loading = false;
    }, (err) => {
      this.searchJobs = [];
      this.loading = false;
      this.notificationService.showError(err)
    })
  }

  listingloading: boolean = false;
  getJobListing() {
    this.listingloading = true;
    let params: any = {
      page: this.page,
      limit: this.limit
    }
    if (this.jobListingQuery.location) {
      params.limit = params.limit + '&location=' + this.jobListingQuery.location;
    }
    if (this.jobListingQuery.type) {
      params.limit = params.limit + '&type=' + this.jobListingQuery.type;
    }
    this.serviceInvoker.invoke('get.jobs', params).subscribe((res: any) => {
      this.listing = res;
      this.listingloading = false;
    }, (err) => {
      this.listing = [];
      this.listingloading = false;
      this.notificationService.showError(err)
    })
  }
}
