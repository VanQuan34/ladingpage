import { NgModule } from '@angular/core';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaLoaderService, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbLoginComponent } from './login.component';
import { MoWbButtonModule } from '../button/button.module';
import { MoWbSpinnerModule } from '../spinner/spinner.module';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
@NgModule({
  imports: [
    CommonModule,
    RecaptchaModule,
    TranslateModule.forChild({}),
    FormsModule,
    RouterModule,
    MoWbButtonModule,
    MoWbSpinnerModule,
    MoWbTooltipModule
  ],
  declarations: [
    MoWbLoginComponent,
  ],
  exports: [MoWbLoginComponent],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6Ld4aokaAAAAAErSmAIwuyaADF_mh6zNzH2UrAw3', badge: 'bottomleft', type: 'image', size: 'normal' } as RecaptchaSettings,
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'vi',
    },
    RecaptchaLoaderService
  ],

})
export class MoWbLoginModule {
}

