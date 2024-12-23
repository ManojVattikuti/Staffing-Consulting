import { Injectable } from '@angular/core';
import { environment } from '@promates.environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EndPointsService {

  public API_SERVER_URL: String;
  private apiList: any = {};


  constructor() {
    if (environment.production) {
      this.API_SERVER_URL = window.location.protocol + '//' + window.location.host;
    } else {
      this.API_SERVER_URL = environment['API_SERVER_URL']
    }
    this.init();
  }

  public getServiceInfo(serviceId?: any) {
    return this.apiList[serviceId];
  }
  public init() {
    this.apiList['post.submitresume'] = {
      endpoint: this.API_SERVER_URL + '/api/candidates',
      method: 'post'
    }
  }
}
