import { BUILD_PEM_OBJECT } from '../../common/define/crypto.define';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IToken } from '../../common/api/token';
import { HOST_BASE, HOST_ADM, IGNORE_REDIRECT_SERVER_MASK } from '../../common/define/host-domain.define';
import { CacheService } from './cache.service';
import { CacheKeys } from '../../common/define/cache-keys.define';
import { DefineFunction } from '../../common/define/function.define';
import { ToastTranslateService } from './toast-translate.service';
import { CURRENT_LANG } from '../../common/define/language.define';
import { DataLogin } from '../../components/login/api/login.model';
import { IPem } from '../../common/api/pem';
import { MoWbBaseApiService } from '../baseApi';

@Injectable()
export class AuthenticateService {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private _baseService: MoWbBaseApiService,
    private _router: Router,
    private _toast: ToastTranslateService,
    private _cacheService: CacheService) {
  }

  // public getMenuSettingTenant() {
  //   return cloneDeep(this.menuTenant);
  // }

  // public getMenuSettingPersonal() {
  //   return cloneDeep(this.menuPersonal);
  // }

  public async authenticate(pem: IPem, body: DataLogin) {
    const bodyMap: any = {};
    if (body.userName) {
      bodyMap.username = body.userName.trim();
    }

    if (body.password) {
      bodyMap.password = body.password.trim();
    }
    if (body.source) {
      bodyMap.source = body.source.trim();
    }

    if (body.token) {
      bodyMap.token = body.token.trim();
    }

    const query: any = {
      lang: CURRENT_LANG(),
      type_login: 2
    }
    
    const response = await this._baseService.fetch('login', 'POST', 'JSON', bodyMap, query, HOST_ADM(), false);
    // console.log('authenticate login=', response);
    return response;

  }

  public logout() {

  }

  public jwtDecode(): IToken {
    try {
      const tokenTemp = this.jwtHelper.decodeToken(this.getToken());
      return [tokenTemp].map(this.toToken)[0];
    } catch (e) {
      this._cacheService.clearAll();
      DefineFunction.redirectToLogin(this._router);
      return {};
    }
  }

  public getToken() {
    return this._cacheService.get(CacheKeys.KEY_CACHE_TOKEN) || '';
  }

  public toToken(r: any): IToken {
    const token: IToken = {
      id: r['id'],
      role_group: r['role_group'],
      adminAccountID: r['id'],
      xPointJoinState: r['xpoint_status'],
      supplierCode: r['merchant_code'],
      avatar: CacheService.Get(CacheKeys.KEY_CACHE_MERCHANT_AVATAR) || r['merchant_avatar'],
      avatarCollapse: CacheService.Get(CacheKeys.KEY_CACHE_MERCHANT_AVATAR_COLLAPSE) || r['merchant_avatar_collapse'],
      accessName: r['username'],
      merchantName: r['merchant_name'],
      merchantID: r['merchant_id'],
      merchantCode: r['merchant_code'],
      typeSupplier: r['merchant_type'],
      statusUseCallCenter: r['use_callcenter'],
      staff_avatar: CacheService.Get(CacheKeys.KEY_CACHE_PERSONAL_AVATAR) || r['avatar'],
      isAdmin: r['is_admin'],
      isMobio: r['is_mobio'],
      fullName: r['fullname'],
      phoneNumber: r['phone_number'],
      email: r['email'],
      status: r['status'],
      callCenter: r['callcenter'],
      function: r['functions'],
      is_sub_brand: r['is_sub_brand'],
      type: r['type']
    };
    return token;
  }

  public verifyToken(): Boolean {
    // todo request api verify token
    const token = this.getToken();
    if (!token) {
      DefineFunction.redirectToLogin();
      return false;
    }
    const tokenTemp = this.jwtHelper.decodeToken(token);
    if (tokenTemp && tokenTemp.Quyen) {
      this._cacheService.clearAll();
      DefineFunction.redirectToLogin(this._router);
      return false;
    }
    return true;
  }

  // public registerAccount(pem: IPem, registerData: any, userName: string): Observable<any> {
  //   const dataMap = {
  //     'TenNhaCungCap': registerData.nameBrands,
  //     'TenTruyCap': userName,
  //     'MatKhau': registerData.password,
  //     'MatKhauNhacLai': registerData.retryPass,
  //     'ThuDienTu': registerData.email,
  //     'KieuNhaCungCap': 1,
  //     'DanhMuc': registerData.displayType
  //   };

  //   return new Observable((observer: Observer<any>) => {
  //     return this.http.post(`${HOST_BASE()}register?pem=${BUILD_PEM_OBJECT(pem)}`, dataMap).subscribe((res: Response) => {
  //       const response = res.json();
  //       observer.next(response);
  //     }, (err) => {
  //       observer.error(err.json());
  //     });
  //   });
  // }

  /**
   * @description kiểm tra quyền truy cập url
   * @param path đường dẫn truy cập
   * @param action quyền tương ứng cho url như quyền xem,sửa,xóa ... bộ quyền đã được định nghĩa trong { DefineConstants } from 'app/common/define/constants.define.ts'; truyền undefined sẽ mặc định hiểu là check quyền xem
   * @param ignoreMessage mặc định sẽ có toast thông báo trừ trường hợp default redirect, đặt giá trị bằng true để bỏ qua
   * @param ignoreRedirect Khi phát hện path không có quyền truy cập nhưng trong modue lại có nhưng path khác có quyền truy cập thì sẽ mặc định redirect, đặt giá trị bằng true để bỏ qua
   */
  // public checkPermission(path: string, action: number, ignoreMessage: boolean, ignoreRedirect: boolean): boolean {
  //   const ignorePermission = this._cacheService.get(CacheKeys.KEY_CACHE_FLAG_IGNORE_PERMISSION);
  //   if (ignorePermission) {
  //     return true;
  //   }

  //   const allPermission = this._cacheService.get(CacheKeys.KEY_CACHE_PERMISSION_ALL);

  //   if (!allPermission) {
  //     this._cacheService.clearAll();
  //     DefineFunction.redirectToLogin(this._router);
  //     return false;
  //   }

  //   const accountPermission: Array<any> = allPermission.account_functions;
  //   if (!accountPermission || !accountPermission.length) {
  //     this._toast.show('error', 'i18n_message_error_you_do_not_have_access_to_this_function');
  //     this._cacheService.clearAll();
  //     DefineFunction.redirectToLogin(this._router);
  //     return false;
  //   }

  //   const accountRoleOfPath = accountPermission.find(item => item.path === path);
  //   if (!accountRoleOfPath) {
  //     if (!ignoreMessage) {
  //       this._toast.show('error', 'i18n_message_error_you_do_not_have_access_to_this_function');
  //     }
  //     return this.redirectUrlIfNotPermission(accountPermission, path, ignoreRedirect);
  //   }

  //   if (!accountRoleOfPath.actions.find(item => item === DefineConstants.PERMISSION_ACTION_VIEW)) {
  //     if (!ignoreMessage) {
  //       this._toast.show('error', 'i18n_message_error_you_do_not_have_access_to_this_function');
  //     }
  //     return false;
  //   }

  //   if (action && !accountRoleOfPath.actions.find(item => item === action)) {
  //     if (!ignoreMessage) {
  //       this._toast.show('error', 'i18n_message_error_you_do_not_have_access_to_this_function');
  //     }
  //     return false;
  //   }
  //   return true;
  // }


  // private moveChildGroupToFirstGroups(menus: Array<IMenu>, containerGroupMerge: Array<IMenu>, isGroup?: boolean) {
  //   menus.forEach((menu: IMenu) => {
  //     if (!isGroup) {
  //       containerGroupMerge = [];
  //       menu.mergeToFirstLevel = containerGroupMerge;
  //     }
  //     if (menu.subsLink && menu.subsLink.length) {
  //       let indexMenu = containerGroupMerge.findIndex(item => item.link === menu.link);

  //       menu.subsLink.forEach((link) => containerGroupMerge.splice((++indexMenu), 0, { link, idGroup: menu.idGroup, menuHasSubLink: menu } as IMenu));
  //     }
  //     if (menu.group) {
  //       const id = uuid();
  //       menu.group.forEach(item => item.idGroup = id);
  //       containerGroupMerge.push(...menu.group);
  //       this.moveChildGroupToFirstGroups(menu.group, containerGroupMerge, true);
  //     }
  //     if (!isGroup) {
  //       menu.mergeToFirstLevel = menu.mergeToFirstLevel.filter(item => item.link);
  //     }
  //   });
  // }

  // private getMenus(path: string): Array<IMenu> {
  //   let indexMenu = this.checkPathIsExitMenusAndReturnIndex(path, this.menuGroup);

  //   if (indexMenu > -1) {
  //     return this.buildMenus(path, indexMenu, this.menuGroup, this.menuTenant, this.menuPersonal);
  //   }

  //   indexMenu = this.checkPathIsExitMenusAndReturnIndex(path, this.menuTenant);
  //   if (indexMenu > -1) {
  //     return this.buildMenus(path, indexMenu, this.menuTenant, this.menuPersonal, this.menuGroup);
  //   }

  //   indexMenu = this.checkPathIsExitMenusAndReturnIndex(path, this.menuPersonal);
  //   if (indexMenu > -1) {
  //     return this.buildMenus(path, indexMenu, this.menuPersonal, this.menuTenant, this.menuGroup);
  //   }

  //   return [...cloneDeep(this.menuGroup), ...cloneDeep(this.menuTenant), ...cloneDeep(this.menuPersonal)];
  // }

  // private buildMenus(path: string, indexMenuMoveFirst: number, menuOne: Array<IMenu>, menuTwo: Array<IMenu>, menuThree: Array<IMenu>): Array<IMenu> {
  //   const menus: Array<IMenu> = [];

  //   menus.push(...cloneDeep(menuOne));
  //   const menu = menus[indexMenuMoveFirst];

  //   menus.splice(indexMenuMoveFirst, 1);
  //   menus.unshift(menu);
  //   if (menu.mergeToFirstLevel && menu.mergeToFirstLevel.length) {
  //     let indexSublink = menu.mergeToFirstLevel.findIndex(item => item.link === path);
  //     let lastIndexSublink = -1;
  //     if (indexSublink) {
  //       if (menu.mergeToFirstLevel[indexSublink].menuHasSubLink && menu.mergeToFirstLevel[indexSublink].menuHasSubLink.subsLink && menu.mergeToFirstLevel[indexSublink].menuHasSubLink.subsLink.length) {
  //         const pathLashSublink = [...menu.mergeToFirstLevel[indexSublink].menuHasSubLink.subsLink].pop();

  //         path = menu.mergeToFirstLevel[indexSublink].menuHasSubLink.subsLink[0];
  //         indexSublink = menu.mergeToFirstLevel.findIndex(item => item.link === path);
  //         lastIndexSublink = indexSublink;
  //         lastIndexSublink = menu.mergeToFirstLevel.findIndex(item => item.link === pathLashSublink);
  //       }

  //       const first = menu.mergeToFirstLevel.slice(indexSublink, lastIndexSublink + 1);

  //       menu.mergeToFirstLevel.splice(indexSublink, first.length);
  //       const otherMenuOfGroup = menu.mergeToFirstLevel.filter(item => item.idGroup === first[0].idGroup);
  //       const otherMenuOuterGroup = menu.mergeToFirstLevel.filter(item => item.idGroup !== first[0].idGroup);

  //       menu.mergeToFirstLevel = [...first, ...otherMenuOfGroup, ...otherMenuOuterGroup];
  //     }

  //   }
  //   menus.push(...cloneDeep(menuTwo), ...cloneDeep(menuThree));
  //   return menus;
  // }

  // private checkPathIsExitMenusAndReturnIndex(path: string, menus: Array<IMenu>): number {
  //   for (const index in menus) {
  //     const menu = menus[index];

  //     if (menu.link && menu.link === path) {
  //       return +index;
  //     }

  //     if (!menu.mergeToFirstLevel || !menu.mergeToFirstLevel.length) {
  //       continue;
  //     }
  //     const menusFirstLevel = menu.mergeToFirstLevel;

  //     if (menusFirstLevel.some(menuFirstLevel => menuFirstLevel.link && menuFirstLevel.link === path)) {
  //       return +index;
  //     }
  //   }
  //   return -1;
  // }

  // private redirectUrlIfNotPermission(accountPermission: Array<any>, path: string, ignoreRedirect: boolean): boolean {
  //   if (ignoreRedirect) {
  //     return false;
  //   }
  //   const menus = this.getMenus(path);
  //   for (const menu of menus) {

  //     if ((this.checkPathRedirect(accountPermission, menu.link))) {
  //       this._router.navigateByUrl(menu.link);

  //       return false;
  //     }
  //     if (!menu.mergeToFirstLevel || !menu.mergeToFirstLevel.length) {
  //       continue;
  //     }
  //     for (const menuChild of menu.mergeToFirstLevel) {
  //       if (this.checkPathRedirect(accountPermission, menuChild.link)) {
  //         this._router.navigateByUrl(menuChild.link);

  //         return false;
  //       }
  //     }
  //   }

  //   return this.redirectLoginPage(false);
  // }

  // private checkPathRedirect(accountPermission: Array<any>, path: string): boolean {
  //   if (!path) {
  //     return false;
  //   }
  //   const accountPermissionOfRulePath = accountPermission.find(account => path && account.path === path);

  //   if (accountPermissionOfRulePath && accountPermissionOfRulePath.actions.some((action: number) => action === DefineConstants.PERMISSION_ACTION_VIEW)) {
  //     this._router.navigateByUrl(path);

  //     return true;
  //   }

  //   return false;
  // }

  // private redirectLoginPage<T>(t: T): T {
  //   this._cacheService.clearAll();
  //   DefineFunction.redirectToLogin(this._router);

  //   return t;
  // }

  // get Toast(): ToastTranslateService {
  //   return this._toast;
  // }
}

// @Injectable()
// export class UserCanActive implements CanActivate {
//   constructor(private _auth: AuthenticateService, private _router: Router) {
//   }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     let path: string = window.location.pathname === DefineConstants.BASE_PATH ? state.url.split('?')[0] : window.location.pathname;
//     const urlParams = new URLSearchParams(window.location.search);
//     const pathValue = urlParams.get('path');
//     if (path === DefineConstants.ROOT_PATH_CMS_SUNWORLD && pathValue) {
//       path = pathValue;
//     }
//     if (!this.checkLogin(path)) {
//       DefineFunction.redirectToLogin();
//       return false;
//     }

//     if (!this._auth.checkPermission(path, undefined, true, false)) {
//       return false;
//     }
//     return true;
//   }

//   checkLogin(url: string): boolean {
//     if (this._auth.verifyToken()) {
//       return true;
//     }
//     return false;
//   }
// }
