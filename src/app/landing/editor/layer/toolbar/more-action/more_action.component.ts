
import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

import { MoLandingEditorPopupButtonSettingComponent } from '../../../popup/button/setting/setting.component';
import { MoLandingEditorPopupActionComponent } from '../../../popup/action/action.component';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-more_action',
  templateUrl: './more_action.component.html',
  styleUrls: ['./more_action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarMoreActionComponent extends MoWbBaseComponent {
  
  selectedComp: DomComponent;
  isOpen: boolean;
  moType: string;
  top: number;
  left: number;

  @Input() classInclude: string = '';

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  /**
   * show more action popup
   */
  showMoreActionPopup(targetEl: HTMLElement) {
    const popup = this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupActionComponent).create(this._injector);
    popup.instance.targetEl = targetEl;
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }
  
  handleOnMoreActionButtonClick(event:any, targetEl: HTMLElement) {
    this.showMoreActionPopup(targetEl);
  }
}
