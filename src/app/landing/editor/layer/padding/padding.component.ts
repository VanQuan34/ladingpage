
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../base.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { EditorConstants } from '../../constants';
import { IUnitInfo } from 'src/app/utils/unitUtil';

@Component({
  selector: 'mo-wb-landing-editor-layer-padding',
  templateUrl: './padding.component.html',
  styleUrls: ['./padding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerPaddingComponent extends MoLandingEditorLayerBaseComponent {
  pa: {
    id: string;
    top: number;
    left: number;
    width: number;
    height: number;
    pl: IUnitInfo;
    pt: IUnitInfo;
    pr: IUnitInfo;
    pb: IUnitInfo;
    comp: DomComponent;
  }[] = [];

  isShow: boolean;

  override ngOnInit() {
  } 

  override onAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_PADDING_CHANGED_EVENT, this.handleOnPaddingChanged);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_PADDING_CHANGED_EVENT, this.handleOnPaddingChanged);
  }

  override setValue(): void {
    super.setValue();
    if (this.selectedComp) {

    }
    this.setPaddingValue();
  }

  setPaddingValue() {
    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const comps: DomComponent[]= container ? [container, this.selectedComp] : [this.selectedComp];
    this.pa = [];
    this.isShow = true;
    comps.forEach(comp => {
      const styles = GLOBAL.compUtil.getGridContainerStyles(comp);
      const paddingLeft = styles['padding-left'];
      const paddingRight = styles['padding-right'];
      const paddingTop = styles['padding-top'];
      const paddingBottom = styles['padding-bottom'];
      
      const rect = comp.view.el.getBoundingClientRect();
      const editorRect = GLOBAL.canvasEl.getBoundingClientRect();

      this.pa.push({
        id: comp.getId(),
        pt: this.parserPaddingValue(paddingTop, rect.height),
        pl: this.parserPaddingValue(paddingLeft, rect.width),
        pr: this.parserPaddingValue(paddingRight, rect.width),
        pb: this.parserPaddingValue(paddingBottom, rect.height),
        width: rect.width,
        height: rect.height,
        top: editorRect.top + rect.top,
        left: editorRect.left + rect.left,
        comp: comp
      });
    });
    this.detectChanges();
  }

  parserPaddingValue(value: string, containerSize: number) {
    const paddingInfo : IUnitInfo = GLOBAL.unit.parseUnitInfo(value);
    paddingInfo.valuePx = GLOBAL.unit.convertUnitValueToPixel(paddingInfo.value, containerSize, paddingInfo.unit);
    return paddingInfo;
  }

  updatePosition() {
    this.pa.forEach(item => {
      const comp = item.comp;
      const rect = comp.view.el.getBoundingClientRect();
      const editorRect = GLOBAL.canvasEl.getBoundingClientRect();

      item.top = editorRect.top + rect.top;
      item.left = editorRect.left + rect.left;
      item.width = rect.width;
      item.height = rect.height;
    });
  }

  changePadding(pa: any) {
    console.log('changePadding pa=',pa);
    const paItems = this.pa.filter(item => {
      if (item.id == this.selectedComp.getId()) {
        return true;
      }
      return false;
    });
    if (!paItems.length) {
      return;
    }
    paItems[0].pt = pa.pt;
    paItems[0].pb = pa.pb;
    paItems[0].pl = pa.pl;
    paItems[0].pr = pa.pr;

    console.log('pa=', this.pa);
  }
  
  handleOnCompMoving = () => {
    this.updatePosition();
    this.detectChanges();
  }

  override handleOnCanvasScroll = () => {
    this.updatePosition();
    this.detectChanges();
  }

  override handleOnCompResizeStarted = () => {
    this.isShow = false;
    this.detectChanges();
  }

  override handleOnCompResizeEnded = () => {
    this.isShow = true;
    this.updatePosition();
    this.detectChanges();
  }

  override handleOnWindowResize = (event: any) => {
    this.updatePosition();
    this.detectChanges();
  }

  override handleIframeScroll = (e: any) => {
    this.updatePosition();
    this.detectChanges();
  }

  handleOnPaddingChanged = (pa: any) => {
    this.changePadding(pa);
    this.detectChanges();
  }

  override handleOnSelectedCompUpdated = (event: any) => {
    this.updatePosition();
    this.detectChanges();
  }

  override handleOnCompRedo = () => {
    this.updatePosition();
    this.detectChanges();
  }

  override handleOnCompUndo = () => {
    this.updatePosition();
    this.detectChanges();
  }
}
