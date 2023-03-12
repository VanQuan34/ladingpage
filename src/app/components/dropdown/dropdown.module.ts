import { MoWbButtonModule } from './../button/button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbDropdownComponent } from './dropdown.component';
import { MoWbDropdownItemComponent } from './item/item.component';
import { MoWbSpinnerModule } from '../spinner/spinner.module';
import { MoWbPipeModule } from '../../pipe/pipe.module';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbSpinnerModule,
    MoWbButtonModule,
    MoWbPipeModule,
    MoWbTooltipModule,
    VirtualScrollerModule
  ],
  exports: [
    MoWbDropdownComponent
  ],
  declarations: [
    MoWbDropdownComponent,
    MoWbDropdownItemComponent
  ],
  providers: [
  ]
})
export class MoWbDropDownModule {

}
