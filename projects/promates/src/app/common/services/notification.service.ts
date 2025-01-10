import { Injectable, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
declare const window: any;
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.init();
  }
  private windowElement: any;

  showSuccess(message?: any) {
    this.toastr.success(message);
  }
  notify(notifyInfo?: any, type?: any) {
    if (type === 'info') {
      this.toastr.info(notifyInfo);
    }
    if (type === 'error') {
      this.toastr.error(notifyInfo);
    }
    if (type === 'success') {
      this.toastr.success(notifyInfo);
    }
    if (type === 'warning') {
      this.toastr.warning(notifyInfo);
    }
  }
  showError(err?: any, fbMsg?: string) {
    const errMsg =
      (err?.error && err?.error?.message) ||
      (err?.error?.errors && err.error.errors[0] && err.error.errors[0].msg) ||
      (err?.error && err?.error?.err);
    this.notify(errMsg || fbMsg || this.translate.instant('wb_somethingThingWrong'), 'error');
  }
  post(payload?: any) {
    try {
      let message: any = {
        action: 'NotificationService',
      };
      if (payload) {
        message.payload = payload;
      }

      window.parent.postMessage(message, '*');
    } catch (error) {
      console.log(error);
    }
  }
  encodeMsg = (msg?: any) => {
    msg = msg || '';
    return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  init() {
    let tempObj: any = {
      notify: this.notify,
      toastr: this.toastr,
    };
    window.NotificationService = tempObj;
  }
}
