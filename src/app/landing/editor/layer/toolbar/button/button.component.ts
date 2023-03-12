
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

// import { MoLandingEditorCompPopupButtonSettingComponent } from '../../popup/button/setting/setting.component';
// import { MoLandingEditorCompPopupAnimationComponent } from '../../popup/animation/animation.component';
// import { MoLandingEditorCompPopupLinkComponent } from '../../popup/link/link.component';
// import { MoLandingEditorCompPopupActionComponent } from '../../popup/action/action.component';
import { MoLandingEditorCompPopupEventComponent } from '../../../popup/event/event.component';
import { MoLandingEditorCompPopupLayoutComponent } from '../../../popup/layout/layout.component';
import { MoLandingEditorPopupButtonSettingComponent } from '../../../popup/button/setting/setting.component';
import { MoLandingEditorPopupAnimationComponent } from '../../../popup/animation/animation.component';
import { MoLandingEditorPopupLinkComponent } from '../../../popup/link/link.component';
import { MoLandingEditorPopupActionComponent } from '../../../popup/action/action.component';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarButtonComponent extends MoWbBaseComponent {
  
  selectedComp: DomComponent;
  isOpen: boolean;
  moType: string;
  top: number;
  left: number;
  bgColorActive: string = '';
  hasLink: boolean = false;
  hasEvent: boolean = false;

  @Input() classInclude: string = '';

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.setValue();

  }

  override ngOnDestroy() {
  }

  /**
   * set value initial
   */

  setValue(){
    const selectedComp = GLOBAL.editor.getSelected();
    const attrs = selectedComp.getAttributes();

    this.hasLink = (!attrs['link-type'] || attrs['link-type'] === 'NONE') ? false : true;
    this.hasEvent = !attrs['events'] ? false : true;
    this.detectChanges();

  }

  /**
   * show setting popup
   */
  showSettingPopup() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupButtonSettingComponent).create(this._injector);
    
    popup.instance.onClose.subscribe((event: any) => { 
      this.clearBgSelected();
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
      this.clearBgSelected();
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  /**
   * show the setup link popup
   */
  showSetupLinkPopup() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupLinkComponent).create(this._injector);
    popup.instance.onClose.subscribe((event: any) => { 
      this.setValue();
      this.clearBgSelected();
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

  showPopupLayout() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorCompPopupLayoutComponent).create(this._injector);
    popup.instance.selectedEl = GLOBAL.editor.getSelected().view.el;
    popup.instance.title = 'Giao diện nút';
    popup.instance.onClose.subscribe((event: any) => { 
      this.clearBgSelected();
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  clearBgSelected(){
    this.bgColorActive = '';
    this.detectChanges();
  }

  showPopupEvent(){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorCompPopupEventComponent).create(this._injector);
    popup.instance.selectedEl = GLOBAL.editor.getSelected().view.el;
    popup.instance.onClose.subscribe((event: any) => { 
      this.setValue();
      this.clearBgSelected();
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  handleOnLayoutButtonClick(event: any){
    this.bgColorActive = 'LAYOUT'
    this.showPopupLayout();
  }

  handleOnEventButtonClick(event: any){
    this.bgColorActive = 'EVENT';
    this.showPopupEvent()
  }

  handleOnButtonClick(event: any) {
  }

  handleOnSettingButtonClick(event: any) {
    this.bgColorActive = 'SETTING'
    this.showSettingPopup();
  }

  handleOnAnimationButtonClick(event: any) {
    this.bgColorActive = 'ANIMATION';
    this.showAnimationPopup();
  }

  handleOnSetupLinkButtonClick(event: any) {
    this.bgColorActive = 'LINK'
    this.showSetupLinkPopup();
  }
}
