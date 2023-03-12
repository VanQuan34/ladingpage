import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbColorComponent } from './color.component';
import { MoWbColorSetComponent } from './set/set.component';
import { MoWbColorRgbaComponent } from './rgba/rgba.component';
import { MoWbColorSetColorComponent } from './set/color/color.component';
import { MoWbButtonModule } from '../button/button.module';
import { MoWbTogglePanelModule } from '../toggle-panel/toggle-panel.module';
import { MoWbSliderModule } from '../slider/slider.module';
import { MoWbInputModule } from '../input/input.module';
import { MoWbRadioModule } from '../radio/radio.module';
import { MoWbDropDownModule } from '../dropdown/dropdown.module';
import { MoWbColorSetGradientComponent } from './set/gradient/gradient.component';
import { MoWbColorSetGradientCenterPointComponent } from './set/gradient/center-point/center_point.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule,
    MoWbTogglePanelModule,
    MoWbSliderModule,
    MoWbInputModule,
    MoWbRadioModule,
    MoWbDropDownModule
  ],
  exports: [
    MoWbColorComponent,
    MoWbColorSetComponent,
    MoWbColorRgbaComponent,
    MoWbColorSetGradientComponent
  ],
  declarations: [
    MoWbColorComponent,
    MoWbColorSetComponent,
    MoWbColorRgbaComponent,
    MoWbColorSetColorComponent,
    MoWbColorSetGradientComponent,
    MoWbColorSetGradientCenterPointComponent
  ],
  providers: [
  ]
})
export class MoWbColorModule {

}
