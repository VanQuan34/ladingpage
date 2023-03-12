import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MoWbButtonModule } from '../button/button.module';
import { MoWbCategoryComponent } from './category.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule
  ],
  exports: [
    MoWbCategoryComponent
  ],
  declarations: [
    MoWbCategoryComponent
  ],
  providers: [
  ]
})
export class MoWbCategoryModule {

}
