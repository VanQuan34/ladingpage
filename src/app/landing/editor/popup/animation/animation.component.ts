
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { MoWbPopupWrapperComponent } from '../../../../components/popup/popup_wrap.component';
@Component({
  selector: 'mo-wb-landing-editor-popup-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPopupAnimationComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }
}
