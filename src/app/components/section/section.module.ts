import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbSectionComponent } from './section.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbSectionComponent
  ],
  declarations: [
    MoWbSectionComponent
  ],
  providers: [
  ]
})
export class MoWbSectionModule {

}
