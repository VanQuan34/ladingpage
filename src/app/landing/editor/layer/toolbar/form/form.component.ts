import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

// import { MoLandingEditorCompPopupButtonSettingComponent } from '../../popup/button/setting/setting.component';
// import { MoLandingEditorCompPopupAnimationComponent } from '../../popup/animation/animation.component';
// import { MoLandingEditorCompPopupLinkComponent } from '../../popup/link/link.component';
// import { MoLandingEditorCompPopupActionComponent } from '../../popup/action/action.component';
import { MoLandingEditorCompPopupMenuSettingComponent } from '../../../popup/menu/setting/setting.component';
import { MoLandingEditorCompPopupLayoutComponent } from '../../../popup/layout/layout.component';
import { MoLandingEditorCompPopupEventComponent } from '../../../popup/event/event.component';
import { MoLandingEditorPopupActionComponent } from '../../../popup/action/action.component';
import { MoLandingEditorPopupFormSettingComponent } from '../../../popup/form/form.component';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoLandingEditorLayerToolbarFormComponent extends MoWbBaseComponent { 

  override ngOnInit() {
  }

  override ngAfterViewInit() {

  }

  override ngOnDestroy() {
  }

  handleOnShowPopupAddNewsField(event: any){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupFormSettingComponent).create(this._injector);
    
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  handleOnLayoutButtonClick(event: any){

  }

  handleOnAnimationButtonClick(event: any){

  }

  handleOnMoreActionButtonClick(event:any, targetEl: HTMLElement) {
    this.showMoreActionPopup(targetEl);
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


  showSettingPopup(){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupFormSettingComponent).create(this._injector);
    
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  handleOnSettingFormClick($event: any){
    this.showSettingPopup();
  }
}