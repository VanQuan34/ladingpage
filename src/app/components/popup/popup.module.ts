import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbPopupComponent } from './popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../button/button.module';
import { MoWbPopupWrapperComponent } from './popup_wrap.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
	imports: [
		TranslateModule.forChild({}),
		MoWbButtonModule,
		CommonModule,
		DragDropModule
	],
	exports: [
		MoWbPopupComponent,
    MoWbPopupWrapperComponent
	],
	declarations: [
		MoWbPopupComponent,
    MoWbPopupWrapperComponent
	],
})
export class MoWbPopupModule {

}
