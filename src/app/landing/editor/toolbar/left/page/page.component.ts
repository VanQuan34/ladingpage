import {
  Component, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { UtilService } from 'src/app/components/date-picker/date-time/calendar/my-date-picker';
import { IMenuListItem } from 'src/app/components/menu/menu.component';
import { getDefaultTemplate } from 'src/app/config';
import { Utils } from 'src/app/utils/utils';
import { uid } from 'uid';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { EditorConstants } from '../../../constants';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { IPage } from '../../../root.service';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPageComponent extends MoWbBaseComponent {
  
  selectedComp: DomComponent;
  menuHomeItems: IMenuListItem[] = [];
  menuItems: IMenuListItem[] = [];
  selectedPageId: string;
  pages: IPage[] = [];
  selectedPage: IPage;
  settingPage: IPage;
  tabSetting: string = 'setting';
  isSettingShow: boolean = false;
  editNamePageId: string = '';

  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onMenuClose = new EventEmitter<any>();
  
  override onInit() {
    this.menuItems = [
      {
        id: 'setting',
        name: 'Thiết lập',
      },
      {
        id: 'seo',
        name: 'Cơ bản SEO',
      },
      {
        id: 'edit-name',
        name: 'Sửa tên',
      },
      {
        id: 'copy',
        name: 'Nhân đôi',
      },
      {
        id: 'edit',
        name: 'Sửa trang',
      },
      {
        id: 'home',
        name: 'Đặt làm trang chủ',
      },
      {
        id: 'remove',
        name: 'Xoá trang',
      }
    ];
    this.menuHomeItems = this.menuItems.filter(item => {
      if (item.id === 'remove' || item.id === 'home') {
        return false;
      }
      return true;
    });

    $(GLOBAL.canvasEl).on(EditorConstants.SELECTED_PAGE_CHANGED_EVENT, this.handleOnSelectedPageChanged);
  }

  override onAfterInit() {
    this.pages = Utils.copyObject(GLOBAL.landingPage.pages);
    this.selectedPage = this.pages.find(page => {
      return page.isSelected ? true : false; 
    });
    this.selectedPageId = this.selectedPage.id;

    setTimeout(() => {
      this.isOpen = true;
      this.detectChanges();
    }, 50);
  }

  override onDestroy() {
    $(GLOBAL.canvasEl).on(EditorConstants.SELECTED_PAGE_CHANGED_EVENT, this.handleOnSelectedPageChanged);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * open setting
   * @param page 
   * @param tabSetting 
   */
  openSetting(page: IPage, tabSetting: string = 'setting') {
    this.settingPage = page;
    this.isSettingShow = true;
    this.tabSetting = tabSetting;
    this.detectChanges();
    if (page.id !== this.selectedPageId) {
      this.changeSelectedPage(page);
    }
  }

  /**
   * remove page
   * @param removePage  
   */
  removePage(removePage: IPage) {
    GLOBAL.landingPage.pages = GLOBAL.landingPage.pages.filter(page => {
      return page.id == removePage.id ? false : true;
    });
    this.pages = Utils.copyObject(GLOBAL.landingPage.pages);
    if (removePage.id !== this.selectedPage.id) { 
      this.detectChanges();
      return;
    }
    // change selected page
    GLOBAL.landingPage.pages.forEach(pageItem => {
      if (pageItem.isHome) {
        pageItem.isSelected = true;
        this.selectedPage = pageItem;
        this.selectedPageId = pageItem.id;
      } else {
        pageItem.isSelected = false;
      }     
    });
    this._cacheService.set(EditorConstants.LANDING_PAGE_INFO, GLOBAL.landingPage);
    $(GLOBAL.canvasEl).trigger(EditorConstants.SELECTED_PAGE_CHANGED_EVENT, {from: 'manager'});
    this.isSettingShow = false;
    this.pages = Utils.copyObject(GLOBAL.landingPage.pages);
    this.detectChanges();

    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * change selected page
   * @param page 
   */
  changeSelectedPage(page: IPage) {
    // this.isSettingShow = false;
    this.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.isSelected = true;
      } else {
        pageItem.isSelected = false;
      }     
    });
    const selectedPage = GLOBAL.landingPage.pages.find(pageItem =>
      { return pageItem.isSelected ? true : false; }
    );
    GLOBAL.landingPage.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.isSelected = true;
      } else {
        pageItem.isSelected = false;
      }     
    });

    this.selectedPageId = page.id;
    this.detectChanges();

    this.pages = Utils.copyObject(GLOBAL.landingPage.pages );
    GLOBAL.builder.buildEditorContent(selectedPage);
    this._cacheService.set(EditorConstants.LANDING_PAGE_INFO, GLOBAL.landingPage);
    $(GLOBAL.canvasEl).trigger(EditorConstants.SELECTED_PAGE_CHANGED_EVENT, {from: 'manager'});

    this.selectedPage = page;
    this.settingPage = page;
    this.detectChanges();
  }

  /**
   * edit page name
   * @param page 
   */
  editPageName(name: string, page: IPage) {
    page.name = name;
    GLOBAL.landingPage.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.name = name;
      }
    });
   
    this.isSettingShow = false;
    this.editNamePageId = '';
    this.detectChanges();
    
    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * add new Page
   */
  addNewPage() {
    // check list pages
    if (this.pages.length > 10) {
      this._toast.show("warning", 'Số lượng trang đã đạt tới giớ hạn là 10 trang.');
      return;
    }
    const defaultTemplate = getDefaultTemplate();
    const pageId = uid();
    const page: IPage = {
      id: pageId,
      name: 'Trang mới',
      isHome: false,
      body: defaultTemplate.body,
      style: defaultTemplate.style,
      isSelected: true,
      anchors: [],
      breakPoints: this._rootService.getBreakPointsDefault()
    }
    // push page
    this.pages.push(page);
    GLOBAL.landingPage.pages.push(page);

    this.editNamePageId = pageId;
    this.isSettingShow = false;

    this.changeSelectedPage(page);

    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * change page home
   * @param page 
   */
  changeHomePage(page: IPage) {
    this.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.isHome = true;
      } else {
        pageItem.isHome = false;
      }
    });

    GLOBAL.landingPage.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.isHome = true;
      } else {
        pageItem.isHome = false;
      }
    });

    this.isSettingShow = false;
    this.detectChanges();

    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * copy page
   * @param page 
   */
  copyPage(page: IPage) {
    // check list pages
    if (this.pages.length > 10) {
      this._toast.show("warning", 'Số lượng trang đã đạt tới giớ hạn là 10 trang.');
      return;
    }
    const copyPage = GLOBAL.landingPage.pages.find(pageItem =>
      {
        return pageItem.id === page.id ? true : false;
      }
    )
    const newPage: IPage = Utils.copyObject(copyPage);
    const newId = uid();
    newPage.id = newId;
    // push page
    this.pages.push(newPage);
    GLOBAL.landingPage.pages.push(newPage);

    this.editNamePageId = newId;
    this.isSettingShow = false;
    // change selected page
    this.changeSelectedPage(newPage);

    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * copy page info
   * @param fromPage 
   * @param toPage 
   */
  copyPageInfo(fromPage: IPage, toPage: IPage) {
    toPage.name = fromPage.name;
    toPage.isHome = fromPage.isHome;
    toPage.desc = fromPage.desc;
    toPage.slug = fromPage.slug;
    toPage.title = fromPage.title;
    toPage.allowIndex = fromPage.allowIndex;
  }

  /**
   * handle on page close
   * @param event 
   */
  handleOnCloseClick(event: MouseEvent) {
    this.isOpen = false;
    this.detectChanges();
    setTimeout(() => {
      this.onMenuClose.emit({});
    }, 500);
  }

  /**
   * handle select menu item
   * @param menuItem 
   * @param page 
   * @param index 
   */
  handleOnSelectMenuItem(menuItem: IMenuListItem, page: IPage, index: number) {
    switch(menuItem.id) {
      case 'setting':
        this.openSetting(page);
        break;
      case 'seo':
        this.openSetting(page, 'basic-seo');
        break;
      case 'edit-name':
        this.editNamePageId = page.id;
        this.detectChanges();
        break;
      case 'remove':
        this.settingPage = page;
        this.isConfirmOpen = true;
        this.detectChanges();
        break;
      case 'home':
        this.changeHomePage(page);
        break;
      case 'edit':
        if (this.selectedPageId === page.id) {
          return;
        }
        this.changeSelectedPage(page);
        break;
      case 'copy':
        this.copyPage(page);
        break;
      default:
        break;
    }
  }

  /**
   * handle on Add new page click
   * @param event 
   */
  handleAddPageButtonClick(event: MouseEvent) {
    this.addNewPage();
  }

  /**
   * handle on page item click
   * @param event 
   * @param page 
   * @returns 
   */
  handleOnPageItemClick(event: MouseEvent, page: IPage) {
    if(page.id === this.selectedPageId || page.id === this.editNamePageId) {
      this.editNamePageId = '';
      this.detectChanges();
      return;
    }
    this.editNamePageId = '';
    this.isSettingShow = false;
    // change selected page 
    this.changeSelectedPage(page);

    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * handle on setting close
   * @param event 
   */
  handleOnSettingClose(event: MouseEvent) {
    this.isSettingShow = false;
    this.detectChanges();
  }

  /**
   * handle on page name changed
   * @param value 
   * @param page 
   */
  handleOnPageNameChange(value: string, page: IPage) {
    this.editPageName(value, page);
  }

  /**
   * handle on confirm page remove
   */
  handleOnConfirmRemoveOk() {
    this.isConfirmOpen = false;
    this.detectChanges();

    this.removePage(this.settingPage);
  }

  /**
   * handle on page changed
   * @param page 
   */
  handleOnPageChanged(page: IPage) {
    //console.log('handleOnPageChanged page=', page);
    if (page.isHome) {
      this.pages.forEach(pageItem => {
        pageItem.isHome = false;
      });
      page.isHome = true;
      //console.log('handleOnPageChanged pages=', this.pages);
    }
    
    if (page.isHome) {
      GLOBAL.landingPage.pages.forEach(pageItem => {
        pageItem.isHome = false;
      });
      page.isHome = true;
      //console.log('handleOnPageChanged pages=', this.pages);
    }
    const toPage = GLOBAL.landingPage.pages.find(pageItem => {
      return pageItem.id === page.id ? true : false;
    });
    this.copyPageInfo(page, toPage);
    this.pages = Utils.copyObject(GLOBAL.landingPage.pages);
    
    this.detectChanges();

    $(GLOBAL.canvasEl).trigger(EditorConstants.PAGE_INFO_CHANGED_EVENT);
  }

  /**
   * handle on selected page changed event
   * @param event 
   * @param params 
   */
  handleOnSelectedPageChanged = (event: any, params: any) =>{
    if (params && params.from === 'manager') {
      return;
    }
    this.isOpen = false;
    this.detectChanges();
    setTimeout(() => {
      this.onMenuClose.emit({});
    }, 500);
  }
}
