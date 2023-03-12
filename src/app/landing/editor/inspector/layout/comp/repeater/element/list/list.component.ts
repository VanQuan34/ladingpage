import { style } from '@angular/animations';
import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

const FLEX_DRT = '--flex-direction';
const WIDTH = '--width';
const ROW_GAP = '--row-gap';
const DIRECTION = 'direction';
const HEIGHT = 'height';
const OVERFLOW_X = '--overflow-x';
const OVERFLOW_Y = '--overflow-y';

@Component({
  selector: 'mo-wb-landing-editor-inspector-comps-element-list-repeater',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorElementListRepeatComponent extends MoLandingEditorInspectorBaseComponent {

  gapTB: number ;

  override onInit() {
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
    if(this.selectedComp.getAttributes()['mo-type'] === 'repeater'){
      this.gapTB = parseInt( this.getStyle()[ROW_GAP].replace('px', '') ) || 8 ;
      this.handleUpdateStyleRepeater();
      this.detectChanges();
      this.updateDockingPosInfo();
    } 
  }

  /**
   * change style row-gap item repeater
   * @param e 
   */
  handleOnChangeDistanceVertical(e: number){
    this.gapTB = e;
    this.setStyle(`${e}px`, ROW_GAP );
    this.handleUpdateStyleRepeater(); 
  }

  /**
   * Handle update style all change for list type
   */
  handleUpdateStyleRepeater(){
    let updateStyles =  [
      {
        value: 'column',
        property: FLEX_DRT
      },
      {
        value: '100%',
        property: WIDTH
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
