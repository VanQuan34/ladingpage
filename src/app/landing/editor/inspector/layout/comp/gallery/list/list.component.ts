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
import { MoLandingEditorInspectorAddVideoComponent } from '../attributes/form/form.component';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-list-of-gallery',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorListOfGalleryComponent extends MoLandingEditorInspectorBaseComponent {

  selectorWrapper: string = '.mo-gallery-item-container';
  slcControlWrapper: string = '.mo-gallery-control';
  slcItemControl: string = '.mo-gallery-control-item';
  slcItemPreview: string = '.gallery-item-preview';
  slcItem: string = '.gallery-item';
  listSrc: Array<string>;
  listSrcPreview: Array<string>;
  urlVideo: string;
  isDragged: boolean = false;
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public target: CdkDropList = null;
  public targetIndex: number;
  public source: CdkDropList = null;
  public sourceIndex: number;
  public activeContainer: any;

  override onInit() {
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
      const totalItem = this.selectedComp.find(this.slcItemPreview).length ;
    if(totalItem  === 0){
      this.listSrc = [];
      this.listSrcPreview =  [];
      return;
    }
    this.listSrc =  GLOBAL.editor.getSelected().find(this.slcControlWrapper)[0].find(this.slcItem).map((item: any, idx: number)=>{
      const ele =  item.view.$el[0];
      const src  = getComputedStyle(ele)['backgroundImage'].match(/url\(["']?([^"']*)["']?\)/)[1];
      return src;  
    });
    this.listSrcPreview =  GLOBAL.editor.getSelected().find(this.selectorWrapper)[0].find(this.slcItem).map((item: any, idx: number)=>{
      const ele =  item.view.$el[0];
      const src  = getComputedStyle(ele)['backgroundImage'].match(/url\(["']?([^"']*)["']?\)/)[1];
      return src;  
    });
    // console.log('this.src=', this.listSrc);
    // console.log('this.srcPreview=', this.listSrcPreview);
    this.detectChanges();
  }
  
  /**
   * Update style background-image for data-index
   * @param selector 
   * @param urls <Array url>
   */
  handleSortUpdateBgGalleryItem(selectorWrapper: string, urls: Array<string>){
    this.selectedComp.find(selectorWrapper)[0].find(this.slcItem).map((item: any, idx: number)=> {
      const idItemControl = `#${this.selectedComp.getId()} ${selectorWrapper} ${this.slcItem}[data-index="${idx}"]`;
      GLOBAL.editor.setStyles(idItemControl, {'background-image': 'url('+urls[idx]+')' }, {fixMedia: true}); // set all media
    });
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    // console.log('event===', event);
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
      this.setValue();
      moveItemInArray(this.listSrc, this.sourceIndex, this.targetIndex);
      const oldArr = [...Array(this.listSrc.length).keys()]
      const newArr = oldArr.splice(this.sourceIndex, 1)[0];
      oldArr.splice(this.targetIndex, 0, newArr);
      const sortedArr = new Array(oldArr.length);

      oldArr.forEach((idx, i) => {
      sortedArr[i] = this.listSrcPreview[idx];
      });
      this.handleSortHtmlByIndex(oldArr, this.selectorWrapper, this.slcItem);
      this.handleSortHtmlByIndex(oldArr, this.slcControlWrapper, this.slcItem);
      this.handleSetAttrDataIndex(this.slcItemPreview); 
      this.handleSetAttrDataIndex(this.slcItemControl); 
      this.handleSortUpdateBgGalleryItem(this.slcControlWrapper, this.listSrc);
      this.handleSortUpdateBgGalleryItem(this.selectorWrapper, sortedArr);
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

  handleOnClickRemoveItemGallery(src: string, idx: number){
    this.selectedComp.find(this.slcItemControl)[idx].remove();
    this.selectedComp.find(this.slcItemPreview)[idx].remove();
    this.setValue();
    this.handleSetAttrDataIndex(this.slcItemControl);
    this.handleSetAttrDataIndex(this.slcItemPreview);    
    this.handleSortUpdateBgGalleryItem(this.slcControlWrapper, this.listSrc);
    this.handleSortUpdateBgGalleryItem(this.selectorWrapper, this.listSrcPreview);
    this.detectChanges();
  }

  handleOnChangeImageGallery(idx: number){
   
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
          this.handleReplaceImageOnGallery(files, e);
        }
        else{
          this.handleAddImageOnGallery(files);
        }
      }
      this.detectChanges();
    });
    modalRef.instance.showModal();
    this._domService.addDomToBody(modalRef);
  }
  
  handleAddImageOnGallery(files: Array<any>){
    console.log('file=', files);
    const arr = files.map((file: any) =>{
      return file.imageThumb;
    });
    const arrPreview = files.map((file: any) =>{
      return file.origin_url;
    })
    const updateArr = [...this.listSrc, ...arr];
    this.listSrc = cloneDeep(updateArr);
    this.listSrcPreview = cloneDeep([...this.listSrcPreview, ...arrPreview]);
    console.log('this.listSrcPreview :', this.listSrcPreview);
    arr.forEach( (item: string, idx: number) => {
      const htmlPreview = `<div id="gl-item-${uid()}" class="gallery-item gallery-item-preview"></div>`;
      const htmlControl = `<div class="mo-gallery-control-item gallery-item"></div>`;
      GLOBAL.compUtil.appendToContainer(htmlPreview, this.selectedComp.find(this.selectorWrapper)[0] );
      GLOBAL.compUtil.appendToContainer(htmlControl, this.selectedComp.find(this.slcControlWrapper)[0] );
    });
    this.handleSetAttrDataIndex(this.slcItemControl);
    this.handleSetAttrDataIndex(this.slcItemPreview);
    this.handleSortUpdateBgGalleryItem(this.slcControlWrapper, this.listSrc);
    this.handleSortUpdateBgGalleryItem(this.selectorWrapper, this.listSrcPreview);
    this.detectChanges();
  }

  handleReplaceImageOnGallery(files: Array<any>, e: number){
    const arr = [files[0].imageThumb];
    this.listSrc.splice(e, 1);
    this.listSrc.splice(e, 0, ...arr);
    this.listSrcPreview.splice(e, 1);
    this.listSrcPreview.splice(e, 0, ...[files[0].origin_url]);
    this.handleSetAttrDataIndex(this.slcItemControl);
    this.handleSetAttrDataIndex(this.slcItemPreview);
    this.handleSortUpdateBgGalleryItem(this.slcControlWrapper, this.listSrc);
    this.handleSortUpdateBgGalleryItem(this.selectorWrapper, this.listSrcPreview);
    this.detectChanges();
  }

  handleOnClickAddVideoItemGallery(idx: number){
    this.showSettingUrlVideo(idx);
  }
  
  showSettingUrlVideo(idx: number){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorAddVideoComponent).create(this._injector);
    popup.instance.index = idx;
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    popup.instance.urlVideo.subscribe((value: string) => {
      this.urlVideo = value;
      const compItem: DomComponent = this.selectedComp.find(this.selectorWrapper)[0].find(this.slcItem)[idx];
      const compControl: DomComponent = this.selectedComp.find(this.slcControlWrapper)[0].find(this.slcItem)[idx];
      if(this.urlVideo === '' || this.urlVideo == null){
        compItem.view.el.classList.remove('gallery-video');
        compItem.view.el.removeAttribute('url');
        compItem.find('svg').length !== 0 && compItem.find('svg')[0].view.el.remove();
        this.detectChanges();
        return;
      }
      const svgIcon = `<svg preserveAspectRatio="xMidYMid meet" data-bbox="10 10 62 62" viewBox="0 0 82 82" height="82" width="82" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-labelledby="svgcid--7ei3d5-yz8rw6">
      <g><path d="M41 10c-17.121 0-31 13.879-31 31 0 17.121 13.879 31 31 31 17.121 0 31-13.879 31-31 0-17.121-13.879-31-31-31zm2.008 35.268l-7.531 4.268V32.465l7.531 4.268L50.539 41l-7.531 4.268z" fill="#2B328C" data-color="1"></path>
      </g>
      </svg>`
      GLOBAL.compUtil.appendToContainer(svgIcon, compItem );
      GLOBAL.compUtil.appendToContainer(svgIcon, compControl );
      compItem.view.el.setAttribute('url', this.urlVideo);
      compItem.view.el.classList.add('gallery-video');
    });
    this._domService.addDomToBody(popup);
    this.detectChanges();
  }

}

function __indexOf(collection: any, node: any) {
  return Array.prototype.indexOf.call(collection, node);
}