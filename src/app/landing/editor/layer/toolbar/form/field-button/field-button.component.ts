import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorPopupActionComponent } from 'src/app/landing/editor/popup/action/action.component';
import { MoLandingEditorPopupButtonSettingComponent } from 'src/app/landing/editor/popup/button/setting/setting.component';
import { MoLandingEditorCompPopupLayoutComponent } from 'src/app/landing/editor/popup/layout/layout.component';
import { MoWbBaseComponent } from '../../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../../editor-wrapper';


interface IActionAfterSubmit{
  id: number,
  title: string,
  key: string,
}

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-form-field-button',
  templateUrl: './field-button.component.html',
  styleUrls: ['./field-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoLandingEditorLayerToolbarFormFieldButtonComponent extends MoWbBaseComponent { 

  optAfterAction: IActionAfterSubmit[] = [
    {
      id: 1,
      title: 'Hiển thị tin nhắn thành công',
      key: 'success-message'
    },
    {
      id: 2,
      title: 'Đến một trang web hoặc hộp bật lên của trang web',
      key: 'page-popup'
    },
    {
      id: 3,
      title: 'Liên kết đến URL bên ngoài',
      key: 'url-link'
    },

  ];

  override ngOnInit() {
  }

  override ngAfterViewInit() {

  }

  override ngOnDestroy() {
  }

  showPopupLayout() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorCompPopupLayoutComponent).create(this._injector);
    popup.instance.selectedEl = GLOBAL.editor.getSelected().view.el;
    popup.instance.title = 'Giao diện nút';
    popup.instance.onClose.subscribe((event: any) => { 
      // this.clearBgSelected();
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

   /**
   * show setting popup
   */
   showSettingPopup() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupButtonSettingComponent).create(this._injector);
    popup.instance.viewType = "BUTTON-FORM"
    popup.instance.optAfterAction = this.optAfterAction;

    popup.instance.titlePopup = "Thiết lập nút gửi";
    popup.instance.width = 287;
    popup.instance.height = '500px';
    popup.instance.onClose.subscribe((event: any) => { 
      // this.clearBgSelected();
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  handleOnSettingFormClick(event: any){
    this.showSettingPopup();
  }

  handleOnLayoutButtonClick(event: any){
    this.showPopupLayout();
  }

  handleOnAnimationButtonClick(event: any){}

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
}