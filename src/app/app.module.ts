import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CacheService } from './api/common/cache.service';
import { LANGUAGE } from './common/define/language.define';
import { MoWbCommonServiceModule } from './api/common/common-service.module';
import { MoWbLoginModule } from './components/login/login.module';
import { AuthenticateService } from './api/common/authenticate.service';
import { MoWbLogoutModule } from './components/logout/logout.module';

import { MoWbComponentsModule } from './components/components.module';

import { MoWbLandingPageModule } from './landing/landing.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MoWbLoginModule,
    BrowserAnimationsModule,
    MoWbCommonServiceModule,
    MoWbLogoutModule,
    MoWbComponentsModule,
    HttpClientModule,
    MoWbLandingPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
    }),
    CommonModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private _translate: TranslateService, private _router: Router, private _cacheService: CacheService, private _auth: AuthenticateService,) {
    this._translate.addLangs([LANGUAGE.VI, LANGUAGE.EN]);
    let lang: string | null = localStorage.getItem(LANGUAGE.KEY_LANGUAGE_STORAGE);
    if (!lang) {
      const urlParams = new URLSearchParams(window.location.search);
      lang = urlParams.get('lang') ? urlParams.get('lang') : LANGUAGE.DEFAULT;
    }
    lang = lang || LANGUAGE.DEFAULT;
    console.log('lang=', lang);
    localStorage.setItem(LANGUAGE.KEY_LANGUAGE_STORAGE, lang);
    this._translate.setDefaultLang(lang);
    // setTimeout(() => {
    //   const currentVersionWeb = this._cacheService.get(CacheKeys.KEY_CACHE_WEB_VERSION);
    //   if (currentVersionWeb !== WEB_VERSION) {
    //     this._cacheService.clearAll();
    //     const path = window.location.pathname;
    //     if (path !== DefineConstants.ROOT_PATH_LOGIN) {
    //       DefineFunction.redirectToLogin(this._router);
    //     }
    //   }
    // }, 2000);

    // this._router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     const path = window.location.pathname;
    //     if (path === DefineConstants.ROOT_PATH_DASHBOARD) {
    //       this._router.navigateByUrl(window.location.pathname);
    //     }
    //   }
    // });

    // const subEvent = this._router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     subEvent.unsubscribe();
    //     if (!this._cacheService.get(CacheKeys.KEY_CACHE_PERMISSION_ALL)) {
    //       return;
    //     }
    //     if (event.url === '/' || event.url === '/?lang=vi' || event.url === '/?lang=en') {
    //       const menus = [
    //         {
    //           label: 'i18n_home_page',
    //           link: '/',
    //           icon: 'mo-icn-Home',
    //           idFE: '9da6de70-8a26-11ec-a8a3-0242ac120001',
    //           level: 1
    //         }
    //       ]
    //       this._cacheService.set(CacheKeys.KEY_CACHE_MENU_GROUP,menus)
    //     }
    //   }
    // });
  }
}
