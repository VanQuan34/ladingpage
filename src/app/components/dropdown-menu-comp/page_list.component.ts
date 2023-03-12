import {
  Component, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { CacheService } from 'src/app/api/common/cache.service';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { ILandingPage, IPage } from 'src/app/landing/editor/root.service';
// import { MoWbDetectionComponent } from '../../../../../..components/detection.component';
// import { EditorConstants } from '../../../constants';
// import { GLOBAL } from '../../../editor-wrapper';
// import { ILandingPage, IPage } from '../../../root.service';
import { MoWbDetectionComponent } from '../detection.component';

@Component({
  selector: 'mo-wb-landing-editor-dropdown-menu-comp',
  templateUrl: './page_list.component.html',
  styleUrls: ['./page_list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorDropdownMenuCompComponent extends MoWbDetectionComponent {
  
  landingPage: ILandingPage;
  menus: any[] = [];
  currentPage: IPage;
  isShowList: boolean = false;
  top: number;
  left: number;


  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onMenuClose = new EventEmitter<any>();
  @Output() showManagerMenu = new EventEmitter<any>();
  @Output() selectedMenu = new EventEmitter<any>();

  constructor(
    public override _changeDetection: ChangeDetectorRef,
    public _cacheService: CacheService
  ) {
    super(_changeDetection);
  }


  override ngOnInit() {
    GLOBAL.editor.getEditor().on('component:toggled', this.handleOnCompToggled);

    this.menus = GLOBAL.landingPage.menus;
    this.currentPage = this.menus[0];
    // this.currentPage = this.landingPage.pages.find(page => {
    //   return page.isSelected ? true : false;
    // });

    this.detectChanges();
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
    GLOBAL.editor.getEditor().off('component:toggled', this.handleOnCompToggled);
  }

  updateComp(){
    this.menus = GLOBAL.landingPage.menus;
    this.currentPage = this.menus[0];
    this.detectChanges();

  }
  ngOnChanges(changes: SimpleChanges) {
  }
  /**
   * toggle open page list
   * @param pageEl 
   */
  toggleOpenPageList(pageEl: HTMLElement) {
    this.isShowList = !this.isShowList;
    const rect = pageEl.getBoundingClientRect();
    this.top = rect.top + rect.height + 5;
    this.left = rect.left;
    this.detectChanges();
  }

  /**
   * change selected page
   * @param page 
   */
  changeSelectedPage(page: IPage) {
    GLOBAL.landingPage.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.isSelected = true;
      } else {
        pageItem.isSelected = false;
      }
    });
    GLOBAL.builder.buildEditorContent(this.currentPage);

    this._cacheService.set(EditorConstants.LANDING_PAGE_INFO, GLOBAL.landingPage);
    GLOBAL.editor.getModel().trigger(EditorConstants.SELECTED_PAGE_CHANGED_EVENT);

    this.currentPage = GLOBAL.landingPage.pages.find(item => {
      return item.id === page.id ? true : false;
    })
    this.detectChanges();
  }

  setSelectedIdMenu(menu: any){
    if(menu.id === this.currentPage.id){
      return;
    }
    this.currentPage = menu;
    this.detectChanges();
  }

  handlerShowManagerMenu(){
    this.showManagerMenu.emit();
  }
  /**
   * close page list
   */
  closePageList() {
    this.isShowList = false;
    this.detectChanges();
  }
  
  handleOnCompToggled = (comp: any) => {
    if (!comp) {
      return;
    }
    this.detectChanges();
  }

  handleOnMenuClick(e: any, pageEl: HTMLElement) {
    this.toggleOpenPageList(pageEl);
  }

  handleOnOverlayClick(e: any) {
    this.closePageList();
  }

  handleOnPageListClick(e: any) {
    e.stopPropagation();
  }

  

  handleOnPageItemClick(e: any, menu: any) {
    console.log('menu:', menu);
    if (menu.id === this.currentPage.id) {
      return;
    }

    this.menus = GLOBAL.landingPage.menus;
    this.currentPage = this.menus.find((item: any) => {
      if(item.id === menu.id){
        return true;
      }
      return false;
    })
    this.selectedMenu.emit(menu);
    this.closePageList();
  }
  
}
