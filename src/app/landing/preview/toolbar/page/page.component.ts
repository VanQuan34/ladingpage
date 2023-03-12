import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter
} from '@angular/core';
import { Utils } from 'src/app/utils/utils';
import { MoWbBaseComponent } from '../../../../components/base.component';
import { GLOBAL } from '../../../editor/editor-wrapper';
import { ILandingPage, IPage } from '../../../editor/root.service';

@Component({
  selector: 'mo-wb-landing-preview-toolbar-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingPreviewPageComponent extends MoWbBaseComponent {

  selectedPageId: string;
  selectedPage: IPage;
  top: number;
  left: number;
  pages: IPage[];

  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 5000;
  @Input() landingPage: ILandingPage;

  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectedPageChanged = new EventEmitter<IPage>();
  
  override onInit() {
    this.pages = this.landingPage.pages;
    this.selectedPage = this.pages.find(page => {
      return page.isHome ? true : false;
    });
    this.selectedPageId = this.selectedPage.id;
  }

  override async onAfterInit() {
    this.detectChanges();
  }

  override onDestroy() { 
  } 

  /**
   * close page list
   */
  close() {
    this.isOpen = false;
    this.detectChanges();
    setTimeout(() => {
      this.onClose.emit({}); 
    }, 500);
  }

  /**
   * handle on toggle open page list
   * @param event 
   */
  handleOnToggleOpenPageList = (event: MouseEvent, toggleEl: HTMLElement) => {
    this.isOpen = !this.isOpen;
    const rect = toggleEl.getBoundingClientRect();
    this.top = rect.top + rect.height + 5;
    this.left = rect.left;
    this.detectChanges();
  }

  /**
   * handle on page item click
   * @param e 
   * @param pageEl 
   */
  handleOnPageItemClick(e: any, page: IPage) {
    this.selectedPage = page;
    this.selectedPageId = page.id;
    this.detectChanges();
    this.onSelectedPageChanged.emit(page);
    this.close();
  }

  /**
   * handle on overlay click
   * @param e 
   */
  handleOnOverlayClick(e: any) {
    this.close();
  }

  /**
   * handle on page list click
   * @param e 
   */
  handleOnPageListClick(e: any) {
    e.stopPropagation();
  }
}
