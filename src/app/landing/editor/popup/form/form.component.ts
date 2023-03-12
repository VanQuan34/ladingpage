import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';

@Component({
  selector: 'mo-wb-landing-editor-popup-form-setting',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoLandingEditorPopupFormSettingComponent extends MoWbPopupWrapperComponent {
  

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

}