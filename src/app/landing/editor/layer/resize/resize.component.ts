
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../base.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { IDockingPos } from 'src/app/utils/dockUtil';
import { EditorConstants } from '../../constants';
import { IBlock } from '../../blocks/blocks.service';

enum RESIZE_POS {
  CL = 'CL',
  TL = 'TL',
  BL = 'BL',
  CT = 'CT',
  CB = 'CB',
  CR = 'CR',
  TR = 'TR',
  BR = 'BR',
  BC = 'BC'
}

interface START_POS {
  mouseX: number,
  mouseY: number,
  left: number,
  top: number,
  width: number,
  height: number
}

@Component({
  selector: 'mo-wb-landing-layer-comp-resize',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerResizeComponent extends MoLandingEditorLayerBaseComponent {
  
  isDrag: boolean;
  frameDoc: Document; 
  resizePos: RESIZE_POS;
  resizeClass: string;
  startPos: START_POS;
  isNotShow: boolean;
  isWidthUpdate: boolean;
  isHeightUpdate: boolean;
  isMoving: boolean;
  isWidthEnable: boolean;
  isHeightEnable: boolean;
  isSection: boolean;
  isHeader: boolean = false;
  isFooter: boolean = false;

  isHoverSection: boolean = false;
  isHoverHeader: boolean = false;
  isHoverFooter: boolean = false;


  movingSize: {
    width: number;
    height: number;
    top: number;
    left: number;
  }

  compHover: DomComponent;
  hoverTop: number;
  hoverLeft: number;
  hoverWidth: number;
  hoverHeight: number;

  override onInit() {
  }

  override onAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SHOW_HOVER_EVENT, this.handleOnShowHover);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_HIDE_HOVER_EVENT, this.handleOnHideHover);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SHOW_HOVER_EVENT, this.handleOnShowHover);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_HIDE_HOVER_EVENT, this.handleOnHideHover);
  }

  override setValue(): void {
    super.setValue();
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      return;
    }
    const attrs = this.selectedComp.getAttributes();
    this.isNotShow = attrs['resizable'] === 'false' ? true : false;
    
    const moType = attrs['mo-type'];
    this.isSection = moType === 'section' ? true : false;
    this.isFooter = moType === 'footer' ? true : false;
    this.isHeader = moType === 'header' ? true : false;

    // set size enable
    const blockData: IBlock = this._blockService.getContentBlock(moType);
    this.isWidthEnable = !this.isSection && !this.isFooter && !this.isHeader && ((blockData && blockData.width.isEnable) || (blockData && blockData.minWidth.isEnable));
    this.isHeightEnable = !this.isSection && !this.isFooter && !this.isHeader && ((blockData && blockData.height.isEnable) || (blockData && blockData.minHeight.isEnable));

    this.setPosition();
    this.detectChanges();
  }

  /**
   * resize start moving
   * @param e: Mouse event
   * @returns 
   */
  moveStart(e: any) {
    if (this.isDrag) {
      return;
    }
    // hide hover
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_HIDE_HOVER_EVENT);

    const elRect = this.selectedComp.view.el.getBoundingClientRect();
    this.startPos = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      left: elRect.left,
      top: elRect.top,
      width: elRect.width,
      height: elRect.height
    }

    GLOBAL.editor.setResizeMoving(true);
    $(document).find('body').addClass(this.resizeClass);
    GLOBAL.editor.getWrapper().view.$el.addClass(this.resizeClass).removeClass('being-dragged');
    
    this.isDrag = true;

    if (this.isSection) {
      this.selectedComp.view.$el.css({
        width: `${this.startPos.width}px`,
        height: `${this.startPos.height}px`
      });
      this.selectedComp.view.$el.addClass('mo-comp-resizing-section');
    } else {
      this.selectedComp.view.$el.css({
        top: `${this.startPos.top}px`,
        left: `${this.startPos.left}px`,
        width: `${this.startPos.width}px`,
        height: `${this.startPos.height}px`
      });
      this.selectedComp.view.$el.addClass('mo-comp-resizing');
    }
    
    this.isMoving = true;
    GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_RESIZE_STARTED_EVENT);
  }

  /**
   * handle resize end
   */
  moveEnd() {
    // reset variable
    this.isDrag = false;
    this.movingSize = null;
    GLOBAL.editor.setResizeMoving(false);
    
    this.updateResizeCompStyle();

    // off events
    $(document).off('mousemove', this.handleOnMousemove);
    $(document).off('mouseup', this.handleOnMouseup);
    $(this.frameDoc).off('mousemove', this.handleOnFrameMousemove);
    $(this.frameDoc).off('mouseup', this.handleOnMouseup);
    
    // remove cursor class
    $(document).find('body').removeClass(this.resizeClass);
    GLOBAL.editor.getWrapper().view.$el.removeClass(this.resizeClass);

    // remove inline style
    this.selectedComp.view.$el.removeClass('mo-comp-resizing');
    this.selectedComp.view.$el.removeClass('mo-comp-resizing-section');
    this.selectedComp.view.$el.removeAttr('style');

    GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_RESIZE_ENDED_EVENT);
  }

  /**
   * update comp style after resized
   */
  updateResizeCompStyle() {
    const id = GLOBAL.compUtil.getStyleCompId(this.selectedComp);
    let styles = GLOBAL.editor.getStyles(id);
    
    // update width
    if (this.isWidthUpdate) {
      this.updateWidthStyle(styles);
    }

    // update height
    if (this.isHeightUpdate) {
      this.updateHeightStyle(styles);
    }
    let dockingPos: IDockingPos;
    if (!this.isSection) {
      const container = GLOBAL.compUtil.getContainer(this.selectedComp);
      const compRect = this.selectedComp.view.el.getBoundingClientRect();
      const gridArea = GLOBAL.grid.getGridArea(compRect, container);

      dockingPos = GLOBAL.dock.calcDockingPosInfo(this.selectedComp, gridArea);
      if (dockingPos) {
        styles = {...styles, ...{
          'align-self': dockingPos.alignSelf,
          'justify-self': dockingPos.justifySelf,
          'margin-left': `${dockingPos['ml']}${dockingPos.mUnit.ml}`,
          'margin-right': `${dockingPos['mr']}${dockingPos.mUnit.mr}`,
          'margin-top': `${dockingPos['mt']}${dockingPos.mUnit.mt}`,
          'margin-bottom': `${dockingPos['mb']}${dockingPos.mUnit.mb}`,
          'grid-row-start': `${dockingPos.area.startRow}`,
          'grid-row-end': `${dockingPos.area.endRow}`,
          'grid-column-start': `${dockingPos.area.startCol}`,
          'grid-column-end': `${dockingPos.area.endCol}`,
        }};
      }
    }
    // set styles
    GLOBAL.editor.setStyles(id, styles);
    // comp selected updated
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT, dockingPos);
    if (dockingPos) {
      // comp docking updated
      GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_DOCKING_CHANGED_EVENT, dockingPos);
    }
  }

  /**
   * update width style
   * @param styles 
   */
  updateWidthStyle(styles: any) {
    const minWidth = styles['min-width'];
    const minWidthUnit = GLOBAL.unit.parseUnit(minWidth);
    const width = styles['width'];
    const widthUnit = GLOBAL.unit.parseUnit(width);
    const justifySelf = styles['justify-self'];
    
    if (justifySelf === 'stretch') {
      return;
    }
    
    if ((!widthUnit || widthUnit === 'auto') && minWidth && minWidthUnit) {
      const minWidthValue = GLOBAL.unit.getSizeByUnit(this.selectedComp, minWidthUnit);
      styles['min-width'] = `${minWidthValue}${minWidthUnit}`;
      return;
    }

    const widthValue = GLOBAL.unit.getSizeByUnit(this.selectedComp, widthUnit);
    styles['width'] = `${widthValue}${widthUnit}`;
    if (!minWidth || !minWidthUnit) {
      return;
    }
    // console.log('widthValue= ', widthValue, ' widthUnit=', widthUnit);
    const minWidthValue = GLOBAL.unit.getSizeByUnit(this.selectedComp, minWidthUnit);
    if (minWidthValue < minWidth) {
      styles['min-width'] = `${minWidthValue}${minWidthUnit}`;
    }
  }

  /**
   * update height style
   * @param styles 
   * @returns 
   */
  updateHeightStyle(styles: any) {
    const minHeight = styles['min-height'];
    const minHeighUnit = GLOBAL.unit.parseUnit(minHeight);
    const height = styles['height'];
    const heightUnit = GLOBAL.unit.parseUnit(height);
    const alignSelf = styles['align-self'];
    
    if (alignSelf === 'stretch') {
      return;
    }
    
    if ((!heightUnit || heightUnit === 'auto') && minHeight && minHeighUnit) {
      const minHeightValue = GLOBAL.unit.getSizeByUnit(this.selectedComp, minHeighUnit, false);
      styles['min-height'] = `${minHeightValue}${minHeighUnit}`;
      return;
    }
    const heightValue = GLOBAL.unit.getSizeByUnit(this.selectedComp, heightUnit, false);
      styles['height'] = `${heightValue}${heightUnit}`;
    if (!minHeight || !minHeighUnit) {
      return;
    }

    const minHeightValue = GLOBAL.unit.getSizeByUnit(this.selectedComp, minHeighUnit, false);
    if (minHeightValue < minHeight) {
      styles['min-height'] = `${minHeightValue}${minHeighUnit}`;
    }
  }

  /**
   * resize center right pos
   * @param e 
   */
  resizeCenterRight(e: any) {
    const width = e.clientX - this.startPos.mouseX + this.startPos.width;
    this.selectedComp.view.$el.css({
      width: `${width}px`,
      'min-width': 'auto',
      'max-width': 'auto',
    });
  }

  /**
   * resize center left pos
   * @param e 
   */
  resizeCenterLeft(e: any) {
    const left = e.clientX - this.startPos.mouseX + this.startPos.left;
    const width = this.startPos.width + this.startPos.left - left;
    this.selectedComp.view.$el.css({
      width: `${width}px`,
      left: `${left}px`,
      'min-width': 'auto',
      'max-width': 'auto',

    });
  }

  /**
   * resize center top
   * @param e 
   */
  resizeCenterTop(e: any) {
    const top = e.clientY - this.startPos.mouseY + this.startPos.top;
    const height = this.startPos.height + this.startPos.top - top;
    this.selectedComp.view.$el.css({
      height: `${height}px`,
      top: `${top}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * resize center bottom
   * @param e 
   */
  resizeCenterBottom(e: any) {
    const height = e.clientY - this.startPos.mouseY + this.startPos.height;
    this.selectedComp.view.$el.css({
      height: `${height}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * resize top left 
   * @param e 
   */
  resizeTopLeft(e: any) {
    const top = e.clientY - this.startPos.mouseY + this.startPos.top;
    const height = this.startPos.height + this.startPos.top - top;
    const left = e.clientX - this.startPos.mouseX + this.startPos.left;
    const width = this.startPos.width + this.startPos.left - left;

    this.selectedComp.view.$el.css({
      height: `${height}px`,
      top: `${top}px`,
      width: `${width}px`,
      left: `${left}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * resize top right 
   * @param e 
   */
  resizeTopRight(e: any) {
    const top = e.clientY - this.startPos.mouseY + this.startPos.top;
    const height = this.startPos.height + this.startPos.top - top;
    const width =  e.clientX - this.startPos.mouseX + this.startPos.width;

    this.selectedComp.view.$el.css({
      height: `${height}px`,
      top: `${top}px`,
      width: `${width}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * resize bottom left
   * @param e 
   */
  resizeBottomLeft(e: any) {
    // const top = e.clientY - this.startPos.mouseY + this.startPos.top;
    const height = e.clientY - this.startPos.mouseY +  this.startPos.height;
    const left = e.clientX - this.startPos.mouseX + this.startPos.left;
    const width = this.startPos.width + this.startPos.left - left;

    this.selectedComp.view.$el.css({
      height: `${height}px`,
      width: `${width}px`,
      left: `${left}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * resize bottom right 
   * @param e 
   */
  resizeBottomRight(e: any) {
    const height = e.clientY - this.startPos.mouseY + this.startPos.height;
    const width =  e.clientX - this.startPos.mouseX + this.startPos.width;

    this.selectedComp.view.$el.css({
      height: `${height}px`,
      width: `${width}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * resize center bottom
   * @param e 
   */
  resizeBottomCenter(e: any) {
    const height = e.clientY - this.startPos.mouseY + this.startPos.height;
    this.selectedComp.view.$el.css({
      height: `${height}px`,
      'min-height': 'auto',
      'max-height': 'auto'
    });
  }

  /**
   * set hover position
   */
  setHoverPosition() {
    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.compHover.view.el.getBoundingClientRect();

    this.hoverTop = editorRect.top + rect.top;
    this.hoverLeft = editorRect.left + rect.left;
    this.hoverWidth = rect.width;
    this.hoverHeight = rect.height;

    this.detectChanges();
  }

  /**
   * handle resize element mousedown
   * @param e 
   * @param resizePos 
   * @param resizeClass 
   */
  handleOnMousedown(e: any, resizePos: any, resizeClass: string) {
    this.resizeClass = resizeClass;
    switch(resizePos) { 
      case RESIZE_POS.BL:
        console.log('resizePos bl');
        this.resizePos = RESIZE_POS.BL;
        this.isWidthUpdate = true;
        this.isHeightUpdate = true;
        break;
      case RESIZE_POS.BR:
        console.log('resizePos br');
        this.resizePos = RESIZE_POS.BR;
        this.isWidthUpdate = true;
        this.isHeightUpdate = true;
        break;
      case RESIZE_POS.CB:
        console.log('resizePos CB');
        this.resizePos = RESIZE_POS.CB;
        this.isWidthUpdate = false;
        this.isHeightUpdate = true;
        break;
      case RESIZE_POS.BC:
        console.log('resizePos BC');
        this.resizePos = RESIZE_POS.BC;
        this.isWidthUpdate = false;
        this.isHeightUpdate = true;
        break;
      case RESIZE_POS.CL:
        console.log('resizePos cl');
        this.resizePos = RESIZE_POS.CL;
        this.isWidthUpdate = true;
        this.isHeightUpdate = false;
        break;
      case RESIZE_POS.CR:
        console.log('resizePos cr');
        this.resizePos = RESIZE_POS.CR;
        this.isWidthUpdate = true;
        this.isHeightUpdate = false;
        break;
      case RESIZE_POS.CT:
        console.log('resizePos ct');
        this.resizePos = RESIZE_POS.CT;
        this.isWidthUpdate = false;
        this.isHeightUpdate = true;
        break;
      case RESIZE_POS.TL:
        console.log('resizePos tl');
        this.resizePos = RESIZE_POS.TL;
        this.isWidthUpdate = true;
        this.isHeightUpdate = true;
        break;
      case RESIZE_POS.TR:
        console.log('resizePos tr');
        this.resizePos = RESIZE_POS.TR;
        this.isWidthUpdate = true;
        this.isHeightUpdate = true;
        break;
      default:
        break;
    }

    this.isDrag = false;
    this.frameDoc = GLOBAL.editor.getDocument();

    $(document).off('mousemove', this.handleOnMousemove);
    $(document).off('mouseup', this.handleOnMouseup);
    $(this.frameDoc).off('mousemove', this.handleOnFrameMousemove);
    $(this.frameDoc).off('mouseup', this.handleOnMouseup);

    $(document).on('mousemove', this.handleOnMousemove);
    $(document).on('mouseup', this.handleOnMouseup);
    $(this.frameDoc).on('mousemove', this.handleOnFrameMousemove);
    $(this.frameDoc).on('mouseup', this.handleOnMouseup);
  }

  /**
   * handle on mousedown
   * @param e 
   */
  handleOnMousemove = (e: any) => {
    // start moving
    this.moveStart(e);

    switch(this.resizePos) { 
      case RESIZE_POS.BL:
        this.resizeBottomLeft(e);
        break;
      case RESIZE_POS.BR:
        this.resizeBottomRight(e);
        break;
      case RESIZE_POS.CB:
        this.resizeCenterBottom(e);
        break;
      case RESIZE_POS.CL:
        this.resizeCenterLeft(e);
        break;
      case RESIZE_POS.CR:
        this.resizeCenterRight(e);
        break;
      case RESIZE_POS.CT:
        this.resizeCenterTop(e);
        break;
      case RESIZE_POS.TL:
        this.resizeTopLeft(e);
        break;
      case RESIZE_POS.TR:
        this.resizeTopRight(e);
        break;
      case RESIZE_POS.BC:
        this.resizeBottomCenter(e);
        break;
      default:
        break;
    }

    const selectedRect = this.selectedComp.view.el.getBoundingClientRect();
    this.movingSize = {
      width: Math.round(selectedRect.width),
      height: Math.round(selectedRect.height),
      top: e.clientY + 5,
      left: e.clientX + 5,
    };
    this.detectChanges();
  }
  /**
   * handle mouseup event
   * @param e 
   */
  handleOnMouseup = (e: any) => {
    this.moveEnd();
  }

  /**
   * handle iframe mousemove event
   * @param e 
   */
  handleOnFrameMousemove = (e: any) => {
    const frameRect = GLOBAL.editor.getFrameEl().getBoundingClientRect();
    const event: any = {};
    event.clientX = frameRect.left + e.clientX;
    event.clientY = frameRect.top + e.clientY;
    
    this.handleOnMousemove(event);
  }

  handleOnShowHover = (compHover: DomComponent) => {
    this.compHover = compHover;
    if(!compHover) {
      this.detectChanges();
      return;
    }
    const moType = this.compHover.getAttributes()['mo-type'];
    this.isHoverSection = moType === 'section' ? true : false;
    this.isHoverFooter = moType === 'footer' ? true : false;
    this.isHoverHeader = moType === 'header' ? true : false;

    if (!this.isHoverSection && !this.isHoverSection && !this.isHoverHeader) {
      this.compHover = null;
      this.detectChanges();
      return;
    }
    this.setHoverPosition();
  }

  handleOnHideHover = () => {
    this.compHover = null;
    this.detectChanges()
  }

  handleOnResizeHoverMousedown(e: any, resizePos: any, resizeClass: string) {
    if (!this.compHover) {
      this.detectChanges();
      return;
    }
    GLOBAL.editor.select(this.compHover);
    this.selectedComp = GLOBAL.editor.getSelected();
    this.handleOnMousedown(e, resizePos, resizeClass);

    this.compHover = null;
    this.detectChanges();
  }

}
