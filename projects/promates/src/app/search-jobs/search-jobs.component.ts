import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceInvokerService } from '../../services/api-invoker.service';
@Component({
  selector: 'app-search-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './search-jobs.component.html',
  styleUrl: './search-jobs.component.scss'
})
export class SearchJobsComponent implements OnInit {

  constructor(private serviceInvoker: ServiceInvokerService) {

  }

  listing: any = [];
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
  searchJobs :any = [];
  dummyListing :any =  [
    {
      title:"Content Manager",
      description:"San Francisco, CA, USA"
    },
    {
      title:"Content Manager",
      description:"San Francisco, CA, USA"
    },
    {
      title:"Content Manager",
      description:"San Francisco, CA, USA"
    },
    {
      title:"Content Manager",
      description:"San Francisco, CA, USA"
    },
    {
      title:"Content Manager",
      description:"San Francisco, CA, USA"
    }
  ];

  ngOnInit() {
    this.getListing()

  }


  getListing() {
    this.serviceInvoker.invoke('get.jobListing').subscribe((res: any) => {

    }, (err) => {
      this.searchJobs = this.searchJobsDummy;
      this.listing = this.dummyListing
    })

  }
}
