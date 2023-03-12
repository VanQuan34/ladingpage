import {
  Component, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { CacheService } from 'src/app/api/common/cache.service';
import { Utils } from 'src/app/utils/utils';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { EditorConstants } from '../../../constants';
import { GLOBAL } from '../../../editor-wrapper';
import { IPage } from '../../../root.service';

@Component({
  selector: 'mo-wb-landing-editor-page_list',
  templateUrl: './page_list.component.html',
  styleUrls: ['./page_list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPageListComponent extends MoWbBaseComponent {
  
  pages: IPage[];
  currentPage: IPage;
  isShowList: boolean = false;
  top: number;
  left: number;

  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onMenuClose = new EventEmitter<any>();

  override ngOnInit() {
    $(GLOBAL.canvasEl).on(EditorConstants.PAGE_INFO_CHANGED_EVENT, this.handleOnPageInfoChanged);
  }

  override ngAfterViewInit() {
    this.pages = Utils.copyObject(GLOBAL.landingPage.pages);
    this.currentPage = this.pages.find(page => {
      return page.isSelected ? true : false;
    });

    this.detectChanges();
  }

  override ngOnDestroy() {
    $(GLOBAL.canvasEl).off(EditorConstants.PAGE_INFO_CHANGED_EVENT, this.handleOnPageInfoChanged);
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
    const currentPage = GLOBAL.landingPage.pages.find(pageItem => {
      return pageItem.isSelected ? true : false;
    });
    GLOBAL.landingPage.pages.forEach(pageItem => {
      if (pageItem.id === page.id) {
        pageItem.isSelected = true;
      } else {
        pageItem.isSelected = false;
      }
    });

    GLOBAL.builder.buildEditorContent(currentPage);

    this._cacheService.set(EditorConstants.LANDING_PAGE_INFO, GLOBAL.landingPage);

    $(GLOBAL.canvasEl).trigger(EditorConstants.SELECTED_PAGE_CHANGED_EVENT);

    this.currentPage = page;
    this.detectChanges();
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

  /**
   * handle page item click
   * @param e 
   * @param page 
   * @returns 
   */
  handleOnPageItemClick(e: any, page: IPage) {
    if (page.id === this.currentPage.id) {
      return;
    } 
    this.changeSelectedPage(page);
    this.closePageList();
  }

  /**
   * handle page info changed
   */
  handleOnPageInfoChanged = () => {
    this.pages = Utils.copyObject(GLOBAL.landingPage.pages);
    this.currentPage = this.pages.find(page => {
      return page.isSelected ? true : false;
    });
    this.detectChanges();
  }

  /**
   * handle on selected manager page
   * @param event 
   */
  handleOnSelectedManagerPage(event: MouseEvent) {
    $(GLOBAL.canvasEl).trigger(EditorConstants.OPEN_PAGE_MANAGER_EVENT);
  }
  
}
