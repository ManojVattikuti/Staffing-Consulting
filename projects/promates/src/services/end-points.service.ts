import { Injectable } from '@angular/core';
import { environment } from '@promates.environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EndPointsService {

  // private API_URL_PREFIX = "/api";
  private API_URL_PREFIX = "/workbench/api";
  private API_VERSION_PREFIX = '/1.1';
  private SERVER_URL: String = "";
  public API_SERVER_URL: String;
  private serviceList: any = {};
  private workbenchValue = "banking";


  constructor() {
    if (environment.production) {
      this.SERVER_URL = window.location.protocol + '//' + window.location.host;
      this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX;
    } else {
      this.API_SERVER_URL = environment['API_SERVER_URL'] + this.API_URL_PREFIX;
    }
    this.init();
  }

  public getServiceInfo(serviceId?: any) {
    return this.serviceList[serviceId];
  }
  public init() {
    this.serviceList['app.test']={
      endpoint : this.API_SERVER_URL +'/test',
      method:'post'
    }
  }
}
