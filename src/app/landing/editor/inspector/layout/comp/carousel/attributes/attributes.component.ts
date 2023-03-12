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
const WIDTH_ITEM = '--width';
const HEIGHT_ITEM = '--height';
const GAP = '--column-gap';
const ARROW = '--arrow';
const BTN_COLOR = '--btn-color';
const SIZE_ICON = '--size-icon';
const ON_DOTS = '--on-dots';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-comps-attributes-carousel',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorAttributesCarouselComponent extends MoLandingEditorInspectorBaseComponent {

  autoPlay: boolean;
  timePlay: number;
  arrow: string ;
  listArrow: IPosThumb[] = [];
  widthImage: number;
  heightImage: number;
  gapItem: number;
  sizeIcon: number;
  carouselWrapper: string = '.mo-carousel-container';
  slideConfig: any;
  fontColor: any;
  colorBtn: string;
  onDots: boolean;

  override onInit() {
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
  }

  override onAfterViewInit() {
    setTimeout(() => {
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
  }

  override setValue(): void {
    super.setValue();
    if(this.selectedComp.getAttributes()['mo-type'] !== 'carousel') return;
      this.autoPlay = JSON.parse(this.selectedComp.view.el.getAttribute('data-autoplay')) || false;
      this.timePlay = parseInt(this.selectedComp.view.el.getAttribute('data-time')) || 5;
      this.widthImage =  parseInt( this.getStyle()[WIDTH_ITEM].replace('px', '')) || 170;
      this.heightImage = parseInt( this.getStyle()[HEIGHT_ITEM].replace('px', '') ) || 170;
      this.gapItem = this.getStyle()[GAP] || 10;
      this.arrow = this.getStyle()[ARROW] || 'default';
      this.sizeIcon = parseInt( this.getStyle()[SIZE_ICON].replace('px', '') ) || 40;
      this.onDots = JSON.parse(this.selectedComp.view.el.getAttribute('data-dots')) || false;
      this.slideConfig = {"groupCells": true, "contain": true , "fullscreen": true};
      this.fontColor = this.getStyle()[BTN_COLOR] ? Utils.parseColorVar(this.getStyle()[BTN_COLOR]) : '';
      this.colorBtn = `rgba(${this.fontColor.rgbColor}, ${this.fontColor.alpha})`;
      this.detectChanges();
      this.updateDockingPosInfo();
  }

  handleSetTimeAutoPlayCarousel(){
    if(!this.autoPlay){
      delete this.slideConfig['autoPlay'];
    }
    else{
     this.slideConfig = {...this.slideConfig, ...{"autoPlay": `${this.timePlay * 1000}`}}
    }
    this.selectedComp.find(this.carouselWrapper)[0].view.el.setAttribute('data-flickity', JSON.stringify(this.slideConfig) );
  }

  handleOnChangeAutoplay(e: any){
    this.autoPlay = e.active
    this.selectedComp.view.el.setAttribute('data-autoplay', e.active);
    this.handleSetTimeAutoPlayCarousel();
    this.detectChanges();
  }

  handleOnChangeTimeAutoplay(e: any){
    this.timePlay = e;
    this.selectedComp.view.el.setAttribute('data-time', e);
    this.handleSetTimeAutoPlayCarousel();
    this.detectChanges();
  }

  handleOnChangeWidthImage(e: any){
   this.widthImage = e;
   this.setStyle(`${e}px`, WIDTH_ITEM);
   this.detectChanges();
  }

  handleOnChangeHeightImage(e: any){
    this.heightImage = e;
    this.setStyle(`${e}px`, HEIGHT_ITEM);
    this.detectChanges();
    this.updateDockingPosInfo();
    
  }

  handleOnChangeGapItem(e: any){
    this.gapItem = e;
    this.setStyle(`${e}px`, GAP);
    this.detectChanges();
  }

  handleOnChangeSelectArrow(e: any){
   this.arrow = e.id;
   this.setStyle(e.id, ARROW );
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

  handleOnChangeShowDots(e: any){
   this.onDots = e.active;
   this.selectedComp.view.el.setAttribute('data-dots', e.active);
   this.slideConfig = {...this.slideConfig, ...{"pageDots": e.active}}
   this.selectedComp.find(this.carouselWrapper)[0].view.el.setAttribute('data-flickity', JSON.stringify(this.slideConfig) );
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
