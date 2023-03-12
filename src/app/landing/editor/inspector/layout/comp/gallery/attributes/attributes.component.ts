import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { data } from 'jquery';
import { IColorVar } from 'src/app/common/common-types';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { Utils } from 'src/app/utils/utils';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';
interface IPosThumb {
  id: string,
  name: string;
}
const WIDTH_THUMB = '--width-thumb';
const HEIGHT_THUMB = '--height-thumb';
const HEIGHT_GLR = '--height-gallery';
const GAP_THUMB = '--gap-thumb';
const GAP_GLR = '--gap-gallery';
const POSITION = '--position';
const SHOW_THUMB = '--on-thumb';
const ARROW = '--arrow';
const BTN_COLOR = '--btn-color';
const SIZE_ICON = '--size-icon';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-comps-attributes-gallery',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorAttributesGalleryComponent extends MoLandingEditorInspectorBaseComponent {

  autoPlay: boolean;
  timePlay: number;
  onThumb: boolean;
  position: string;
  listPosition: IPosThumb[] = [];
  arrow: string ;
  listArrow: IPosThumb[] = [];
  widthThumb: number;
  heightThumb: number;
  gapGallery: number;
  gapThumb: number;
  sizeIcon: number;
  selectorGallery: string = '.mo-gallery-item-container';
  selectorControl: string = '.mo-gallery-control';
  slideConfig: any;
  fontColor: any;
  colorBtn: string;

  override onInit() {
    this.listPosition = [
      {
        id: 'top',
        name: 'Trên cùng'
      },
      {
        id: 'left',
        name: 'Bên trái'
      },
      {
        id: 'right',
        name: 'Bên phải'
      },
      {
        id: 'bottom',
        name: 'Dưới cùng'
      },
    ];
    this.listArrow = [
      {
        id: 'none',
        name: 'Không chọn'
      },
      {
        id: 'default',
        name: 'Mặc định'
      },
      {
        id: 'custom',
        name: 'Tùy chỉnh'
      },
    ];
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleUpdateStyleGallery);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleUpdateStyleGallery);
  }

  override onAfterViewInit() {
    setTimeout(() => {
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleUpdateStyleGallery);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleUpdateStyleGallery);
  }

  override setValue(): void {
    super.setValue();
    if(this.selectedComp.getAttributes()['mo-type'] === 'gallery'){
      this.autoPlay = JSON.parse(this.selectedComp.view.el.getAttribute('data-autoplay')) || false;
      this.timePlay = parseInt(this.selectedComp.view.el.getAttribute('data-time')) || 5;
      this.onThumb = JSON.parse(this.selectedComp.view.el.getAttribute('data-thumb')) || false;
      this.position = this.selectedComp.view.el.getAttribute('data-position') || 'bottom';
      this.widthThumb =  parseInt( this.getStyle()[WIDTH_THUMB].replace('px', '')) || 120;
      this.heightThumb = parseInt( this.getStyle()[HEIGHT_THUMB].replace('px', '') ) || 90;
      this.gapGallery = parseInt( this.getStyle()[GAP_GLR].replace('px', '') ) || 10;
      this.gapThumb = this.getStyle()[GAP_THUMB] || 10;
      this.arrow = this.getStyle()[ARROW] || 'default';
      this.sizeIcon = parseInt( this.getStyle()[SIZE_ICON].replace('px', '') ) || 40;
      this.slideConfig = {"pageDots": false, "cellSelector" : ".gallery-item" , "asNavFor" : ".mo-gallery-item-container" };
      this.fontColor = this.getStyle()[BTN_COLOR] ? Utils.parseColorVar(this.getStyle()[BTN_COLOR]) : '';
      this.colorBtn = `rgba(${this.fontColor.rgbColor}, ${this.fontColor.alpha})`;
      this.handleUpdateStyleGallery();
      this.detectChanges();
    }
  }

  handleSetTimeAutoPlayGallery(){
    if(!this.autoPlay){
      delete this.slideConfig['autoPlay'];
    }
    else{
     this.slideConfig = {...this.slideConfig, ...{"autoPlay": `${this.timePlay * 1000}`}}
    }
    this.selectedComp.find(this.selectorGallery)[0].view.el.setAttribute('data-flickity', JSON.stringify(this.slideConfig) );
  }

  handleOnChangeAutoplay(e: any){
    this.autoPlay = e.active
    this.selectedComp.view.el.setAttribute('data-autoplay', e.active);
    this.handleSetTimeAutoPlayGallery();
    this.detectChanges();
  }

  handleOnChangeTimeAutoplay(e: any){
    this.timePlay = e;
    this.selectedComp.view.el.setAttribute('data-time', e);
    this.handleSetTimeAutoPlayGallery();
    this.detectChanges();
  }

  handleOnChangeShowThumbnail(e: any){
   this.onThumb = e.active;
   this.selectedComp.view.el.setAttribute('data-thumb', e.active);
   this.handleUpdateStyleGallery();
   this.detectChanges();
  }

  handleOnChangePositionThumbnail(e: any){
    this.position = e.id;
    this.setStyle(e.id, POSITION);
    this.selectedComp.view.el.setAttribute('data-position', this.position);
    this.handleUpdateStyleGallery();
    this.handleOnUpdateHeightGallery();
    this.detectChanges();
  }

  handleOnChangeWidthThumb(e: any){
   this.widthThumb = e;
   this.setStyle(`${e}px`, WIDTH_THUMB);
   this.detectChanges();
  }

  handleOnChangeHeightThumb(e: any){
    this.heightThumb = e;
    this.setStyle(`${e}px`, HEIGHT_THUMB);
    this.handleOnUpdateHeightGallery();
    this.handleUpdateStyleGallery();
    this.detectChanges();
    
  }

  handleOnChangeGapGallery(e: any){
    this.gapGallery = e;
    this.setStyle(`${e}px`, GAP_GLR);
    this.handleOnUpdateHeightGallery();
    this.handleUpdateStyleGallery();
    this.detectChanges();
  }

  handleOnChangeGapThumbnail(e: any){
    this.gapThumb = e;
    this.setStyle(`${e}px`, GAP_THUMB);
    this.detectChanges();
  }

  handleOnChangeSelectArrow(e: any){
   this.arrow = e.id;
   this.setStyle(e.id, ARROW );
   this.detectChanges();
  }

  handleUpdateStyleGallery =  () =>{
    if(this.selectedComp.getAttributes()['mo-type'] !== 'gallery') return ;
    const heightGallery = this.getStyle()['height'];
    if(this.onThumb){
      this.handleOnUpdateHeightGallery();
      this.selectedComp.find(this.selectorControl)[0].view.el.removeAttribute('style');
    }
    else{
      this.setStyle(heightGallery, HEIGHT_GLR);
      this.setStyle(heightGallery, HEIGHT_GLR);
      this.selectedComp.find(this.selectorControl)[0].view.el.style.display = 'none';
    }
    this.detectChanges();
  }
/**
 * Set height for gallery container
*/
  handleOnUpdateHeightGallery() {
    let heightUpdate: number;
    let thumbPos = this.selectedComp.view.el.getAttribute('data-position');
    switch (thumbPos){
      case 'left':
        heightUpdate =  parseInt( this.getStyle()['height'].replace('px', '') );
        break;
      case 'top':
        heightUpdate = parseInt( this.getStyle()['height'].replace('px', '') ) - this.gapGallery - this.heightThumb;
        break;
      case 'bottom':
        heightUpdate = parseInt( this.getStyle()['height'].replace('px', '') ) - this.gapGallery - this.heightThumb;
        break;
      case 'right':
        heightUpdate =  parseInt( this.getStyle()['height'].replace('px', '') );
        break;
      default : heightUpdate = parseInt( this.getStyle()['height'].replace('px', '') ) - this.gapGallery - this.heightThumb;     
    }
    this.setStyle(`${heightUpdate}px`, HEIGHT_GLR);
    this.detectChanges();
  }

  handleOnFontColorChanged(colorVar: IColorVar) {
    this.changeTextColor(colorVar, true);
  }

  handleOnFontColorSelect(colorVar: IColorVar) {
    this.changeTextColor(colorVar);
  }

  handleOnFontColorClosed() {
    this.clearInlineStyles();
  }

  changeTextColor(selectColor: IColorVar, isInline: boolean = false) {
    const value =  `rgba(${selectColor.rgbColor},${selectColor.alpha})`;
    this.fontColor = selectColor;
    this.setStyle(value, '--btn-color');
    this.colorBtn = value;
    this.detectChanges();
  }

   /**
   * clear inline styles
   */
   clearInlineStyles() {
    this.$targetEls.removeAttr('style');
  }

  handleOnClickShowIcon(){
    
  }
  handleOnChangeSizeIcon(size: number){

  }

}
