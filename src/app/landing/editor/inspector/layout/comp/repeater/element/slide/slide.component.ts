import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

const ROW_GAP = '--row-gap';
const COLUMN_GAP = '--column-gap';
const ON_SCROLL = '--on-scroll';
const FLEX_DRT = '--flex-direction';
const FL_DRT_SLIDE = '--fl-direction-slide';
const WIDTH = '--width';
const FL_WRAP = '--flex-wrap';
const OVERFLOW_X = '--overflow-x';
const OVERFLOW_Y = '--overflow-y';
const selectorScrollBar = '.mo-repeater-item-container::-webkit-scrollbar';
const selectorContainer = '.mo-repeater-item-container';
const HEIGHT = 'height';
const DIRECTION = 'direction';
const SCROLL_WIDTH = '--scrollbar-width';

@Component({
  selector: 'mo-wb-landing-editor-inspector-comps-element-slide-repeater',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorElementSlideRepeatComponent extends MoLandingEditorInspectorBaseComponent {
  
  selectorItem: string = '.mo-comp-container';
  listDirections: Array<any>;
  direction: string;
  gapLR: number ;
  gapTB: number ;
  onScroll: boolean = false;
  heightComp: string ;
  scrollbar: string;
  override onInit() {
    this.listDirections = [
      {
        id: 'row',
        name: 'Trái sang phải'
      },
      {
        id: 'column',
        name: 'Trên xuống dưới'
      }
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
    if (this.selectedComp.getAttributes()['mo-type'] === 'repeater') {
      this.gapTB = parseInt( this.getStyle()[ROW_GAP].replace('px', '') ) || 8 ;
      this.gapLR =  parseInt(this.getStyle()[COLUMN_GAP].replace('px', '') ) || 8;
      this.onScroll = JSON.parse(this.getStyle()[ON_SCROLL]) || false;
      this.direction = this.getStyle()[FL_DRT_SLIDE].trim() ;
      this.handleSetHeightCompRepeater();
      this.handleOnChangeStyleRepeater();
      this.detectChanges();
      this.updateDockingPosInfo();
      }
  }

  handleOnSelectDirectionType(e: any) {
    this.direction = e.id;
    switch(this.direction){
      case 'column':
        this.setStyle('100%', WIDTH);
      break;
      default: ; 
    }
    this.handleOnChangeStyleRepeater();
    this.updateDockingPosInfo();
  }

  /**
   * change style column-gap item horizontal
   * @param e 
   */
  handleOnChangeDistanceHorizontal(e: number) {
    this.gapLR = e;
    this.setStyle(`${e}px`, COLUMN_GAP);
  }

  /**
   * change style row-gap item vertical
   * @param e 
   */
  handleOnChangeDistanceVertical(e: number) {
    this.gapTB = e;
    this.setStyle(`${e}px`, ROW_GAP);
  }

  handleOnScrollChange(e: any){
    this.onScroll = !this.onScroll;
    this.setStyle(`${e.active}`, ON_SCROLL);
    this.handleOnChangeStyleRepeater();
    this.updateDockingPosInfo();
  }

  /**
   * Handle update style all change for slide type
   */
  handleOnChangeStyleRepeater() {
    this.setStyle(this.direction, FLEX_DRT);
    this.setStyle(this.direction, FL_DRT_SLIDE);
    this.setStyle('nowrap', FL_WRAP);
    this.setStyle('ltr', DIRECTION);

    const styleBar = !this.onScroll ? GLOBAL.editor.setStyles(`#${this.selectedComp.getId()} ${selectorScrollBar}`, {'display': 'none'}) : 
    GLOBAL.editor.setStyles(`#${this.selectedComp.getId()} ${selectorScrollBar}`, {'display': 'block'});
    const scrollBarWidth = !this.onScroll ? this.setStyle('none', SCROLL_WIDTH) : this.setStyle('auto', SCROLL_WIDTH);
    switch (this.direction){
      case 'row':
        this.setStyle('hidden', OVERFLOW_Y);
        this.setStyle('scroll', OVERFLOW_X);
        break;
      case 'column':
        this.setStyle('hidden', OVERFLOW_X);
        this.setStyle('scroll', OVERFLOW_Y);
        break;
      default : ;  
    }
    this.updateDockingPosInfo();
  }

  /**
   * Set height comp for scroll
   */
  handleSetHeightCompRepeater(){
      const selectorItem = this.selectedComp.find(`${this.selectorItem}:first-child`)[0];
      const idItem = `[id^="${selectorItem.getId().split('__')[0]}__"]`;
      const height = GLOBAL.editor.getStyles(idItem)['min-height'] || 'auto';
      this.setStyle(height, HEIGHT);
  }
}
