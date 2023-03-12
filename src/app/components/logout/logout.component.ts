
import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewRef, Injector, ViewContainerRef } from '@angular/core';
import { CacheService } from '../../api/common/cache.service';
import { CacheKeys } from '../../common/define/cache-keys.define';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE, CURRENT_LANG } from 'src/app/common/define/language.define';
import { DefineConstants } from 'src/app/common/define/constants.define';
import { Router } from '@angular/router';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbBaseApiService } from 'src/app/api/baseApi';
import { BUILD_PEM_OBJECT } from 'src/app/common/define/crypto.define';
import { HOST_ADM } from 'src/app/common/define/host-domain.define';

@Component({
  template: "<div></div>",
  selector: 'mo-wb-components-logout',
})
export class MoWbLogoutComponent implements OnInit {

  constructor(
    public _cacheService: CacheService,
    private _baseService: MoWbBaseApiService,
    private _toastTranslate: ToastTranslateService,
    protected _router: Router,
  ) {
  }

  ngOnInit() {
    this.logout();
  }

  ngAfterViewInit() {
  }

  async logout() {
    try {
      const sessionMiniPOS = CacheService.Get(CacheKeys.KEY_CACHE_SESSION_MINIPOS);
      // if (sessionMiniPOS) {
      //   await this._moLibMiniPOSService.finishSession(sessionMiniPOS.id);
      // }
      const lang = CURRENT_LANG();
      const pathLogout = localStorage.getItem(CacheKeys.KEY_CACHE_ORIGIN_DOMAIN);
      // try {
      //   const categories = this._cacheService.get(CacheKeys.KEY_CACHE_CATEGORIES_DASHBOARD);
      //   if (categories && categories.values && !categories.values.find(item => !(item.cards instanceof Array))) {
      //     const pem: IPem = { pathCheck: DefineConstants.ROOT_PATH_DASHBOARD, action: DefineConstants.PERMISSION_ACTION_VIEW };
      //     await this._dashBoardService.uppAllDashboards(pem, categories.values);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
      // try {
      //   if (this._socketService) {
      //     this._socketService.disconnect();
      //   }
      //   if (this._phoneRTCService) {
      //     this._phoneRTCService.cancel();
      //   }
      //   await this.requestLogout();
      // } catch (error) {
      //   console.log(error);
      // }
      const response = await this.requestLogout();
      console.log('logout response=', response);
      this._cacheService.clearAll();
      localStorage.setItem(LANGUAGE.KEY_LANGUAGE_STORAGE, lang);
      this._cacheService.set(CacheKeys.KEY_CACHE_LOGOUT, 'logout');
      // this._globalEventService.popupCallSubject.next({ type: 'displayPopup', data: false });
      // if (this._phoneRTCService) {
      //   this._phoneRTCService.disconnectStringee();
      // }
      if (pathLogout) {
        localStorage.setItem(CacheKeys.KEY_CACHE_ORIGIN_DOMAIN, pathLogout);
        window.location.href = pathLogout;
        return;
      }
      //this.close(e);
      await this._router.navigateByUrl(`login?lang=${lang}`);
      this._cacheService.clear(CacheKeys.KEY_CACHE_LOGOUT);
    } catch (error) {
      this._toastTranslate.show('error', 'alert_connect_server_error');
    }

  }

  private async requestLogout() {
    const query: any = {
      pem: BUILD_PEM_OBJECT({ isCheck: 0, pathCheck: '/other', action: 1 })
    }
    
    const response = await this._baseService.fetch(`logout`, 'POST', 'JSON', null, query, HOST_ADM(), false);
    // return new Promise((resolve, reject) => {
    //   this._admService.post(`logout?pem=${BUILD_PEM_OBJECT({ isCheck: 0, pathCheck: '/other', action: 1 })}`, null).subscribe(res => {
    //     resolve(res);
    //   }, err => { reject(err); });
    // });
    console.log('requestLogout response=',response);
    return response;
  }
  
  ngOnDestroy() {

  }


}
