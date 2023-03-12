import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, SimpleChanges, ChangeDetectionStrategy, Output,
} from '@angular/core';
import { MoWbBaseComponent } from '../base.component';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { execArgv } from 'process';

interface IMenuListItem {
  id?: string,
  name?: string,
  icon?: string,
  isRemove?: boolean,
  isDivider?: boolean
}
@Component({
  selector: 'mo-wb-components-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMenuComponent extends MoWbBaseComponent {
  
  menuToggleEl: HTMLElement;
  @Input() classInclude: string = '';
  @Input() fixedShow: boolean = false;
  @Input() isShow: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() itemHeight: number = 34;
  @Input() parentEl: HTMLElement;
  @Input() items: IMenuListItem[];
  @Input() top: number = 0;
  @Input() left: number = 0;

  @Input() pos: 'top' | 'left' | 'right' | 'bottom' = 'right';
  @Output() onSelectItem = new EventEmitter<IMenuListItem>();
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    if (this.parentEl) {
      this.parentEl.addEventListener('mouseover', this.handleOnParentMouseover);
      this.parentEl.addEventListener('mouseout', this.handleOnParentMouseout);
    }
    //window.addEventListener('scroll', this.handleOnWindowScroll);
    this.calcHeight();
  }

  override ngOnDestroy() {
    if (this.parentEl) {
      this.parentEl.removeEventListener('mouseover', this.handleOnParentMouseover);
      this.parentEl.removeEventListener('mouseout', this.handleOnParentMouseout);
    }
   // window.addEventListener('scroll', this.handleOnWindowScroll);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['items']) {
      this.calcHeight();
    }
  }

  /**
   * calculate menu height
   */
  calcHeight() {
    let height = 0;
    this.items.forEach(item => {
      if (item.isDivider) {
        height += 1;
      } else {
        height += this.itemHeight;
      }
    });

    this.height = height + 8;
  }

  /**
   * set menu position
   * @param menuToggleEl 
   */
  setMenuPosition() {
    const rect = this.menuToggleEl.getBoundingClientRect();
    this.top = rect.top + rect.height + 5;
    this.top = Math.min(this.top,  window.innerHeight - this.height - 30);
    if (this.pos === 'left') {
      this.left = rect.left;
      return;
    }
    if (this.pos === 'right') {
      this.left = rect.left + rect.width - this.width;
      return;
    }
    
  }

  /**
   * handle on parent mouseover
   * @param e 
   */
  handleOnParentMouseover = (e: MouseEvent) => {
    this.isShow = true;
    this.detectChanges();
  }

  /**
   * handle on parent mouseout
   * @param event 
   * @returns 
   */
  handleOnParentMouseout = (event: any) => {
    let e = event.toElement || event.relatedTarget;
    //check for all children levels (checking from bottom up)
    while (e && e.parentNode && e.parentNode != window) {
      if (e.parentNode == this.parentEl || e == this.parentEl) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      e = e.parentNode;
    }
    if (!this.isOpen) {
      // hide menu
      this.isShow = false;
      this.detectChanges();
    }
    return true;
  }

  /**
   * handle menu toggle click
   * @param event 
   */
  handleOnMenuToggleClick(event: MouseEvent, menuToggleEl: HTMLElement) {
    event.stopPropagation();
    this.menuToggleEl = menuToggleEl;
    this.isOpen =!this.isOpen;
    if (this.isOpen) {
      this.setMenuPosition();
    }
    this.detectChanges();
  }

  /**
   * handle on item click
   * @param event 
   * @param item 
   */
  handleOnItemClick(event: MouseEvent, item: IMenuListItem) {
    event.stopPropagation();
    this.onSelectItem.emit(item);
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * handle on overlay click
   * @param event 
   */
  handleOnOverlayClick(event: any) {
    event.stopPropagation();
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }

}

export {
  IMenuListItem
}
