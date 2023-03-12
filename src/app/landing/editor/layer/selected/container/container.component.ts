
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../../base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { EditorConstants } from '../../../constants';

@Component({
  selector: 'mo-wb-landing-editor-layer-selected-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerSelectedContainerComponent extends MoLandingEditorLayerBaseComponent {
  
  containerComp: DomComponent;
  isContainer: boolean;
  isShowAttach: boolean = false;

  override ngOnInit() {
  }

  override onAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_CONTAINER_SHOW_EVENT, this.handleOnShowContainer);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SHOW_ATTACH_EVENT, this.handleOnShowAttachEvent);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_HIDE_ATTACH_EVENT, this.handleOnHideAttachEvent);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_CONTAINER_SHOW_EVENT, this.handleOnShowContainer);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SHOW_ATTACH_EVENT, this.handleOnShowAttachEvent);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_HIDE_ATTACH_EVENT, this.handleOnHideAttachEvent);
  }

  override setValue(): void {
    super.setValue();
    
    this.containerComp = GLOBAL.compUtil.getContainer(this.selectedComp);
    this.isContainer = false;
    this.isShowAttach = false;
    this.setPosition();
    this.detectChanges();
  }

  /**
   * set position
   * @returns 
   */
  override setPosition(): void {
    if (!this.isOpen) {
      return;
    }
    if (!this.containerComp) {
      this.detectChanges();
      return;
    }
    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.containerComp.view.el.getBoundingClientRect();

    this.top = editorRect.top + rect.top;
    this.left = editorRect.left + rect.left;
    this.width = rect.width;
    this.height = rect.height;

    this.detectChanges();
  }

  override handleOnCompMoveStarted = (e: any) => {
  }

  override handleOnCompMoveEnded = (e: any) => {
  }

  checkIsContainer() {
    const moType = this.containerComp && this.containerComp.getAttributes()['mo-type'];
    const isSection = moType === 'section' ? true : false;
    const isFooter = moType === 'footer' ? true : false;
    const isHeader = moType  === 'header' ? true : false;
    if (this.containerComp) {
      this.isContainer = this.containerComp.getAttributes()['mo-type'] === 'container' 
        || this.containerComp.hasClass('mo-comp-container') ? true : false;
    } else {
      this.isContainer = false;
    }
    this.isContainer = this.containerComp && !isSection && !isHeader && !isFooter ? true : false;
  }

  handleOnShowContainer = (comp: DomComponent) => {
    this.containerComp = comp;
    this.checkIsContainer();
    this.isOpen = true;
    this.setPosition();
  }

  handleOnShowAttachEvent = (comp: DomComponent) => {
    this.isShowAttach = true;
    this.detectChanges();
  }

  handleOnHideAttachEvent = (comp: DomComponent) => {
    this.isShowAttach = false;
    this.detectChanges();
  }

  override handleOnCompResizeStarted = (event: any) => {}

}
