import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbMenuDropdownComponent } from './menu-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbMenuDropdownComponent
  ],
  declarations: [
    MoWbMenuDropdownComponent
  ],
  providers: [
  ]
})
export class MoWbMenuDropDownModule {

}
