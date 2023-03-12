import {
  Component, OnInit, EventEmitter,
  Output, Input, ChangeDetectionStrategy, Injector, ViewRef, ViewChildren, QueryList, ElementRef, ViewChild
} from '@angular/core';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';
import {CdkDragDrop, CdkDragEnter, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { uid } from 'uid';
import { cloneDeep } from 'lodash';
import { MoWbMediaStoreModalComponent } from 'src/app/media-store/store-modal/media-store-modal.component';

const SIZE_ITEM = '--size-item';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-list-of-carousel',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorListOfCarouselComponent extends MoLandingEditorInspectorBaseComponent {

  selectorWrapper: string = '.mo-carousel-container';
  slcItem: string = '.item-carousel';
  listSrc: Array<string>;
  isDragged: boolean = false;
  menuItems: Array<object>;
  widthItem: number;
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() files: EventEmitter<any> = new EventEmitter();

  public target: CdkDropList = null;
  public targetIndex: number;
  public source: CdkDropList = null;
  public sourceIndex: number;
  public activeContainer: any;

  override onInit() {
    this.menuItems = [
      {
        id: 'replace',
        name: 'Thay thế hình ảnh',
        icon: 'mo-icn-replace'
      },
      {
        id: 'remove',
        name: 'Xoá hình ảnh',
        icon: 'mo-icn-menu-xoa',
        isRemove: true
      }
    ];
  }

  override onAfterViewInit() {
    setTimeout(() => {
      let phElement = this.placeholder.element.nativeElement;
      phElement.style.display = 'none';
      phElement.parentNode.removeChild(phElement);
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
  }

  override setValue(): void {
    super.setValue();
    if(this.selectedComp.find(this.selectorWrapper).length == 0) return;
      const totalItem = this.selectedComp.find(this.slcItem).length ;
    if(totalItem  === 0){
      this.listSrc = [];
      return;
    }
    this.listSrc =  this.selectedComp.find(this.selectorWrapper)[0].find(this.slcItem).map((item: any, idx: number)=>{
      const ele =  item.view.$el[0];
      const src  = getComputedStyle(ele)['backgroundImage'].match(/url\(["']?([^"']*)["']?\)/)[1];
      return src;  
    });
    this.widthItem = this.getStyle()[SIZE_ITEM] && parseInt(this.getStyle()[SIZE_ITEM].replace('px', '').trim()) || 170;
    this.detectChanges();
  }
  
  /**
   * Update style background-image for data-index
   * @param selector 
   * @param urls <Array url>
   */
  handleSortUpdateBgCarouselItem(selectorWrapper: string, urls: Array<string>){
    this.selectedComp.find(selectorWrapper)[0].find(this.slcItem).map((item: any, idx: number)=> {
      const idItemControl = `#${this.selectedComp.getId()} ${selectorWrapper} ${this.slcItem}[data-index="${idx}"]`;
      GLOBAL.editor.setStyles(idItemControl, {'background-image': 'url('+urls[idx]+')' }, {fixMedia: true}); // set all media
    });
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    if (!this.target) {
      return;
    }
    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;
    phElement.style.display = 'none';
    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;
    this.activeContainer = null;

    if (this.sourceIndex !== this.targetIndex) {
      // this.setValue();
      moveItemInArray(this.listSrc, this.sourceIndex, this.targetIndex);
      this.handleSetAttrDataIndex(this.slcItem);
      this.handleSortUpdateBgCarouselItem(this.selectorWrapper, this.listSrc);
      this.setValue();
    }
    this.detectChanges();
  }

  cdkDropListEntered(e: CdkDragEnter) {
    const drag = e.item;
    const drop = e.container;

    if (drop === this.placeholder) {
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;
    // sourceElement.style.backgroundColor = 'red';
    const dragIndex = __indexOf(
      dropElement.parentElement.children,
      this.source ? phElement : sourceElement
    );
    const dropIndex = __indexOf(
      dropElement.parentElement.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = dropElement.clientWidth / 2 + 'px';
      phElement.style.height = dropElement.clientHeight + 'px';
      sourceElement.parentElement.removeChild(sourceElement);
    }
    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    requestAnimationFrame(() => {
      this.placeholder._dropListRef.enter(
        drag._dragRef,
        drag.element.nativeElement.offsetLeft,
        drag.element.nativeElement.offsetTop
      );
    });
    this.detectChanges();
    return '';
  }

  handleOnAddImageButtonClick(e: any){
    this.showMediaStore('IMAGE', e);
  }

  handleOnClickRemoveItemCarousel(src: string, idx: number){
    this.selectedComp.find(this.slcItem)[idx].remove();
    this.setValue();
    this.handleSetAttrDataIndex(this.slcItem);    
    this.handleSortUpdateBgCarouselItem(this.selectorWrapper, this.listSrc);
    this.detectChanges();
  }

  /**
   * Set attributes data-index item gallery
   * @param element 
   */
  handleSetAttrDataIndex(element: string){
    this.selectedComp.find(element).map((item: any, idx) =>{
      return item.view.el.setAttribute('data-index', idx);
    }); 
    this.detectChanges();
  }

  showMediaStore(mode: 'IMAGE' | 'FILE', e: any) {
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreModalComponent).create(this._injector);
    modalRef.instance.mode = mode;
    modalRef.instance.multiple = true;
    modalRef.instance.zIndex = 2500;
    modalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onSelectedFiles.subscribe((files: any[]) => {
      if (files.length) {
        if(typeof e === 'number'){
          this.handleReplaceImageOnCarousel(files, e);
        }
        else{
          console.log('files=',files);
          this.handleAddImageOnCarousel(files);
        }
      }
      this.detectChanges();
    });
    modalRef.instance.showModal();
    this._domService.addDomToBody(modalRef);
  }
  
  handleAddImageOnCarousel(files: Array<any>){
    console.log('file=', files);
    const arr = files.map((file: any) =>{
      return file.origin_url;
    });
    const updateArr = [...this.listSrc, ...arr];
    this.listSrc = cloneDeep(updateArr);
    arr.forEach( (item: string, idx: number) => {
      const htmlPreview = `<div class="item-carousel"></div>`;
      GLOBAL.compUtil.appendToContainer(htmlPreview, this.selectedComp.find(this.selectorWrapper)[0] );
    });
    this.handleSetAttrDataIndex(this.slcItem);
    this.handleSortUpdateBgCarouselItem(this.selectorWrapper, this.listSrc);
    this.detectChanges();
  }

  handleReplaceImageOnCarousel(files: Array<any>, e: number){
    const arr = [files[0].origin_url];
    this.listSrc.splice(e, 1);
    this.listSrc.splice(e, 0, ...arr);
    this.handleSetAttrDataIndex(this.slcItem);
    this.handleSortUpdateBgCarouselItem(this.selectorWrapper, this.listSrc);
    this.detectChanges();
  }

  handleOnClosePopup(e: any){
    this.onClose.emit({})
  }

  handleUpdateSettingsMedia(e: any){
  }

  handleOnSelectMenuItem(e: any, src: string, idx: number){
    if(e.id === 'remove'){
      this.handleOnClickRemoveItemCarousel(src, idx);
      this.detectChanges();
      return;
    }
    this.showMediaStore('IMAGE', idx);
    this.detectChanges();
  }

  handleOnAngleSliderInputValueChanged(e: any){
    this.widthItem = e;
    this.setStyle(`${e}px`, SIZE_ITEM);
  }

}

function __indexOf(collection: any, node: any) {
  return Array.prototype.indexOf.call(collection, node);
}