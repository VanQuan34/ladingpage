import { MoWbInputComponent } from '../../../../../components/input/input.component';
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild, Output, EventEmitter
} from '@angular/core';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { uid } from 'uid';


@Component({
  selector: 'mo-wb-landing-editor-popup-manager-menu',
  templateUrl: './manager-menu.component.html',
  styleUrls: ['./manager-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupManagerMenuComponent extends MoWbPopupWrapperComponent {
  
  widthPopup: number = 250;
  heightPopup: string = '275px';
  isRename: boolean = false;
  @Input() menus: any[] = [];
  selectedId: string = '';
  @Input() selectedIdMenu: string = '';
  isAddNew: boolean = false;
  // newValueInput: string = '';
  listOption: any[] = [
    {
      type: 'rename',
      title: 'Đổi tên',
      iconLeft: ''
    },
    {
      type: 'duplicate',
      title: 'Nhân đôi',
      iconLeft: ''
    },
    {
      type: 'remove',
      title: 'Xóa menu',
      iconLeft: ''
    }
  ]

  @ViewChild('input') inputRef: MoWbInputComponent;
  @Output() updateListMenu = new EventEmitter<any>();
  @Output() onSelectedMenu = new EventEmitter<any>();
  @Output() allowUpdateListPage = new EventEmitter<any>();
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    // this.initData();
  }

  override ngOnDestroy() {
  }


  getListPageOfMenu(get: 'HOME' | 'ALL'){
    const pages = GLOBAL.landingPage.pages;
    const menus = GLOBAL.landingPage.menus;
    let result: any[] = [];
    if(get === 'HOME'){
      let homePage = pages.find((item: any) => {
        if(item.isHome){
          return true;
        }
        return false;
      })
      console.log(homePage);
      result.push(homePage);
    }
    return result;

  }

  handlerOnAddMenuItem(e: any){
    console.log(this.getListPageOfMenu('HOME'));
    this.selectedIdMenu = '';
    this.isAddNew = true;
    const newMenu: any = {
      id: uid(),
      name: 'Menu mới',
      list: this.getListPageOfMenu('HOME'),
    }
    GLOBAL.landingPage.menus.push(newMenu);
    this.detectChanges();
    //set selectedId
    const lastEl = GLOBAL.landingPage.menus[GLOBAL.landingPage.menus.length - 1];
    if(!lastEl){
      return;
    }
    this.isRename = true;
    this.selectedId = lastEl.id;
    this.detectChanges();
    this.inputRef?.focus();
  }

  handlerDoubleClick(event: any, item: any){
    console.log('item double click:', item);
    this.selectedId = item.id;
    this.isRename = true;
    this.detectChanges();
    this.inputRef?.focus();
  }

  handleOnSelectMenuItem(event: any, selectedMenu: any){
    console.log(event);
    console.log(selectedMenu);

    switch (event.type) {
      case 'rename':
        this.isRename = true;
        this.selectedId = selectedMenu.id;
        this.detectChanges();
        this.inputRef?.focus();
        break;
      case 'duplicate':
        this.duplicateMenu(selectedMenu);
        break;
      case 'remove':
        this.removeMenu(selectedMenu);
        break;
      default:
        break;
    }
    this.detectChanges();
  }

  removeMenu(selectedMenu: any){
    if(!selectedMenu){
      return;
    }
    GLOBAL.landingPage.menus = GLOBAL.landingPage.menus.filter(item => item.id !== selectedMenu.id);
    this.menus = GLOBAL.landingPage.menus;
    this.updateListMenu.emit(this.menus);

    this.detectChanges();
  }
  duplicateMenu(selectedMenu: any){
    if(!selectedMenu){
      return;
    }
    const newMenu = {
      id: uid(),
      name: `Bản sao của ${selectedMenu['name']}`,
      list: selectedMenu.list
    }
    GLOBAL.landingPage.menus.push(newMenu);
    this.detectChanges();

    const lastEl = GLOBAL.landingPage.menus[GLOBAL.landingPage.menus.length - 1];
    if(!lastEl){
      return;
    }
    this.isRename = true;
    this.selectedId = lastEl.id;
    this.detectChanges();
    this.inputRef?.focus();

  }

  onBlurInput(e: any){
    this.isRename = false;
    this.handlerOnRenameChange();
    this.detectChanges();
  }

  handlerChooseMenu(event: any, selectedMenu: any){
    console.log('selectedMenu:', selectedMenu);
    this.selectedIdMenu = selectedMenu.id;
    this.detectChanges();
    this.onSelectedMenu.emit(selectedMenu);
    
  }

  handlerOnRenameChange(){
    const value = this.inputRef.value;
    if(!value){
      return;
    }
    this.isRename = false;
    GLOBAL.landingPage.menus.forEach((item: any) => {
      if(item.id === this.selectedId){
        item.name = value;
        this.updateListMenu.emit(item);
        if(this.isAddNew){
          this.allowUpdateListPage.emit(item);
        }
      }
    })
    if(this.isAddNew){
      this.selectedIdMenu = this.selectedId;
      this.isAddNew = false;
    }
    this.detectChanges();
    // this.updateListMenu.emit(this.selectedId);
  }
}