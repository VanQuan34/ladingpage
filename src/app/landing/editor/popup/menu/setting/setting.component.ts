import { uid } from 'uid';

import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoWbPopupWrapperComponent } from '../../../../../components/popup/popup_wrap.component';
import { MoWbMenuPageDropdownComponent } from 'src/app/components/menu-dropdown/menu-page/menu-page.component';
import { MoLandingEditorPopupLinkComponent } from 'src/app/landing/editor/popup/link/link.component';
import { MoLandingEditorCompPopupManagerMenuComponent } from '../manager-menu/manager-menu.component';
import { MoLandingEditorCompPopupAddItemMenuComponent } from '../add-item-menu/add-item-menu.component';
import { MoWbDropdownComponent } from 'src/app/components/dropdown/dropdown.component';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { MoLandingEditorDropdownMenuCompComponent } from 'src/app/components/dropdown-menu-comp/page_list.component';
// import { MoLandingEditorCompPopupLinkComponent } from '../../link/link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-button-menu',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupMenuSettingComponent extends MoWbPopupWrapperComponent {

  selectedComp: DomComponent;
  moType: string;
  widthPopup: number = 300;
  isOpen: boolean = false;
  isOpenOpt: boolean = false;
  index: number = 0;
  menus: any[] = [];
  isRename: boolean = false;
  selectedId: string = '';
  selectedIdMenu: string = '';
  // this.menus = GLOBAL.landingPage.menus;
  

  itemsOfMenu: any[] = []
  listSelectOption: any[] = [
    {
      type: 'edit-link',
      title: 'Thay đổi liên kết',
      iconLeft: 'mo-icn-sua'
    },
    {
      type: 'rename',
      title: 'Đổi tên',
      iconLeft: 'mo-icn-Report-MKT'
    },
    {
      type: 'mo-to-submenu',
      title: 'Di chuyển đến menu con',
      iconLeft: 'mo-icn-change_text_color'
    },
    {
      type: 'remove',
      title: 'Loại bỏ khỏi menu',
      iconLeft: 'mo-icn-preview'
    },
    {
      type: 'setting',
      title: 'Thiết lập trang',
      iconLeft: 'mo-icn-menu-duplicate'
    }
  ]

  listItem: any[] = [
    {
      id: 1,
      title: 'Các trang của trang web',
      type: 'PAGE'
    },
    {
      id: 2,
      title: 'Liên kết',
      type: 'LINK'
    },
    {
      id: 3,
      title: 'Tiêu đề menu con',
      type: 'SUBMENU'
    }
  ]

  @ViewChild('dropdown') dropdownRef: MoWbDropdownComponent;
  @ViewChild('input') inputRef: MoWbInputComponent;
  @ViewChild('dropdownMenus') dropdownMenus: MoLandingEditorDropdownMenuCompComponent;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.innitMenu();
  }

  override ngOnDestroy() {
  }


  innitMenu(){
    this.menus = GLOBAL.landingPage.menus;
    this.selectedIdMenu = GLOBAL.landingPage.menus[0].id;
    this.itemsOfMenu = GLOBAL.landingPage.menus[0].list;
    this.detectChanges();
  }

  onSelectMenu(menuItem: any){
    this.itemsOfMenu = menuItem.list;
    this.selectedIdMenu = menuItem.id;
    this.detectChanges();
  }

  onButtonDropdownClick(event: any, targetEl: HTMLElement){
    this.showManageMenuPopup(targetEl);
  }

  showManageMenuPopup(targetEl: HTMLElement){
    const popup = this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorCompPopupManagerMenuComponent).create(this._injector);
    popup.instance.targetEl = targetEl;
    popup.instance.menus = GLOBAL.landingPage.menus;
    popup.instance.selectedIdMenu = this.selectedIdMenu;
    popup.instance.onClose.subscribe((event: any) => {
      this._domService.removeComponentFromBody(popup);
    });
    popup.instance.updateListMenu.subscribe((menuSelected: any) => {
      // this.menus = GLOBAL.landingPage.menus;
      // this.dropdownRef.updateList();
      this.dropdownMenus.updateComp();
      this.detectChanges();
    });

    popup.instance.allowUpdateListPage.subscribe((menuSelected: any) => {
      this.dropdownMenus.setSelectedIdMenu(menuSelected);
      this.itemsOfMenu = menuSelected.list;
      this.detectChanges();
    });
    popup.instance.onSelectedMenu.subscribe((menuSelected: any) => {
      this.dropdownMenus.setSelectedIdMenu(menuSelected);
      this.itemsOfMenu = menuSelected.list;
      this.detectChanges();
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
    this.detectChanges();
  }

  handlerOnSelectedMenu(menu: any){
    this.itemsOfMenu = menu.list;
    this.detectChanges();
  }

  showPopupAddLink(){
    const popup = this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorPopupLinkComponent).create(this._injector);
    popup.instance.rule = 'MENU'
    popup.instance.listRadioLink = [
      {
        id: 3,
        title: 'Địa chỉ web',
        key: 'WEB',
      },
      {
        id: 4,
        title: 'Neo',
        key: 'ANCHOR',
      },
      {
        id: 7,
        title: 'Email',
        key: 'EMAIL',
      },
      {
        id: 8,
        title: 'Số điện thoại',
        key: 'PHONE',
      },
    ];
    popup.instance.onClose.subscribe((event: any) => {
      // this.setValue();
      // this.clearBgSelected();
      this._domService.removeComponentFromBody(popup);
    });
    popup.instance.getDataLink.subscribe((data: any) => {
      this.addItemTypeLink(data);
    })
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  addItemTypeLink(data: any){
    console.log('data:', data);
    console.log(this.selectedIdMenu);
    let itemLink = {
      id: uid(),
      name: 'Liên kết mới',
      type: {href: data.href, target: data.target ? data.target : '_self'}
    }
    let menus = GLOBAL.landingPage.menus;
    menus.forEach((item: any, index: number) => {
      if(item.id === this.selectedIdMenu){
        menus[index].list.push(itemLink);
      }
    })
    this.menus = GLOBAL.landingPage.menus;
    this.detectChanges();
    console.log('applly item:', this.menus);
  }

  applyRulePage(rulePage: any[]){
    let pages = GLOBAL.landingPage.pages;
    // let menus = GLOBAL.landingPage.menus;
    let listPage: any[] = [];
    let findIndex: number = 0;
    for(let i=0; i<pages.length; i++){
      for(let j=0; j<rulePage.length; j++){
        if((pages[i].id === rulePage[j].id) && rulePage[j].show){
          listPage.push({
            id: pages[i].id,
            name: pages[i].name,
            type: pages[i]
          });
        }
      }
    }
    GLOBAL.landingPage.menus.forEach((item, index) => {
      if(item.id === this.selectedIdMenu){
        item.list = listPage;
        findIndex = index;
      }
    })
    this.menus = GLOBAL.landingPage.menus;
    this.itemsOfMenu = this.menus[findIndex].list;
    this.detectChanges();
  }

  showPopupPage(){
    const popup = this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorCompPopupAddItemMenuComponent).create(this._injector);
    popup.instance.listPage = GLOBAL.landingPage.pages;
    popup.instance.selectedIdMenu = this.selectedIdMenu;
    popup.instance.pagesOfMenu = this.itemsOfMenu;
    popup.instance.groupIdPage = this.itemsOfMenu.map((item: any) => item.id);

    popup.instance.onClose.subscribe((event: any) => {
      // this.setValue();
      // this.clearBgSelected();updateList
      this._domService.removeComponentFromBody(popup);
    });
    popup.instance.updatePageOfMenu.subscribe((rulePage: any[]) => {
      this.applyRulePage(rulePage);
    });
    this._domService.addDomToBody(popup);
    popup.instance.show();
  }

  onSelectedOptionAddMenu(item: any){
    if(item.type === 'LINK'){
      this.showPopupAddLink();
    }
    if(item.type === 'PAGE'){
      this.showPopupPage();
    }
  }

  getIconItem(item: any){
    if(!item) return 'mo-icn-Demo_sheet';
    const href = item.type['href'];
    if(href.includes('mailto')){
      return 'mo-icn-JB_webpushform_email';
    }else if(href.includes('tel')){
      return 'mo-icn-call';
    }else{
      return 'mo-icn-Demo_sheet';
    }
  }

  handleOnSelectMenuItem(event: any, selectedPage: any){
    console.log(event, selectedPage);
    switch (event.type) {
      case 'rename':
        this.isRename = true;
        this.selectedId = selectedPage.id;
        this.detectChanges();
        this.inputRef?.focus();
        break;
      case 'remove':
        this.removePageofMenu(selectedPage)
        break;
      default:
        break;
    }
  }

  removePageofMenu(selectedPage: any){
    this.itemsOfMenu = this.itemsOfMenu.filter((item: any) => item.id !== selectedPage.id);
    this.detectChanges();

    console.log('after filter:', this.itemsOfMenu);
    GLOBAL.landingPage.menus.forEach(item => {
      if(item.id === this.selectedIdMenu){
        item.list = this.itemsOfMenu;
      }
    })
    this.menus = GLOBAL.landingPage.menus;
    this.detectChanges();
  }

  showOptionAddMenu(target: ElementRef){
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbMenuPageDropdownComponent).create(this._injector);
    modalRef.instance.listSelectOption = this.listItem;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    modalRef.instance.onSelectItem.subscribe((item: any) => {
      this.onSelectedOptionAddMenu(item);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(target);
  }

  handlerOnAddMenuItem(target: ElementRef){
    this.showOptionAddMenu(target);
  }

  handlerDoubleClick(e: any, item: any){
    console.log('double click', item);
    this.selectedId = item.id;
    this.isRename = true;
    this.detectChanges();
    this.inputRef.focus()
  }
  handlerOnRenameChange(){
    const value = this.inputRef.value;
    if(!value){
      return;
    }
    console.log(GLOBAL.landingPage.pages);

    console.log(this.selectedId);
    this.isRename = false;
    GLOBAL.landingPage.pages.forEach(item => {
      if(item.id === this.selectedId){
        item.name = value;
      }
    });
  
    GLOBAL.landingPage.menus.forEach((item: any, index: number) => {
      item.list.forEach((element: any) => {
        if(element.id === this.selectedId){
          element.name = value;
        }
      });
    })
    this.menus = GLOBAL.landingPage.menus;
    this.detectChanges();
  }
  onBlurInput(e: any){
    console.log('blur')
    this.isRename = false;
    this.handlerOnRenameChange();
    this.detectChanges();
  }

  handlerChangeDrag(event: any){
    console.log('event:', event);
    // this.listPages = event;
    this.detectChanges();
  }
  handlerShowOption(event: any, i: any){
    console.log(i);
    this.index = i;
    this.isOpenOpt = true;
    this.detectChanges();
  }

  handlerMoveSubmenu(event: any, i: any){
    
  }

  handlerRemoveItemSubmenu(event: any){
    
  }


  handleAddItemMenu(event: any) {
    this.isOpen = true;
    this.detectChanges();
  }

  handlerAddItemSite($event: any) {

  }


}
