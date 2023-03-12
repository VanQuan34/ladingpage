
import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

import { MoLandingEditorPopupButtonSettingComponent } from '../../../popup/button/setting/setting.component';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarHeaderComponent extends MoWbBaseComponent {
  
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
   * show setting popup
   */
  showSettingPopup() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupButtonSettingComponent).create(this._injector);
    
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  handleOnSettingButtonClick(event: any) {
    this.showSettingPopup();
  }

}
