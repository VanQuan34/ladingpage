
import {
  Component, ChangeDetectionStrategy,
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../base.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { INearestHozPos, INearestVertPos } from 'src/app/utils/nearestUtil';
import { EditorConstants } from '../../constants';

@Component({
  selector: 'mo-wb-landing-editor-layer-nearest_line',
  templateUrl: './nearest_line.component.html',
  styleUrls: ['./nearest_line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerNearestLineComponent extends MoLandingEditorLayerBaseComponent {
  
  isShowing: boolean = false;
  isVertShowing: boolean = false;
  isHozShowing: boolean = false;
  vertLine: {
    top: string;
    left: string;
    height: string;
  } = {
    top: '0px',
    left: '0px',
    height: '0px'
  };
  hozLine: {
    top: string;
    left: string;
    width: string;
  } = {
    top: '0px',
    left: '0px',
    width: '0px'
  };

  override ngOnInit() {
  }

  override onAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_NEAREST_SHOW_EVENT, this.handleOnCompNearestShow);
  }

  override onDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_NEAREST_SHOW_EVENT, this.handleOnCompNearestShow);
  }

  override setValue(): void {
    super.setValue();
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      this.isOpen = false;
      this.detectChanges(); 
      return;
    }
    this.isOpen = true;
    GLOBAL.allNearestPos = GLOBAL.nearestUtil.getAllNearestPos();
    this.setPosition();
  }

  /**
   * show nearest vertical line
   * @param nearestHoz 
   * @param selectedRect 
   * @returns 
   */
  showNearestVerticalLine(nearestHoz: INearestHozPos, selectedRect: DOMRect) {
    if (!nearestHoz) {
      this.isVertShowing = false;
      this.detectChanges();
      return;
    };
    this.isVertShowing = true;
    const canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
    const x = selectedRect.x;
    const y = selectedRect.y;
    const width = selectedRect.width;
    const height = selectedRect.height;
    const yPos = [];
    let left = 0;
    const startPos = {
      x: 0,
      y: 0
    };
  
    const endPos = {
      x: 0,
      y: 0
    }
    // if is center pos
    if (nearestHoz.posType === 'center') {
      left = x + width / 2;
    }
    // if is start pos
    if (nearestHoz.posType === 'start') {
      left = x;
    }
    // if is end pos
    if (nearestHoz.posType === 'end') {
      left = x + width;
    }
  
    yPos.push(y );
    yPos.push(y + height);
    for (let i=0; i < nearestHoz.posObjs.length; i++) {
      const rect = nearestHoz.posObjs[i].rect
      yPos.push(rect.y);
      yPos.push(rect.y + rect.height);
    }
    // console.log('posType=', posType, ' yPos=', yPos);
    yPos.sort(function(a, b){return a - b});
  
    startPos.x = left;
    startPos.y = yPos[0];
  
    endPos.x = left;
    endPos.y = yPos[yPos.length - 1]; 

    //console.log('showNearestVerticalLine scrollTop=', scrollTop, ' scrollLeft=', scrollLeft);
    this.vertLine= {
      top: `${startPos.y + canvasRect.top}px`,
      left: `${left + canvasRect.left}px`,
      height: `${endPos.y - startPos.y}px`
    };

    this.detectChanges();
  }

  showNearestHozLine(nearestVert: INearestVertPos, selectedRect: DOMRect) {
    if (!nearestVert) {
      this.isHozShowing = false;
      this.detectChanges();
      return;
    };
    this.isHozShowing = true;
    const canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
    const x = selectedRect.x ;
    const y = selectedRect.y ;
    const width = selectedRect.width;
    const height = selectedRect.height;
    const xPos = [];
    let top = 0;
    const startPos = {
      x: 0,
      y: 0
    };
  
    const endPos = {
      x: 0,
      y: 0
    }
    // if is center pos
    if (nearestVert.posType === 'center') {
      top = y + height / 2;
    }
    // if is start pos
    if (nearestVert.posType === 'start') {
      top = y;
    }
    // if is end pos
    if (nearestVert.posType === 'end') {
      top = y + height;
    }
  
    xPos.push(x);
    xPos.push(x + width);
    for (let i=0; i < nearestVert.posObjs.length; i++) {
      const rect = nearestVert.posObjs[i].rect
      xPos.push(rect.x);
      xPos.push(rect.x + rect.width);
    }
    //console.log('posType=', posType, ' xPos=', xPos);
    xPos.sort(function(a, b){return a - b});
  
    startPos.x = xPos[0];
    startPos.y = top;
  
    endPos.x = xPos[xPos.length - 1];
    endPos.y = top;
    // console.log('showNearestHozLine scrollTop=', scrollTop, ' scrollLeft=', scrollLeft);
    this.hozLine = {
      top: `${top + canvasRect.top}px`,
      left: `${startPos.x + canvasRect.left}px`,
      width: `${endPos.x - startPos.x}px`
    }

    this.detectChanges();
  }

  override handleOnCompMoveStarted = (e: any) => {
    this.detectChanges();
  }

  override handleOnCompMoveEnded = (e: any) => {
    this.isShowing = false;
    this.detectChanges();
  }

  handleOnCompNearestShow = (nearestHor: INearestHozPos, nearestVert: INearestVertPos, selectedRect: DOMRect) => {
    this.isShowing = true;
    this.showNearestVerticalLine(nearestHor, selectedRect);
    this.showNearestHozLine(nearestVert, selectedRect);
  }

  override handleOnFrameScrollEnd = () => {
    GLOBAL.allNearestPos = GLOBAL.nearestUtil.getAllNearestPos();
  }

}
