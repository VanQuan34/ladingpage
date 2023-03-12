import {
  Component, OnInit, EventEmitter,
  Output, Input, ChangeDetectionStrategy, Injector, ViewRef, ViewChildren, QueryList, ElementRef
} from '@angular/core';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-menu-of-list-controller',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorMenuOfListControlComponent extends MoLandingEditorInspectorBaseComponent {

  @Input() totalItem : number;
  @Output() totalItemRepeat = new EventEmitter<any>();
  selectorWrapper: string = '.mo-repeater-item-container';
  selectorItem: string = '.mo-comp-container';
  actionTitle: string;
  listId: Array<string> ;
  classActive: any;
  onActive: any;
  idSelected: string;
  isDragged: boolean = false;
  top: number;
  left: number;
  toggle: boolean = false;
  index: number;
  itemTitle: string;
  @Input() topList: number;
  @Input() leftList: number;
  @Output() onClose = new EventEmitter<any>();
  @ViewChildren('submenu') submenu: QueryList<ButtonComponent>;

  override onInit() {
    this.onActive = null;
    this.idSelected = null;
    this.actionTitle = 'Thêm mục';
  }
  
  override onAfterViewInit() {
    setTimeout(() => {
      this.setValue();
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
  }

  override setValue(): void {
    super.setValue();
    if(!this.selectedComp || !this.selectorWrapper || !this.selectorItem) return;
      this.totalItem = this.selectedComp.find(this.selectorItem).length ;
    if(this.totalItem  === 0){
      this.onActive = null;
      this.idSelected = null;
      this.listId = [];
      return;
    }
    this.listId =  GLOBAL.editor.getSelected().find(this.selectorItem).map((item: any)=>{
      return item.getId();
    });
    this.itemTitle = this.selectedComp.view.el.getAttribute('data-title') || 'Mục';
  }

  /**
   * Duplicate item repeater
   * @param event 
   */
  handleOnClickAddItemRepeater(event: any){
    this.handleDuplicateItem(this.idSelected, this.selectorWrapper, this.selectorItem);
    this.setValue();
    this.totalItemRepeat.emit(this.totalItem);
    this.detectChanges();
  }
 
  handleOnClickShowSubMenu(id:any, idx: any){
    this.onActive = null;
    this.index = idx;
    this.toggle = !this.toggle;
    this.idSelected = id;
    this.setPosition(this.submenu, idx);
    this.setValue();
    this.detectChanges();
  }

  handleOnClickIdSelected(idItem: any, idx: any){
    this.onActive = idx;
    this.actionTitle = 'Nhân đôi mục';
    this.idSelected = idItem;
    this.classActive === idx;
    this.selectedComp.find(this.selectorItem).forEach((item:any) => {
    item.view.$el.removeAttr('style');
    })
    this.setValue();
    this.selectedComp.find(`#${this.idSelected}`)[0].view.$el.css('border', '2px solid #009cdb');
  }

  handleOnOverlayClickOutSide(e : any){
    this.onClose.emit({});
    this.selectedComp.find(this.selectorItem).forEach((item:any) => {
      item.view.$el.removeAttr('style');
    })
  }
  
  /**
   * Update total item in list
   */
  handleUpdateTotalItemRepeater(e: any){
    this.totalItem = e.total;
    this.listId = e.arr;
    this.toggle = false;
    this.idSelected = null;
    this.actionTitle = 'Thêm mục';
    this.setValue();
    this.totalItemRepeat.emit(this.totalItem);
  }
  
  /**
   * Get position ElementRef
   * @param container  ElementRef
   * @param idx 
   */
  setPosition(container: any, idx: any) {
    const targetRect = container?._results[idx].buttonEl.nativeElement.getBoundingClientRect();
    this.top = Math.min(window.innerHeight - this.height - 10, targetRect.top ) ;
    this.left = (targetRect.left + targetRect.width - this.width + 2) - 160;
  }
  
  handleOnOverlayClick(e: any){
    this.toggle = false;
  }

  handleDropItemRepeater(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.handleSortHtml(event.container.data, this.selectorWrapper, this.selectorItem);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.setValue();
    this.detectChanges();
  }
  
  handleHiddenSubMenu(){
    this.toggle = false;
  }

  handleChangeNameTitle(title: string){
    this.itemTitle = title;
    this.setValue();
    this.detectChanges();
  }

}
