
import {
  Component, Input, ElementRef, ChangeDetectorRef, OnInit, ViewRef
} from '@angular/core';
import { DomComponent, GLOBAL } from '../editor-wrapper';
import { EditorConstants } from '../constants';
import { MoBlocksService } from '../blocks/blocks.service';

@Component({
  template: "<div></div>",
})
export class MoLandingEditorLayerBaseComponent implements OnInit {
  
  selectedComp: DomComponent; 
  isOpen: boolean;
  moType: string;
  top: number;
  left: number;
  width: number;
  height: number;

  scrollTimer: any;

  @Input() classInclude: string = '';

  constructor(
    public _changeDetection: ChangeDetectorRef,
    public _blockService: MoBlocksService
  ) {
  }

  ngOnInit() {
    this.onInit();
  }

  onInit(){
    
  }

  ngAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVE_STATED_EVENT, this.handleOnCompMoveStarted);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVE_ENDED_EVENT, this.handleOnCompMoveEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_SCROLL_EVENT, this.handleOnCanvasScroll);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_RESIZE_STARTED_EVENT, this.handleOnCanvasResizeStarted);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_RESIZE_ENDED_EVENT, this.handleOnCanvasResizeEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_STARTED_EVENT, this.handleOnCompResizeStarted);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnCompResizeEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_NONE_SELECTED_EVENT, this.handleOnCompNoneSelected);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
    GLOBAL.editor.getEditor().on(EditorConstants.SELECTED_COMP_REMOVED_EVENT, this.handleOnSelectedCompRemoved);

    window.addEventListener('resize', this.handleOnWindowResize);
    GLOBAL.editor.getIframeWin().addEventListener('scroll', this.handleIframeScroll);

    this.onAfterViewInit();
  }

  onAfterViewInit() {
  }

  ngOnDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVE_STATED_EVENT, this.handleOnCompMoveStarted);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVE_ENDED_EVENT, this.handleOnCompMoveEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_SCROLL_EVENT, this.handleOnCanvasScroll);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_RESIZE_STARTED_EVENT, this.handleOnCanvasResizeStarted);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_RESIZE_ENDED_EVENT, this.handleOnCanvasResizeEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_STARTED_EVENT, this.handleOnCompResizeStarted);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnCompResizeEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_NONE_SELECTED_EVENT, this.handleOnCompNoneSelected);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
    GLOBAL.editor.getEditor().off(EditorConstants.SELECTED_COMP_REMOVED_EVENT, this.handleOnSelectedCompRemoved);

    window.removeEventListener('resize', this.handleOnWindowResize);
    GLOBAL.editor.getIframeWin().removeEventListener('scroll', this.handleIframeScroll);

    this.onDestroy();
  }

  onDestroy() {
  }

  setValue(): void {
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      return;
    }

    const attrs = this.selectedComp.getAttributes();
    this.moType = attrs['mo-type'];
    this.isOpen = true;
  }

  /**
   * set position
   * @returns 
   */
  setPosition(): void {
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      this.isOpen = false;
      this.detectChanges();
      return;
    }

    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.selectedComp.view.el.getBoundingClientRect();

    this.top = editorRect.top + rect.top;
    this.left = editorRect.left + rect.left;
    this.width = rect.width;
    this.height = rect.height;

    this.detectChanges();
  }

  handleOnCompToggled = (comp: any) => {
    if (!comp) {
      return;
    }
    const selectedComp = GLOBAL.editor.getSelected();
    if (!selectedComp) {
      this.isOpen = false;
      this.detectChanges();
      return;
    }

    this.setValue();
  }

  handleIframeScroll = (e: any) => {
    this.setPosition();

    if (this.scrollTimer !== null) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(this.handleOnFrameScrollEnd, 150);
  }

  handleOnCompMoveStarted = (e: any) => {
    this.isOpen = false;
    this.detectChanges();
  }

  handleOnCompMoveEnded = (e: any) => {
    this.isOpen = true;
    this.setPosition();
    this.detectChanges();
  }

  handleOnCanvasScroll = () => {
    this.setPosition();
    this.detectChanges();
  }

  handleOnCanvasResizeStarted = () => {
    this.isOpen = false;
    this.detectChanges();
  }

  handleOnCanvasResizeEnded = () => {
  }
  
  handleOnWindowResize = (event: any) => {
    this.setPosition();
  }

  handleOnCompResizeStarted = (event: any) => {
    this.isOpen = false;
    this.detectChanges();
  }

  handleOnCompResizeEnded = (event: any) => {
    this.isOpen = true;
    this.setPosition();
    this.detectChanges();
  }

  handleOnCompUndo = () => {
    this.setPosition();
  }

  handleOnCompRedo = () => {
    this.setPosition();
  }

  handleOnCompNoneSelected = () => {
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * handle on iframe scrollend
   */
  handleOnFrameScrollEnd = () => {
  }

  /**
   * handle selected comp updated
   */
  handleOnSelectedCompUpdated = (event: any) => {
    this.setPosition();
  }

  /**
   * handle selected comp has removed event
   */
  handleOnSelectedCompRemoved = () => {
    this.isOpen = false;
    this.detectChanges();
  }

  detectChanges() {
    if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
      this._changeDetection.detectChanges();
    }
  }
}
