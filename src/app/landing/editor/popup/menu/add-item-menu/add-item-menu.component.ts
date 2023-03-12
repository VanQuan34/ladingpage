
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoWbPopupWrapperComponent } from '../../../../../components/popup/popup_wrap.component';
import { MoWbMenuPageDropdownComponent } from 'src/app/components/menu-dropdown/menu-page/menu-page.component';
import { MoLandingEditorPopupLinkComponent } from 'src/app/landing/editor/popup/link/link.component';
import { MoLandingEditorCompPopupManagerMenuComponent } from '../manager-menu/manager-menu.component';
// import { MoLandingEditorCompPopupLinkComponent } from '../../link/link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-add-item-menu',
  templateUrl: './add-item-menu.component.html',
  styleUrls: ['./add-item-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupAddItemMenuComponent extends MoWbPopupWrapperComponent {
  
  rulePages: any[] = [];
  @Input() groupIdPage: any[] = [];
  disableBtnAgree: boolean = false;
  
  @Input() selectedIdMenu: string = '';
  @Input() pagesOfMenu: any[];
  @Input() listPage: any[] = [];
  @Output() updatePageOfMenu = new EventEmitter<any[]>();
  override ngOnInit() {
    this.initData();
  }
  
  override ngAfterViewInit() {
    
  }

  override ngOnDestroy() {
  }

  initData(){
    // this.groupIdPage = this.pagesOfMenu.map((item: any) => item.id);
    this.rulePages = GLOBAL.landingPage.pages.map((item: any) => {
      return {
        id: item.id,
        show: this.groupIdPage.includes(item.id) ? true : false,
      }
    })
    this.detectChanges();

  }

  handlerOnCheckBox(e: any, item: any){
    if(e.checked){
      this.groupIdPage.push(item.id);
    }else{
      let result = this.groupIdPage.filter(id => id !== item.id);
      this.groupIdPage = result;
    }
    this.detectChanges();

    
    this.rulePages.forEach(el => {
      if(el.id === item.id){
        el.show = e.checked;
      }
    })
  }

  handlerOnCheckBoxAll(e: any){
    console.log('e:' ,e);
    if(e.checked){
      this.groupIdPage = this.pagesOfMenu.map((item: any) => item.id);
      this.disableBtnAgree = false;
    }else{
      this.groupIdPage = [];
      this.disableBtnAgree = true;
    }
    this.detectChanges();
  }

  handlerApplyListPage(e: any){
    console.log('rulePages:', this.rulePages);
    this.updatePageOfMenu.emit(this.rulePages);
  }
}
