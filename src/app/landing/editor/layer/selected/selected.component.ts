
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../base.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { EditorConstants } from '../../constants';
import { MoSectionBlock } from '../../blocks/section/section';

@Component({
  selector: 'mo-wb-landing-editor-layer-selected',
  templateUrl: './selected.component.html',
  styleUrls: ['./selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerSelectedComponent extends MoLandingEditorLayerBaseComponent {
  
  isContainer: boolean;
  
  isMoving: boolean = false;
  isSection: boolean = false;
  isHeader: boolean = false;
  isFooter: boolean = false;
  isEmptySection: boolean = false;

  compHover: DomComponent;
  hoverTop: number;
  hoverLeft: number;
  hoverWidth: number;
  hoverHeight: number;
  isHoverTop: boolean;
  isHoverBottom: boolean;

  isHoverSection: boolean = false;
  isHoverHeader: boolean = false;
  isHoverFooter: boolean = false;

  override ngOnInit() {
  } 

  override onAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SHOW_HOVER_EVENT, this.handleOnShowHover);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_HIDE_HOVER_EVENT, this.handleOnHideHover);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SHOW_HOVER_EVENT, this.handleOnShowHover);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_HIDE_HOVER_EVENT, this.handleOnHideHover);
  }

  override setValue(): void {
    super.setValue();
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      return;
    }
    // set type
    this.setType();
    // set position
    this.setPosition();
   
  }

  /**
   * set type
   */
  setType() {
    const moType = this.selectedComp.getAttributes()['mo-type'];
    this.isContainer = moType === 'container' || this.selectedComp.hasClass('mo-comp-container') ? true : false;
    this.isSection = moType === 'section' ? true : false;
    this.isFooter = moType === 'footer' ? true : false;
    this.isHeader = moType  === 'header' ? true : false;
    this.isContainer = this.isContainer && !this.isSection && !this.isFooter && !this.isHeader ? true : false;

    this.isEmptySection = moType === 'section' && GLOBAL.compUtil.checkCompIsEmpty(this.selectedComp) ? true : false;
  }

  /**
   * insert new section at index
   * @param index 
   */
  insertNewSectionAtIndex(index: number) {
    const sectionBlock = MoSectionBlock.getBlock();
    const page = GLOBAL.editor.getWrapper().find('.mo-page')[0];
    const htmlStr = GLOBAL.compUtil.convertCompHtml(sectionBlock.content, page);
    const comps: DomComponent[] = GLOBAL.compUtil.appendToContainer(htmlStr, page, {at: index});
    GLOBAL.editor.select(comps[0]);
  }

  /**
   * set hover position
   */
  setHoverPosition() {
    if (!this.compHover) {
      return;
    }
    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.compHover.view.el.getBoundingClientRect();

    this.hoverTop = editorRect.top + rect.top;
    this.hoverLeft = editorRect.left + rect.left;
    this.hoverWidth = rect.width;
    this.hoverHeight = rect.height;

    this.selectedComp = GLOBAL.editor.getSelected();
    const compIndex = (this.selectedComp && this.selectedComp.getIndex()) || 0;
    const hoverIndex = (this.compHover && this.compHover.getIndex()) || 0 ;

    this.isHoverTop = (this.isHoverSection || this.isHoverFooter) && (hoverIndex !== (compIndex + 1));
    this.isHoverBottom = (this.isHoverSection || this.isHoverHeader) && (hoverIndex !== (compIndex - 1));

    this.detectChanges();
  }

  handleOnCompMoving = () => {
    this.isMoving = true;
    this.setPosition();
    this.detectChanges();
  }

  override handleOnCompMoveStarted = (e: any) => {
    this.isOpen = false;
    GLOBAL.compUtil.appendTempComp(this.selectedComp);
    this.detectChanges();
  }

  override handleOnCompMoveEnded = (e: any) => {
    this.isOpen = true;
    this.isMoving = false;
    this.setPosition();

    GLOBAL.compUtil.removeTempElement();
    this.detectChanges();
  }

  handleOnAddElementClick(e: any) {
    GLOBAL.editor.getModel().trigger(EditorConstants.OPEN_ADD_NEW_ELEMENT_EVENT);
  }
  /**
   * handle add top section
   * @param event 
   */
  handleOnAddTopClick(event: any) {
    const compIndex = this.selectedComp.getIndex();
    let insertIndex = compIndex ;
    // console.log('handleOnAddTopClick compIndex=', compIndex, ' insertIndex=', insertIndex);
    this.insertNewSectionAtIndex(insertIndex);
  }

  /**
   * handle add bottom section
   * @param event 
   */
  handleOnAddBottomClick(event: any) {
    const compIndex = this.selectedComp.getIndex();
    let insertIndex = compIndex + 1;
    // console.log('handleOnAddBottomClick compIndex=', compIndex, ' insertIndex=', insertIndex);
    this.insertNewSectionAtIndex(insertIndex);
  }

  /**
   * handle on hide hover
   */
  handleOnHideHover = () => {
    this.compHover = null;
    this.detectChanges();
  }

  /**
   * handle on show hover
   * @param compHover 
   * @returns 
   */
  handleOnShowHover = (compHover: DomComponent) => {
    this.compHover = compHover;
    if (!compHover || GLOBAL.editor.getBlockMoved()) {
      this.compHover = null;
      this.detectChanges();
      return;
    }
    const moType = compHover.getAttributes()['mo-type'];
    this.isHoverSection = moType === 'section' ? true : false;
    this.isHoverFooter = moType === 'footer' ? true : false;
    this.isHoverHeader = moType  === 'header' ? true : false;

    if (!this.isHoverSection && !this.isHoverFooter && !this.isHoverHeader) {
      this.compHover = null;
      this.detectChanges();
      return;
    }
    this.setHoverPosition();
  }

  /**
   * handle hover add top section
   * @param event 
   */
  handleOnHoverAddTopClick(event: any) {
    if (!this.compHover) {
      return;
    }
    const compIndex = this.compHover.getIndex();
    let insertIndex = compIndex ;
    // console.log('handleOnAddTopClick compIndex=', compIndex, ' insertIndex=', insertIndex);
    this.insertNewSectionAtIndex(insertIndex);
  }

  /**
   * handle hover add bottom section
   * @param event 
   */
  handleOnHoverAddBottomClick(event: any) {
    if (!this.compHover) {
      return;
    }
    const compIndex = this.compHover.getIndex();
    let insertIndex = compIndex + 1;
    // console.log('handleOnAddBottomClick compIndex=', compIndex, ' insertIndex=', insertIndex);
    this.insertNewSectionAtIndex(insertIndex);
  }

  override handleOnCanvasScroll = () => {
    this.setPosition();
    this.setHoverPosition();
    this.detectChanges();
  }
}
