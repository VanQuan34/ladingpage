import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MoWbTabComponent } from './tab.component';
import { MoWbButtonModule } from '../button/button.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule
  ],
  exports: [
    MoWbTabComponent
  ],
  declarations: [
    MoWbTabComponent
  ],
  providers: [
  ]
})
export class MoWbTabModule {

}
