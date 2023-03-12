
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../components/detection.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { EditorConstants } from '../../constants';
import { MoCompLabel } from '../../../../common/common-types';

@Component({
  selector: 'mo-wb-landing-editor-layer-hover',
  templateUrl: './hover.component.html',
  styleUrls: ['./hover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerHoverComponent extends MoWbDetectionComponent {
  
  isShow: boolean;
  moType: string;
  top: number;
  left: number;
  width: number;
  height: number;
  compName: string = '';
  compHover: DomComponent = null;
  isSection: boolean = false;

  @Input() classInclude: string = '';

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SHOW_HOVER_EVENT, this.handleOnShowHover);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_HIDE_HOVER_EVENT, this.handleOnHideHover);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_SCROLL_EVENT, this.handleOnCanvasScroll);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
  }

  onAfterViewInit() {
  }

  override ngOnDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SHOW_HOVER_EVENT, this.handleOnShowHover);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_HIDE_HOVER_EVENT, this.handleOnHideHover);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_SCROLL_EVENT, this.handleOnCanvasScroll);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);

    this.onDestroy();
  }

  onDestroy() {
  }

  setPosition() {
    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.compHover.view.el.getBoundingClientRect();

    this.top = editorRect.top + rect.top;
    this.left = editorRect.left + rect.left;
    this.width = rect.width;
    this.height = rect.height;

    const moType = this.compHover.getAttributes()['mo-type'];
    this.isSection = moType === 'section' && GLOBAL.compUtil.checkCompIsEmpty(this.compHover) ? true : false;
    this.compName = MoCompLabel[moType] || moType;
  }

  handleOnShowHover = (comp: DomComponent) => {
    this.compHover = comp;
    if (!comp) {
      this.isShow = false;
      this.detectChanges();
      return;
    }
    this.isShow = true;
    this.setPosition();
    this.detectChanges();
  }

  handleOnHideHover = () => {
    this.isShow = false;
    this.detectChanges();
  }

  handleOnCanvasScroll = () => {
    this.setPosition();
    this.detectChanges();
  }
  /**
   * handle on add new element
   * @param e 
   */
  handleOnAddElementClick = (e: any) => {
    $(GLOBAL.canvasEl).trigger(EditorConstants.OPEN_ADD_NEW_ELEMENT_EVENT);
  }

  /**
   * handle on comp remove
   */
  handleOnCompMoving = () => {
    this.isShow = false;
    this.detectChanges();
  }

}
