import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CacheService } from './common/cache.service';
import { AuthenticateService } from './common/authenticate.service';
import { ToastTranslateService } from './common/toast-translate.service';
import { DefineFunction } from '../common/define/function.define';
import { CacheKeys } from '../common/define/cache-keys.define';
import { HOST_TEMPLATE } from '../common/define/host-domain.define';
import { IToken } from '../common/api/token';

@Injectable()
export class MoWbBaseApiService {
  merchantID: string;
  token: string;
  host: string;
  jsonHeader: any;
  fileHeader: any;
  normalHeader: any;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    // private _authService: AuthenticateService,
    private _toast: ToastTranslateService,
    private _cacheService: CacheService
  ) {
    const token = this.getToken();
    this.token = token ? `Bearer ${token}` : '';
    this.merchantID = token ? this.jwtHelper.decodeToken(token).merchant_id : '' ; // this._authService.jwtDecode().merchantID || '';
    this.host = `${HOST_TEMPLATE()}`;

    console.log('MoWbBaseApiService token=', token, ' userInfo= ', this.jwtHelper.decodeToken(token));

    this.jsonHeader = {
      'X-Merchant-ID': this.merchantID,
      Authorization: this.token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    this.fileHeader = {
      'X-Merchant-ID': this.merchantID,
      Authorization: this.token,
    };

    this.normalHeader = {
      'X-Merchant-ID': this.merchantID,
      Authorization: this.token,
    };
  }

  /**
   * fetch data
   * @param path
   * @param method
   * @param body
   * @param query
   * @param headerType
   * @param hostApi
   * @param isCache
   * @returns
   */

  public async fetchData(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body: any,
    query: any,
    hostApi?: string,
    headerType: 'FILE' | 'JSON' | 'NORMAL' = 'JSON',
    isCache: boolean = false
  ) {
    return await this.fetch(path, method, headerType, body, query, hostApi, isCache);
  }

  /**
   * fetch
   * @param path
   * @param method
   * @param headerType
   * @param body
   * @param query
   * @param hostApi
   * @param isCache
   * @returns
   */
  public async fetch(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    headerType: 'FILE' | 'JSON' | 'NORMAL',
    body: any,
    query: any,
    hostApi?: string,
    isCache: boolean = false
  ) {
    try{
      // console.log('fetch token =', this.getToken());
      let host = hostApi  ? `${hostApi}${path}?` : `${this.host}${path}?`;
      let _query: any = query ? query : {};
      _query.lang = 'vi';
      // anh Chung lên Pem thì mở dòng dưới
      // _query.pem =  encodeURIComponent(ENCRYPT_PEM(BUILD_PEM_OBJECT({isCheck:0,pathCheck:'/other',action:1}).replace('{{path-api}}', md5(`${this.host}${path}`))))
      if (_query) {
        host = `${host}${new URLSearchParams(_query)}`;
      }
      const cacheKey = CacheKeys.KEY_CACHE_FIELD_CONFIG(host);
      const config: any = {};
      config.method = method;
      config.mode = 'cors';
      config.headers = headerType === 'FILE' ? this.fileHeader : headerType === 'JSON' ? this.jsonHeader : this.normalHeader;
      if (body) {
        config.body = headerType === 'FILE' ? body : JSON.stringify(body);
      }
      if (isCache) {
        const cacheData = this._cacheService.get(cacheKey);
        if (cacheData) {
          return cacheData;
        }
      }
      const rawResponse = await fetch(host, config);
      if (rawResponse.status === 401) {
        console.log('Loi 401 ', rawResponse, ' config=', config);
        // const content1 = await rawResponse.json();
        //
        this._toast.show('error','Lỗi 401 !!!');
        setTimeout(() => {
          this._cacheService.clearAll();
          DefineFunction.isResponse401(rawResponse);
        }, 1000);
        return;
      }
      const content = await rawResponse.json();
      if (content.code && content.code === 500 && content.message) {
        this._toast.show(
          'error',
          content.message
        );
        return content;
      }
      if (isCache) {
        this._cacheService.set(cacheKey, content);
      }
      return content;
    } catch(err) {
      console.log('fetch error=', err);
    }

  }

  setCacheValue(value: any, key: string, expired?: number) {
    this._cacheService.set(key, value);
  }

  deleteCache(key: string) {
    this._cacheService.clear(key);
  }

  deleteCacheStartWith(key: string) {
    // console.log('deleteCacheStartWith=',key);
    this._cacheService.deleteKeyStartWith(CacheKeys.KEY_CACHE_FIELD_CONFIG(key));
  }

  getCache(key: string) {
    return this._cacheService.get(key);
  }

  public getToken() {
    const token = this._cacheService.get(CacheKeys.KEY_CACHE_TOKEN) || '';
    return token || undefined;
  }

  public updateToken() {
    const token = this.getToken();
    this.token = token ? `Bearer ${token}` : '';
    this.merchantID = token ? this.jwtHelper.decodeToken(token).merchant_id : '' ;

    this.jsonHeader = {
      'X-Merchant-ID': this.merchantID,
      Authorization: this.token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    this.fileHeader = {
      'X-Merchant-ID': this.merchantID,
      Authorization: this.token,
    };

    this.normalHeader = {
      'X-Merchant-ID': this.merchantID,
      Authorization: this.token,
    };

    console.log('updateToken token=', token, ' merchantID=', this.merchantID);
  }
}
