
import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

// import { MoLandingEditorPopupButtonSettingComponent } from '../../../popup/button/setting/setting.component';
// import { MoLandingEditorPopupActionComponent } from '../../../popup/action/action.component';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarContainerComponent extends MoWbBaseComponent {
  
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


  handleOnButtonClick(event: any) {
  }
}
