
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { MoWbPopupWrapperComponent } from '../../../../components/popup/popup_wrap.component';
@Component({
  selector: 'mo-wb-landing-editor-popup-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPopupActionComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }
}
