import { NgModule } from '@angular/core';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaLoaderService, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbLogoutComponent } from './logout.component';
import { MoWbCommonServiceModule } from '../../api/common/common-service.module';

@NgModule({
  imports: [
    CommonModule,
    RecaptchaModule,
    TranslateModule.forChild({}),
    RouterModule,
    MoWbCommonServiceModule
  ],
  declarations: [
    MoWbLogoutComponent,
  ],
  exports: [MoWbLogoutComponent],
  providers: [
  ]

})
export class MoWbLogoutModule {
}

