import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MoWbTooltipComponent } from './tooltip.component';
import { MoWbTooltipContentComponent } from './content/content.component';
import { MoWbClickOutsideModule } from '../../directives/click-outside.directive';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({}),
        MoWbClickOutsideModule
    ],
    exports: [
        MoWbTooltipComponent,
    ],
    declarations: [
        MoWbTooltipComponent,
        MoWbTooltipContentComponent
    ],
    entryComponents: [
        MoWbTooltipContentComponent,
        MoWbTooltipComponent]
})
export class MoWbTooltipModule {

}
