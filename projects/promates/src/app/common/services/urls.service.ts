import { Injectable } from '@angular/core';
import { environment } from '@promates.environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EndPointsService {
  public API_SERVER_URL: String;
  private apiList: any = {};

  constructor() {
    if (environment.production) {
      this.API_SERVER_URL = window.location.protocol + '//' + window.location.host;
    } else {
      this.API_SERVER_URL = environment['API_SERVER_URL'];
    }
    this.init();
  }

  public getServiceInfo(serviceId?: any) {
    return this.apiList[serviceId];
  }
  public init() {
    this.apiList['post.submitresume'] = {
      endpoint: this.API_SERVER_URL + '/api/candidates',
      method: 'post',
    };

    this.apiList['get.jobListing'] = {
      endpoint: this.API_SERVER_URL + '/api/joblisting',
      method: 'get',
    };

    this.apiList['post.contactus'] = {
      endpoint: this.API_SERVER_URL + '/api/contact',
      method: 'post',
    };
    this.apiList['get.contactus'] = {
      endpoint: this.API_SERVER_URL + '/api/contact',
      method: 'get',
    };

    this.apiList['post.job'] = {
      endpoint: this.API_SERVER_URL + '/api/job-postings',
      method: 'post',
    };

    this.apiList['app.login'] = {
      endpoint: this.API_SERVER_URL + '/api/auth/login',
      method: 'post',
    };

    this.apiList['get.jobs'] = {
      endpoint: this.API_SERVER_URL + '/api/job-postings',
      method: 'get',
    };

    this.apiList['get.companies'] = {
      endpoint: this.API_SERVER_URL + '/api/companies',
      method: 'get',
    };
  }
}
