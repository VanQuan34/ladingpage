import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
import { MoWbSpinnerModule } from '../spinner/spinner.module';
import { MoWbToggleModule } from './toggle-button/toggle.module';
import { MoWbButtonToggleComponent } from './toggle/toggle.component';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbTooltipModule,
    MoWbSpinnerModule,
    MoWbToggleModule
  ],
  declarations: [
    ButtonComponent,
    MoWbButtonToggleComponent
  ],
  exports: [
    ButtonComponent,
    // MoWbToggleComponent,
    MoWbButtonToggleComponent
  ]
})
export class MoWbButtonModule { }
