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

@Component({
  selector: 'mo-wb-landing-editor-comp-toolbar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoLandingEditorCompToolbarMenuComponent extends MoWbBaseComponent {

  @Input() moType: string = '';
  menuList: any[] = []
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    // this.initMenu();
  
  }

  override ngOnDestroy() {
  }


  initMenu(){
    //innit menus
    GLOBAL.landingPage.menus = [

    ] 
  }

  handleOnOpenMenu(event: any){
    const menuEl = GLOBAL.editor.getWrapper().find("#hamburger-toggle")[0];
    const attrs = menuEl.getAttributes();
    attrs['data-show']="true";
    
    menuEl.setAttributes(attrs, {});
    
    this.detectChanges();
  }

  showSettingPopup() {
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorCompPopupMenuSettingComponent).create(this._injector);
    
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }


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
    popup.instance.title = 'Bố cục menu';
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }


  handleOnSettingButtonClick(event: any){
    this.showSettingPopup();
  }

  handleOnLayoutButtonClick(event: any){
    this.showPopupLayout()
  }

  handleOnMoreActionButtonClick(event: any, actionEl: any){
    this.showMoreActionPopup(actionEl);
  }

  handleOnAnimationButtonClick(event: any){
    
  }


 
}