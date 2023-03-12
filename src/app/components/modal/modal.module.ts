import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbModalComponent } from './modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../button/button.module';
import { MoWbModalDeleteComponent } from './delete/delete.component';
import { MoWbModalConfirmComponent } from './confirm/confirm.component';

@NgModule({
	imports: [
		TranslateModule.forChild({}),
		MoWbButtonModule,
		CommonModule
	],
	exports: [
		MoWbModalComponent,
		MoWbModalDeleteComponent,
		MoWbModalConfirmComponent
	],
	declarations: [
		MoWbModalComponent,
		MoWbModalDeleteComponent,
		MoWbModalConfirmComponent
	]
})
export class MoWbModalModule {

}
