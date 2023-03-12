import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

const ROW_GAP = '--row-gap';
const COLUMN_GAP = '--column-gap';
const GRID_TPL_COLUMNS = '--gr-tpl-columns';
const GRID_AUTO_ROWS = '--gr-auto-rows';
const ON_BALANCE = '--on-balance';
const MIN_WIDTH = '--min-width';
const MIN_HEIGHT = '--min-height';
const WIDTH = '--width';
const OVERFLOW_X = '--overflow-x';
const OVERFLOW_Y = '--overflow-y';
const DIRECTION = '--direction';
const HEIGHT = 'height';

@Component({
  selector: 'mo-wb-landing-editor-inspector-comps-element-cell-repeater',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorElementCellRepeatComponent extends MoLandingEditorInspectorBaseComponent {

  listDirections: Array<any>;
  selectorItem: string = '.mo-comp-container'
  direction: string;
  gapLR: number ;
  gapTB: number ;
  heightComp: string ;
  minWidth: number = 300;
  minHeight: number = 300;
  onBalance: boolean;
  override onInit() {
    this.listDirections = [
      {
        id: 'ltr',
        name: 'Trái sang phải'
      },
      {
        id: 'rtl',
        name: 'Phải sang trái'
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
      const idItem = this.selectedComp.find(`${this.selectorItem}:first-child`)[0].getId();
      const idAll = idItem.includes('__') && idItem.split('__')[0]; 
      const styles = GLOBAL.editor.getStyles(`[id^="${idAll}__"]`);

      this.gapTB = parseInt( this.getStyle()[ROW_GAP].replace('px', '') ) || 8 ;
      this.gapLR =  parseInt(this.getStyle()[COLUMN_GAP].replace('px', '') ) || 8;
      this.direction = this.getStyle()[DIRECTION] || 'ltr' ;
      this.onBalance = JSON.parse(this.getStyle()[ON_BALANCE]) || false;
      this.minWidth = parseInt( this.getStyle()[MIN_WIDTH].replace('px', '') ) || 300;
      this.minHeight = parseInt( styles['min-height'].replace('px', '') ) || 300;
      this.handleUpdateStyleRepeater();
      this.detectChanges();
      this.updateDockingPosInfo();
      }
  }
  /**
   * change style direction comp
   * @param e 
   */
  handleOnSelectDirectionType(e: any) {
    this.direction = e.id;
    this.setStyle(e.id, 'direction');
    this.setStyle(e.id, DIRECTION);
    this.updateDockingPosInfo();
  }

  /**
   * change style column-gap item horizontal
   * @param e 
   */
  handleOnChangeDistanceHorizontal(e: number) {
    this.gapLR = e;
    this.setStyle(`${e}px`, COLUMN_GAP);
    this.updateDockingPosInfo();
  }

  /**
   * change style row-gap item vertical
   * @param e 
   */
  handleOnChangeDistanceVertical(e: number) {
    this.gapTB = e;
    this.setStyle(`${e}px`, ROW_GAP);
    this.updateDockingPosInfo();
  }

  /**
   * change min-width grid-template-columns
   * @param e 
   */
  handleOnMinWidthChange(e: number){
   this.minWidth  = e;
   this.setStyle(`${e}px`, MIN_WIDTH);
   this.handleUpdateStyleRepeater();
   this.updateDockingPosInfo();
  }
  
  /**
   * change min-height grid-auto-rows
   * @param e 
   */
  handleOnMinHeightChange(e: number){
    this.minHeight  = e;
    this.setStyle(`${e}px`, MIN_HEIGHT);
    this.handleSetMinHeightItem(e);
    this.handleUpdateStyleRepeater();
    this.detectChanges();
    this.updateDockingPosInfo();
  }

  handleOnBalanceChange(e: any){
    this.onBalance = !this.onBalance;
    this.setStyle(`${e.active}`, ON_BALANCE);
    this.handleUpdateStyleRepeater();
  }
  /**
   * Handle update style all change for grid-cell
   */
  handleUpdateStyleRepeater(){
    let updateStyles =  [
      {
        value: '100%',
        property: WIDTH
      },
      {
        value: this.onBalance,
        property: ON_BALANCE
      },
      {
        value: 'auto',
        property: HEIGHT
      },
      {
        value: this.direction,
        property: DIRECTION
      },
      {
        value: 'hidden',
        property: OVERFLOW_X
      },
      {
        value: 'hidden',
        property: OVERFLOW_Y
      },
      {
        value: `repeat(auto-fit, minmax(${this.minWidth}px,1fr))`,
        property: GRID_TPL_COLUMNS
      },
      {
        value: `minmax(${this.minHeight}px, ${this.onBalance ? '1fr' : 'auto'})`,
        property: GRID_AUTO_ROWS
      },
    ]
    this.setStyles(updateStyles);
    this.setStyle(this.direction, 'direction');
  }

  handleSetMinHeightItem(minHeight: number){
    if(this.selectedComp.find(this.selectorItem).length === 0 ) return;
    const idItem = this.selectedComp.find(`${this.selectorItem}:first-child`)[0].getId();
    const idAll = idItem.includes('__') && idItem.split('__')[0]; 
    const styles = GLOBAL.editor.getStyles(`[id^="${idAll}__"]`);
    styles['min-height'] = `${minHeight}px`;
    GLOBAL.editor.setStyles(`[id^="${idAll}__"]`, styles);
  }

}
