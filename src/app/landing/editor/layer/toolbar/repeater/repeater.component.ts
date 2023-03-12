
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, Output
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

import { MoLandingEditorPopupButtonSettingComponent } from '../../../popup/button/setting/setting.component';
import { MoLandingEditorPopupAnimationComponent } from '../../../popup/animation/animation.component';
import { MoLandingEditorPopupLinkComponent } from '../../../popup/link/link.component';
import { MoLandingEditorPopupActionComponent } from '../../../popup/action/action.component';
import { uid } from 'uid';
import { EditorConstants } from '../../../constants';
import { MoLandingEditorInspectorBaseComponent } from '../../../inspector/base.component';

interface IDsType {
  id: string,
  type: string,
  name: string;
}
const DISPLAY = '--display';
const DS_TYPE = '--ds';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-repeater',
  templateUrl: './repeater.component.html',
  styleUrls: ['./repeater.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarRepeaterComponent extends MoLandingEditorInspectorBaseComponent {
  
  // isOpen: boolean;
  // moType: string;
  top: number;
  left: number;
  dsTypes: IDsType[] = [];
  dsType: string;
  // selectedComp:  DomComponent = GLOBAL.editor.getSelected();
  selectorContainer: string = '.mo-repeater-item-container';
  selectorItem: string = '.mo-comp-container';
  // @Input() classInclude: string = '';

  override ngOnInit() {

    this.dsTypes = [
      {
        id: 'card',
        type: 'flex',
        name: 'Thẻ'
      },
      {
        id: 'list',
        type: 'flex',
        name: 'Danh sách'
      },
      {
        id: 'slide',
        type: 'flex',
        name: 'Thanh Trượt'
      },
      {
        id: 'cell',
        type: 'grid',
        name: 'Ô lưới'
      },
    ];
    this.selectedComp = GLOBAL.editor.getSelected();
    this.dsType = GLOBAL.editor.getStyles(`#${this.selectedComp.getId()}`)['--ds'] || 'card';
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.detectChanges()
    }, 0);
  }

  override ngOnDestroy() {
  }
  
  override setValue(): void {
    super.setValue();
    console.log('chay qua toolbar repeeater');
    this.dsType = GLOBAL.editor.getStyles(`#${this.selectedComp.getId()}`)['--ds'] || 'card';
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

  /**
   * show the animation popup
   */
  showAnimationPopup() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupAnimationComponent).create(this._injector);
    popup.instance.selectedEl = GLOBAL.editor.getSelected().view.el;
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
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

  handleOnButtonClick(event: any) {
  }


  handleOnAnimationButtonClick(event: any) {
    this.showAnimationPopup();
  }

  handleOnMoreActionButtonClick(event:any, targetEl: HTMLElement) {
    this.showMoreActionPopup(targetEl);
  }

  /**
   * Duplicate item repeater
   */
  handleOnClickDuplicateItem(e: any){
    if( this.selectedComp.find(this.selectorItem).length === 0 ) return;
    const firstId = this.selectedComp.find(`${this.selectorItem}:first-child`)[0].getId();
    this.handleDuplicateItem(firstId,  this.selectorContainer, this.selectorItem);
    this.detectChanges();
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT); //update vùng chọn
  }

  /**
   * Change display type
   * @param e 
   */
  handleOnSelectDisplayType(e: any){
    console.log(e);
  }
}
