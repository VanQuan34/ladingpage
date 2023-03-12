/**Nguồn tham khảo https://github.com/dmacfarlane/angular-mentions */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbsSharedComponentsMentionsListComponent } from './list/list.component';
import { MoWbsSharedComponentsMentionsDirective } from './mention.directive';
import { MoWbTooltipModule } from '../../components/tooltip/tooltip.module';

@NgModule({
  declarations: [
    MoWbsSharedComponentsMentionsListComponent,
    MoWbsSharedComponentsMentionsDirective
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbTooltipModule
  ],
  exports: [
    MoWbsSharedComponentsMentionsDirective
  ],
  entryComponents: [
    MoWbsSharedComponentsMentionsListComponent
  ]
})
export class MoWbsSharedComponentsMentionsModule { }
