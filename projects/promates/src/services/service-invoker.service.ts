import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { EndPointsService } from './end-points.service';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceInvokerService {
  private DEFAULT_HEADERS = {
    'Content-Type': 'application/json;charset=UTF-8'
  };

  private UPLOAD_HEADERS = {
    'Content-Type': undefined // 'multipart/form-data' //
  };

  public invoke(serviceId?: String, qParams?: any, payload?: any, headers?: any): Observable<any> {
    let _self: any = this;
    let conf = this.prepareHttpCall(serviceId, qParams, payload, headers);
    var _args = [conf.url];
    if (conf.method === 'get' || conf.method === 'delete') {
      _args.push({
        headers: conf.headers,
        params: conf.payload
      });
    } else {
      _args.push(conf.payload, {
        headers: conf.headers
      });
    }

    return _self.http[conf.method].apply(this.http, _args);
  }
  private prepareHttpCall(serviceId?: any, qParams?: any, payload?: any, headers?: any) {
    let HTTP_VERB_GET = 'get',
      HTTP_VERB_POST = 'post',
      HTTP_VERB_PUT = 'put',
      HTTP_VERB_DELETE = 'delete';

    let serviceConf = this.endpoints.getServiceInfo(serviceId);
    let _url, _verb, _headers = JSON.parse(JSON.stringify(this.DEFAULT_HEADERS));
    if (serviceId === 'post.submitresume' || serviceId === 'bt.post.uploadbotfuncfile') {
      _headers = JSON.parse(JSON.stringify(this.UPLOAD_HEADERS));
    }
    try {
      _verb = serviceConf.method;
      _url = serviceConf.endpoint;
      _url = this.resolveUrl(_url, qParams || {}, false);
    } catch (error) {
      throw new Error("Unable to find Endpoint or method");
    }

    _url += _url.indexOf('?') > -1 ? '&' : '?';
    _url += this.genRandQuery();

    if (_verb === HTTP_VERB_DELETE) {
      _verb = HTTP_VERB_POST;
      _headers['X-HTTP-Method-Override'] = HTTP_VERB_DELETE;
    }
    if (_verb === HTTP_VERB_PUT) {
      _verb = HTTP_VERB_POST;
      _headers['X-HTTP-Method-Override'] = HTTP_VERB_PUT;
    }
    if (!navigator.onLine) {
      this.notify.notify(this.translate.instant('check_internet'), 'error');
    }
    return {
      method: _verb,
      url: _url,
      headers: Object.assign(headers || {}, _headers), // Optional headers
      payload: payload || {}
      // cache: true
    };
  }

  private resolveUrl(toResolveUrl?: any, values?: any, deleteProp?: any) {
    let _regExToParamName = /\:([a-zA-Z]+)/g;
    return toResolveUrl.replace(_regExToParamName, function (matchStr?: any, valName?: any) {
      var r = values[valName];
      if (typeof r !== 'undefined' && typeof r !== null) {
        if (deleteProp) {
          delete values[valName];
        }
        // encodeURIComponent is applied because $http removes special characters like '#' from the query
        //return encodeURIComponent(r);
        return r;
      }
      return matchStr;
    });
  }

  private genRandQuery() {
    return 'rnd=' + Math.random().toString(36).substr(7);
  }

  public getUrl(serviceId: any) {
    let _url = this.endpoints.getServiceInfo(serviceId);
    return _url;
  }


  constructor(
    private endpoints: EndPointsService,
    private http: HttpClient,
    public notify: NotificationService,
    public translate: TranslateService,
  ) { }
}
