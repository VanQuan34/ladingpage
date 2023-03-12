import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

const ROW_GAP = '--row-gap';
const COLUMN_GAP = '--column-gap';
const FLEX_DRT = '--flex-direction';
const NUMBER_IN_ROW = '--number-in-row';
const ON_NUMBER = '--on-number';
const JUSTIFY = '--justify-content';
const WIDTH = '--width';
const FL_WRAP = '--flex-wrap';
const OVERFLOW_X = '--overflow-x';
const OVERFLOW_Y = '--overflow-y';
const DIRECTION = 'direction';
const HEIGHT = 'height';

@Component({
  selector: 'mo-wb-landing-editor-inspector-comps-element-card-repeater',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorElementCardRepeatComponent extends MoLandingEditorInspectorBaseComponent {

  listDirections: Array<any>;
  direction: string;
  onNumber: boolean;
  numberInRow: number;
  gapLR: number = 8;
  gapTB: number = 8;
  listJustify: Array<object>;
  justify: string;

  override onInit() {
    this.listDirections = [
      {
        id: 'row',
        name: 'Trái sang phải'
      },
      {
        id: 'row-reverse',
        name: 'Phải sang trái'
      }
    ];
    this.direction = 'row';
    this.onNumber = false;
    this.numberInRow = 3;
    this.listJustify = [
      {
        id: 'flex-start',
        name: 'Bắt đầu'
      },
      {
        id: 'center',
        name: 'Giữa'
      },
      {
        id: 'flex-end',
        name: 'Kết thúc'
      },
      {
        id: 'space-between',
        name: 'Khoảng cách giữa'
      },
      {
        id: 'space-around',
        name: 'Khoảng cách xung quanh'
      },
    ];
    this.justify = 'flex-start';
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
      this.gapTB = this.getStyle()[ROW_GAP] && parseInt( this.getStyle()[ROW_GAP].replace('px', '') ) || 8 ;
      this.gapLR =  this.getStyle()[COLUMN_GAP] && parseInt(this.getStyle()[COLUMN_GAP].replace('px', '') ) || 8;
      this.direction = (this.getStyle()[FLEX_DRT].trim() === 'column' ) ? 'row' : this.getStyle()[FLEX_DRT] ;
      this.justify = this.getStyle()[JUSTIFY] || 'flex-start';
      this.numberInRow = this.getStyle()[NUMBER_IN_ROW] || 3;
      this.onNumber = JSON.parse(this.getStyle()[ON_NUMBER]) || false;
      this.handleUpdateStyleRepeater();
      this.handleUpdateWidthItemRepeater();
      this.detectChanges();
      this.updateDockingPosInfo();
    }
  }

  handleOnSelectDirectionType(e: any) {
    this.direction = e.id;
    this.setStyle(`${e.id}`, FLEX_DRT);
  }

  handleOnNumberChange(e: any) {
    this.onNumber = !this.onNumber;
    this.setStyle(`${e.active}`, ON_NUMBER)
  }

  /**
   * Update width item in row
   * @param e 
   */
  handleOnChangeValueInRow(e: number) {
    this.numberInRow = e;
    this.setStyle(`${e}`, NUMBER_IN_ROW);
    this.handleUpdateWidthItemRepeater();
    this.updateDockingPosInfo();
  }

  handleUpdateWidthItemRepeater(){
    const math = Math.round(this.gapLR * (this.numberInRow - 1) / this.numberInRow);
    const widthItem = `calc(((${(100 / this.numberInRow).toFixed(2)}% - ((0px + 0px) + ${math}px)) - 1px))`;
    this.setStyle(widthItem, WIDTH);
  }

  /**
   * Change style column-gap item horizontal
   * @param e 
   */
  handleOnChangeDistanceHorizontal(e: number) {
    this.gapLR = e;
    this.setStyle(`${e}px`, COLUMN_GAP);
    this.handleOnChangeValueInRow(this.numberInRow);
    this.updateDockingPosInfo();
  }

  /**
   * Change style row-gap item vertical
   * @param e 
   */
  handleOnChangeDistanceVertical(e: number) {
    this.gapTB = e;
    this.setStyle(`${e}px`, ROW_GAP);
    this.updateDockingPosInfo();
  }

  /**
   * Change style justify-content
   * @param e 
   */
  handleOnChangeJustify(e: any) {
    this.justify = e.id;
    this.setStyle(`${e.id}`, JUSTIFY);
  }
  
  /**
   * Handle update style all change for type card
   */
  handleUpdateStyleRepeater(){
    let updateStyles =  [
      {
        value: this.direction,
        property: FLEX_DRT
      },
      {
        value: 'wrap',
        property: FL_WRAP
      },
      {
        value: 'auto',
        property: HEIGHT
      },
      {
        value: 'ltr',
        property: DIRECTION
      },
      {
        value: 'hidden',
        property: OVERFLOW_X
      },
      {
        value: 'hidden',
        property: OVERFLOW_Y
      }
    ]
    this.setStyles(updateStyles);
  }

}
