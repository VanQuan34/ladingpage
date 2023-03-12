import { BUILD_PEM_OBJECT } from '../../common/define/crypto.define';
import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { DataLogin } from './api/login.model';
import { ToastTranslateService } from '../../api/common/toast-translate.service';
import { DefineConstants } from '../../common/define/constants.define';
import { Observable, timer } from 'rxjs';
import { AuthenticateService } from '../../api/common/authenticate.service';
import { SettingService } from '../../api/common/setting.service';
import { CacheService } from '../../api/common/cache.service';
import { CacheKeys } from '../../common/define/cache-keys.define';
import { CURRENT_LANG } from '../../common/define/language.define';
import { DOMAIN_GET_SOURCES_STATIC } from '../../common/define/host-domain.define';
import { DefinePattern } from '../../common/define/pattern.define';
import { WEB_VERSION } from '../../common/define/version.define';
import { RecaptchaComponent } from 'ng-recaptcha';
import { IPem } from '../../common/api/pem';

@Component({
  selector: 'mo-wb-components-login',
  styleUrls: ['login.component.scss'],
  templateUrl: './login.component.html'
})
export class MoWbLoginComponent implements OnInit {

  public isLoading: boolean = false;
  public dataLogin: DataLogin;
  public messErrorUsers: string;
  public messErrorPass: string;
  public domain_static: string;
  public isShowDomainInput: boolean;
  public domain: string;
  public messErrorDomain: string;
  public lang: string = 'vi';
  public account_id: string;
  public merchantID: any;
  public isChangePass: boolean;
  public isCheck: boolean;
  public config: any;
  public account: any;
  // public validPatternPass: Array<IValidPattern>;
  public validRequiredPass: any;
  public isRootComponent = true;
  public webVersion: string;
  public isVerifyRecaptcha: boolean = false;
  public hasRecaptcha: boolean = false;
  public isLoginMobio: boolean = false;
  public isShowPassword: boolean = false;

  @Input() type!: string;

  @ViewChild('userNameInput') userNameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('domainInput') domainInput!: ElementRef;
  @ViewChild('reCaptcha') reCaptcha!: RecaptchaComponent;
  // @ViewChildren(MoWbPatternComponent) viewPasswordShared!: QueryList<MoWbPatternComponent>;

  constructor(
    private _router: Router,
    // private _adminRequest: ApiRequestAdminService,
    private _settingService: SettingService,
    private _authService: AuthenticateService,
    private _cacheService: CacheService,
    private _toast: ToastTranslateService,
    // private _MoWbTenantConfigService: MoWbTenantConfigService,
    // private _MoWbLoginService: MoWbLoginService,
    // private _displayTypeService: MoWbLayoutDisplayTypeService,
  ) {
    this.isLoading = false;
    this.domain_static = DOMAIN_GET_SOURCES_STATIC();
    this.messErrorUsers = '';
    this.messErrorPass = '';
    this.domain = '';
    this.isShowDomainInput = false;
    this.isLoginMobio = false;
    this.messErrorDomain = '';
    this.dataLogin = {
      userName: '',
      password: ''
    };
    this.validRequiredPass = { isRequired: true, message: 'i18n_password_is_required' };
    // this.validPatternPass = new Array();
    this.merchantID = '';
    this.account_id = '';
    this.account = {
      old_password: '',
      new_password: '',
      confirm_password: ''
    };
    this.isChangePass = false;
    this.isCheck = false;
    this.config = '';
    this.webVersion = WEB_VERSION;
    this.isShowDomainInput = this._cacheService.get(CacheKeys.KEY_CACHE_SHOW_DOMAIN_CONFIG_LOGIN);
    const elementAnimation: HTMLDivElement = document.getElementById('mo-animation-loading') as any;
    if (elementAnimation) {
      elementAnimation.remove();
    }
  }

  ngOnInit() {
    this.lang = CURRENT_LANG();
    // const hostName = window.location.hostname;
    // const urlParams = new URLSearchParams(window.location.search);
    // const source = urlParams.get('source');
    // if (!source && DefineConstants.LIST_DOMAIN_MSB.some(domain => hostName.indexOf(domain) >= 0)) {
    //   this.dataLogin.source = 'MSB';
    // }
    // if (!this.isRootComponent) {
    //   return;
    // }
    // const webVersion = this._cacheService.get(CacheKeys.KEY_CACHE_WEB_VERSION);
    // if (!webVersion) {
    //   this._cacheService.set(CacheKeys.KEY_CACHE_WEB_VERSION, this.webVersion, CacheService.CACHE_EXPIRE_NONE);
    // }
    console.log('KEY_CACHE_TOKEN=', this._cacheService.get(CacheKeys.KEY_CACHE_TOKEN));
    if (this._cacheService.get(CacheKeys.KEY_CACHE_TOKEN)) {
      window.location.href = '/';
      return;
    }
    // if (hostName.indexOf('sungroup') >= 0 || hostName.indexOf('sunworld') >= 0) {
    //   this.typeLogin = 'sunworld';
    //   return;
    // }
    // const listDomainPVCombank = DefineConstants.LIST_DOMAIN_PVCOMBANK;
    // for (const host of listDomainPVCombank) {
    //   if (hostName.indexOf(host) >= 0) {
    //     this.typeLogin = 'pvcombank';
    //     return;
    //   }
    // }

    // const token = urlParams.get('token');
    // if (token && source) {
    //   this.dataLogin.token = token;
    //   this.dataLogin.source = source;
    //   this.isLoading = true;
    //   this.authenticate(true);
    //   return;
    // }
    // if (!source && DefineConstants.LIST_DOMAIN_MSB.some(domain => hostName.indexOf(domain) >= 0)) {
    //   this.dataLogin.source = 'MSB';
    // }

    // if (this.redirectWebsite()) {
    //   return;
    // }

  }

  resolved(captchaResponse: string) {
    this.isVerifyRecaptcha = captchaResponse ? true : false;
    this.reCaptcha.execute();
  }

  handleRegister() {
    this._router.navigateByUrl('/register');
  }

  public async login() {
    if (!this.isVerifyRecaptcha && this.hasRecaptcha) {
      return;
    }
    let isError = false;
    this.isLoading = true;
    this.messErrorPass = '';
    this.messErrorUsers = '';
    this.messErrorDomain = '';
    if (this.dataLogin.password?.trim().length === 0) {
      this.isLoading = false;
      this.passwordInput.nativeElement.focus();
      isError = true;
      this.messErrorPass = 'i18n_password_is_required';
    }
    if (this.dataLogin.userName?.trim().length === 0) {
      this.isLoading = false;
      this.userNameInput.nativeElement.focus();
      isError = true;
      this.messErrorUsers = 'i18n_account_name_requierd';
    }
    if (this.domainInput && (this.isShowDomainInput && this.domain.trim().length === 0 || !DefinePattern.URL.test(this.domain.trim()))) {
      this.isLoading = false;
      this.domainInput.nativeElement.focus();
      isError = true;
      this.messErrorDomain = 'i18n_domian_not_emty';
    }
    if (isError) {
      return;
    }
    if (this.domain.trim()) {
      localStorage.setItem(CacheKeys.KEY_CACHE_DOMAIN_CONFIG_LOGIN, this.domain.trim());
    }
    await this.authenticate();
  }

  private async authenticate(redirectLoginError?: boolean) {
    this._cacheService.clearAll();
    // this._httpRequestService.refreshAllAPIUrl();
    const pem: IPem = { isCheck: 0, pathCheck: '/other', action: 1 };
    const result = await this._authService.authenticate(pem, this.dataLogin);
    if (result?.code !== 200) {
        this.isLoading = false;
        this._toast.show('error', result?.message || 'i18n_login_failed_please_try_again');
        // if (redirectLoginError) {
        //   setTimeout(() => {
        //     this.redirectWebsite();
        //   }, 1000);
        // }
        return;
    }
    console.log('authenticate result=',result);
    this._cacheService.set(CacheKeys.KEY_CACHE_TOKEN, result.jwt, CacheService.CACHE_1_DAY);

    setTimeout(() => {
      this.authenticateSuccess(result);
    }, 150);
    
  }

  async authenticateSuccess(result: any) {
    const getPathOnPrivate = await this.getPathOnPrivate();
    const pem: IPem = { isCheck: 0, pathCheck: '/other', action: 1 };
    const getAllSettings = await this._settingService.getAllSettings(pem);
    // await getPathOnPrivate;
    // await getAllSettings;

    const allSetting = this._cacheService.get(CacheKeys.KEY_CACHE_SETTING_ALL);
    const smartWifiConfig = allSetting.data.find((item: any) => item.key === CacheKeys.KEY_SETTING_SERVICE_SMART_WIFI);
    if (smartWifiConfig && smartWifiConfig.values) {
      const valueConfig = smartWifiConfig.values;
      this._cacheService.set(CacheKeys.KEY_CACHE_SMART_WIFI, valueConfig.pathSmartWifi, CacheService.CACHE_EXPIRE_NONE);
      this._cacheService.set(CacheKeys.KEY_CACHE_SMART_WIFI_API, valueConfig.apiKeySmartWifi, CacheService.CACHE_EXPIRE_NONE);
      this._cacheService.set(CacheKeys.KEY_CACHE_SMART_WIFI_BRAND_ID, valueConfig.brandingIdSmartWifi, CacheService.CACHE_EXPIRE_NONE);
    }

    const linkPowerBI: any = allSetting.data.find((item: any) => item.key === CacheKeys.KEY_CACHE_LINK_POWER_PI);
    if (linkPowerBI) {
      this._cacheService.set(CacheKeys.KEY_CACHE_LINK_POWER_PI, linkPowerBI.values, CacheService.CACHE_EXPIRE_NONE);
    }

    const configPhoneSecurity = allSetting.data.find((item: any) => item.key === CacheKeys.KEY_CACHE_PHONE_SECURITY);
    if (configPhoneSecurity) {
      this._cacheService.set(CacheKeys.KEY_CACHE_PHONE_SECURITY, configPhoneSecurity.values, CacheService.CACHE_EXPIRE_NONE);
    }

    const emailPhoneSecurity = allSetting.data.find((item: any) => item.key === CacheKeys.KEY_CACHE_EMAIL_SECURITY);
    if (emailPhoneSecurity) {
      this._cacheService.set(CacheKeys.KEY_CACHE_EMAIL_SECURITY, configPhoneSecurity.values, CacheService.CACHE_EXPIRE_NONE);
    }

    const accountIdsEncrypt = allSetting.data.find((item: any) => item.key === CacheKeys.KEY_CACHE_USER_CAN_DECNCRYPT);
    if (accountIdsEncrypt) {
      this._cacheService.set(CacheKeys.KEY_CACHE_USER_CAN_DECNCRYPT, accountIdsEncrypt.values, CacheService.CACHE_EXPIRE_NONE);
    }

    // await this.getPermission();
    // await this.getMenuDefault();
    // if (this.typeLogin !== 'pvcombank') {
    //   const pem: IPem = { isCheck: 0, pathCheck: '/other', action: 1 };
    //   await this._MoWbLoginService.getAppConfig(pem);
    //   await this._MoWbLoginService.getSocialSupport(pem);
    // }
    // const merchantId = this._authService.jwtDecode().merchantID;
    // const menuGroup: IMenu[] = [];
    // const menuSettingTenant: IMenu[] = [];
    // const menuSettingPersonal: IMenu[] = [];
    // this._MoWbLoginService.listMenuConfig(pem, { merchant_id: merchantId }).then((res) => {
    //   this.configMenu(res.data.config_menu, MENU_GROUP, menuGroup);
    //   this.configMenu(res.data.config_menu, MENU_TENANT, menuSettingTenant);
    //   this.configMenu(res.data.config_menu, MENU_PERSONAL, menuSettingPersonal);
    //   this._cacheService.set(CacheKeys.KEY_CACHE_MENU_GROUP, menuGroup, CacheService.CACHE_EXPIRE_NONE);
    //   this._cacheService.set(CacheKeys.KEY_CACHE_MENU_SETTING_TENANT, this.convertMenuSetting(menuSettingTenant), CacheService.CACHE_EXPIRE_NONE);
    //   this._cacheService.set(CacheKeys.KEY_CACHE_MENU_SETTING_PERSONAL, this.convertMenuSetting(menuSettingPersonal), CacheService.CACHE_EXPIRE_NONE);
    // });
    this._cacheService.set(CacheKeys.KEY_CACHE_LANGUAGE_CMS_SUPPORT, ['vi', 'en'], CacheService.CACHE_EXPIRE_NONE);
    this._cacheService.set(CacheKeys.KEY_CACHE_CURRENCIES_CMS_SUPPORT, ['VND', 'USD', 'EUR'], CacheService.CACHE_EXPIRE_NONE);
    // if (result.type_login === 'change_in_first_sign_in' || result.type_login === 'must_change') {
    //   this._toast.show(DefineConstants.TOAST_WARNING_FUNCTION_NAME, result.message);
    //   this.merchantID = result.merchant_id;
    //   // const pem: IPem = { isCheck: 0, pathCheck: '/other', action: 1 }
    //   const config: any = await this._MoWbTenantConfigService.getPattern(pem, { merchant_id: this.merchantID });
    //   if (config.data.pattern_password) {
    //     this.validPatternPass.push({ pattern: /^[a-zA-Z0-9~`!@#$%^&*()_=+}{"';:.,?|/<>\-\\]{0,}$/, message: 'i18n_password_is_malformed' });
    //     this.validPatternPass.push({ pattern: new RegExp(DefineFunction.base64Decode(config.data.pattern_password)), message: 'i18n_password_is_malformed' });
    //   }
    //   this.config = config.data;
    //   this.account.old_password = this.dataLogin.password;
    //   this.account_id = result.account_id;
    //   this.isChangePass = true;
    //   return;
    // }
    timer(1000).subscribe(() => {
      const urlPrevious: string = this._cacheService.get(CacheKeys.KEY_CACHE_PAGE_PREVIOUS, '');

      if (urlPrevious) {
        window.location.href = urlPrevious;

        return;
      }
      window.location.href = `?lang=${this.lang}`;
    });
  }


  private async getPathOnPrivate() {

    const result = await this._settingService.getPathConfig();
    console.log('getPathOnPrivate ',result);
    const data = result.data;
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_ADS, data.ads_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_AUDIENCE, data.au_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_CALL_CENTER, data.callcenter_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_CHAT_TOOL, data.chattool_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_CRM, data.crm_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_EMK, data.emk_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_LOYALTY, data.loyalty_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_MARKETING, data.mkt_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_NM, data.nm_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_PRODUCT_LIBRARY, data.products_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_PROFILING, data.profiling_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_SALE, data.sale_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_SOCIAL, data.social_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_TICKET, data.ticket_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_LANDING_PAGE, data.landingpage_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_DNC, data.dnc_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_VOUCHER, data.voucher_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_JOURNEY_BUILDER, data.journey_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_MEDIA, data.media_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_TAG, data.tag_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_SURVEY, data.survey_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_RAPPORTEUR, data.rapporteur_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_SAMSUNG_CMS, data.samsungcms_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_DYNAMIC_EVENT, data.dynamic_event_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_MAIL_CLIENT, data.mail_client_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_TASK, data.task_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_NOTE, data.note_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_COMPANY, data.company_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_MCC_MERCHANT, data.mcc_host, CacheService.CACHE_EXPIRE_NONE);
    CacheService.Set(CacheKeys.KEY_CACHE_PATH_TEMPLATE, data.template_host, CacheService.CACHE_EXPIRE_NONE);

    return result;
    // const merchantId = this._authService.jwtDecode().merchantID;
    // return new Promise((resolve, reject) => {
    //   const pem = { pem: BUILD_PEM_OBJECT({ isCheck: 0, pathCheck: '/other', action: 1 }) };
    //   this._adminRequest.get(`merchants/${merchantId}/public-configs`, pem).subscribe((result: any) => {
        
    //     this._httpRequestService.refreshAllAPIUrl();
    //     resolve(result);
    //   }, err => {
    //     reject(err);
    //   });
    // });
  }

  // async getMenuDefault() {
  //   try {
  //     const pem: IPem = {
  //       pathCheck: '/other',
  //       action: DefineConstants.PERMISSION_ACTION_VIEW,
  //       isCheck: 0
  //     };
  //     const res = await this._displayTypeService.getMenuDefault(pem, this._authService.jwtDecode().id);
  //     if (!res.data || !res.data.menu_default) {
  //       return;
  //     }
  //     CacheService.Set(CacheKeys.KEY_CACHE_DEFAULT_PAGE, res.data.menu_default, CacheService.CACHE_EXPIRE_NONE);
  //   } catch (error) {

  //   }
  // }
  // private getPermission() {
  //   const merchantId = this._authService.jwtDecode().merchantID;
  //   return new Promise((resolve, reject) => {
  //     const pem = { pem: BUILD_PEM_OBJECT({ isCheck: 0, pathCheck: '/other', action: 1 }) };
  //     this._adminRequest.get(`merchants/${merchantId}/modules/details`, pem).subscribe(res => {
  //       if (res && res.functions) {
  //         const allPermission = res.functions;
  //         this._cacheService.set(CacheKeys.KEY_CACHE_PERMISSION_ALL, allPermission, CacheService.CACHE_EXPIRE_NONE);
  //         resolve(res.functions);
  //       }
  //     }, err => {
  //       reject(err);
  //     });
  //   });
  // }

  public keyupUserNameInput(e: Event, userNameInput: any) {
    e.stopPropagation();
    e.preventDefault();
    const userName = userNameInput.value;
    this.dataLogin.userName = userName;
    if (userName) {
      this.messErrorUsers = '';
      return;
    }
    this.messErrorUsers = 'i18n_account_name_requierd';
  }

  public keyupPasswordInput(e: Event, passwordInput: any) {
    e.stopPropagation();
    e.preventDefault();
    const password = passwordInput.value;
    this.dataLogin.password = password;
    if (password) {
      this.messErrorPass = '';
      return;
    }
    this.messErrorPass = 'i18n_password_is_required';
  }

  public keyupDomainInput(e: Event, domainInput: any) {
    e.stopPropagation();
    e.preventDefault();
    const domain = domainInput.value;
    this.domain = domain;
    if (domain) {
      this.messErrorDomain = '';
      return;
    }
    this.messErrorDomain = 'i18n_domian_not_emty';
  }

  public forgotPassword() {
    this._toast.show('info', 'i18n_this_function_will_be_developed_in_later_versions');
  }

  public autoCreatePassword(event: any) {
    this.account.new_password = event;
    this.account.confirm_password = event;
  }

  // async savePass() {
  //   this.checkPassword();
  //   if (!this.isCheck) {
  //     return;
  //   }
  //   const pem: IPem = { isCheck: 0, pathCheck: '/other', action: 1 };
  //   const res: any = await this._MoWbLoginService.updatePasswordAccount(pem, this.merchantID, this.account_id, this.account);
  //   if (res.code === 200) {
  //     this.isLoading = false;
  //     this.account_id = '';
  //     this.isChangePass = false;
  //     this._toast.show(DefineConstants.TOAST_SUCCESS_FUNCTION_NAME, 'i18n_notification_manipulation_success');
  //     return;
  //   }
  //   this._toast.show(DefineConstants.TOAST_WARNING_FUNCTION_NAME, 'i18n_notification_manipulation_not_success');
  // }

  // cancelChangePass() {
  //   this.isLoading = false;
  //   this.account_id = '';
  //   this.isChangePass = false;
  //   this._cacheService.clearAll();
  // }

  // checkPassword() {
  //   for (const password of this.viewPasswordShared.toArray()) {
  //     this.isCheck = password.passwordInput.CheckValid;
  //     if (!this.isCheck) {
  //       break;
  //     }
  //     this.isCheck = password.valid();
  //     if (!this.isCheck) {
  //       break;
  //     }
  //   }

  //   if (this.account.new_password !== this.account.confirm_password) {
  //     this._toast.show(DefineConstants.TOAST_ERROR_FUNCTION_NAME, 'i18n_password_is_unmatched_to_the_confirm_password');
  //     return this.isCheck = false;
  //   }
  // }

  toggleShowPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

}
