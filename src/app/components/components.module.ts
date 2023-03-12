import { MoWbTagsModule } from './tags/tags.module';
import { MoWbRadioModule } from './radio/radio.module';
import { MoWbCheckboxModule } from './checkbox/checkbox.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { MoWbButtonModule } from './button/button.module';
import { MoWbInputModule } from './input/input.module';
import { MoWbDropDownModule } from './dropdown/dropdown.module';
import { MoWbToggleModule } from './button/toggle-button/toggle.module';
import { MoWbSpinnerModule } from './spinner/spinner.module';
import { MoWbColorModule } from './color/color.module';
import { MoWbTogglePanelModule } from './toggle-panel/toggle-panel.module';
import { MoWbSliderModule } from './slider/slider.module';
import { MoWbPopupModule } from './popup/popup.module';
import { MoWbSectionModule } from './section/section.module';
import { MoWbMenuModule } from './menu/menu.module';

// components
import { MoWbDetectionComponent } from './detection.component';
import { MoWbCategoryModule } from './category/category.module';
import { MoWbMenuDropDownModule } from './menu-dropdown/menu-dropdown.module';
import { MoWbModalModule } from './modal/modal.module';
import { MoWbTabModule } from './tab/tab.module';
import { MoWbUploadModule } from './upload/upload.module';
import { MoWbUploadFontModule } from './upload/upload-file/upload-font.module';
import { MoWbTooltipModule } from './tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule,
    MoWbInputModule,
    MoWbDropDownModule,
    MoWbToggleModule,
    MoWbSpinnerModule,
    MoWbCheckboxModule,
    MoWbCategoryModule,
    MoWbMenuDropDownModule,
    MoWbModalModule,
    MoWbColorModule,
    MoWbTabModule,
    MoWbTogglePanelModule,
    MoWbUploadModule,
    MoWbUploadFontModule,
    MoWbTooltipModule,
    MoWbColorModule,
    MoWbTogglePanelModule,
    MoWbSliderModule,
    MoWbPopupModule,
    MoWbRadioModule,
    MoWbTagsModule,
    MoWbSectionModule,
    MoWbMenuModule
  ],
  declarations: [
    MoWbDetectionComponent,
  ],
  exports: [
    MoWbDetectionComponent,
    MoWbButtonModule,
    MoWbInputModule,
    MoWbDropDownModule,
    MoWbToggleModule,
    MoWbSpinnerModule,
    MoWbCheckboxModule,
    MoWbCategoryModule,
    MoWbMenuDropDownModule,
    MoWbModalModule,
    MoWbColorModule,
    MoWbTabModule,
    MoWbTogglePanelModule,
    MoWbUploadModule,
    MoWbUploadFontModule,
    MoWbTooltipModule,
    MoWbColorModule,
    MoWbTogglePanelModule,
    MoWbSliderModule,
    MoWbPopupModule,
    MoWbRadioModule,
    MoWbTagsModule,

    MoWbSectionModule,
    MoWbMenuModule
  ]
})
export class MoWbComponentsModule { }
