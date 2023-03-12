import { MoWbLabelModule } from './../label/label.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {MoLibTagsItemComponent} from './item/item.component'
import { MoWbTagsComponent } from './tags.component';
import { MoWbButtonModule } from '../button/button.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MoWbClickOutsideModule } from 'src/app/directives/click-outside.directive';
import { MoWbSpinnerModule } from '../spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule,
    MoWbLabelModule,
    VirtualScrollerModule,
    MoWbClickOutsideModule,
    MoWbSpinnerModule,

  ],
  exports: [
    MoWbTagsComponent
  ],
  declarations: [
    MoWbTagsComponent,
    MoLibTagsItemComponent,
  ],
  providers: [
  ]
})
export class MoWbTagsModule {

}
