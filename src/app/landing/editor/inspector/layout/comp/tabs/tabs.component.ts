import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
interface IDsType {
  id: string,
  type: string,
  name: string;
}
const DISPLAY = '--display';
const FL_DRT = '--flex-direction';
const HEIGHT_TITLE = '--height-tabTitle';
const MR_BOTTOM = '--mb';
const MR_TOP = '--mt';
const MR_LEFT = '--ml';
const MR_RIGHT = '--mr';
const W_TITLE = '--w-title';
const JUSTIFY = '--justify';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-comps-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorTabsComponent extends MoLandingEditorInspectorBaseComponent {

  selectorContainer: string = '.mo-tabs-container';
  selectorItem: string = 'li';
  selectorContent: string = ' .mo-tab-content';
  selectorTitle: string = '.label-title';
  dsTypes: IDsType[] = [];
  dsType: string;
  widthVer: number;
  alignTitle: string;
  override onInit() {
    this.dsTypes = [
      {
        id: 'horizontal',
        type: 'row',
        name: 'Theo chiều ngang'
      },
      {
        id: 'vertical',
        type: 'column',
        name: 'Theo chiều dọc'
      },
      ];
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnUpdateHeightTabContent);
  }

  override onAfterViewInit() {
    setTimeout(() => {
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnUpdateHeightTabContent);
  }

  override setValue(): void {
    super.setValue();
    this.dsType = this.getStyle()[DISPLAY] && this.getStyle()[DISPLAY].trim() || 'horizontal';
    this.widthVer = this.getStyle()[W_TITLE] && parseInt(this.getStyle()[W_TITLE].replace('px', '').trim()) || 120;
    this.alignTitle = this.getStyle()[JUSTIFY] && this.getStyle()[JUSTIFY].trim() || 'flex-start';
  }

  handleOnUpdateHeightTabContent = () => {
    const compItem = this.selectedComp.find(this.selectorItem+':first-child')[0];
    const heightTitle = compItem.find(this.selectorTitle)[0].view.el.offsetHeight;
    const gapTop = parseInt(this.getStyle()[MR_BOTTOM].replace('px','').trim()) || 0;
    const gapBottom = parseInt(this.getStyle()[MR_TOP].replace('px','').trim()) || 0;
    this.setStyle(`${(heightTitle + gapTop + gapBottom)}px`, HEIGHT_TITLE, this.selectorContent);
    this.handleUpdateDisplayType();
  }

  handleOnSelectDisplayType(e: any){
    this.dsType = e.id;
    this.setStyle(e.id, DISPLAY);
    this.setStyle(e.type, FL_DRT);
    this.handleUpdateDisplayType()
    this.detectChanges();
  }

  handleOnVerticalChange(value: number) {
    this.changeWidthTitleVertical(value, false);
  }

  handleOnInputVerticalSliderValueChanged(value: number) {
    this.changeWidthTitleVertical(value, true);
  }

  changeWidthTitleVertical(value: number, isInline: boolean) {
    this.widthVer = value;
    this.detectChanges();
    if (isInline) {
      this.selectedComp.find(this.selectorItem).forEach((item: any) => {
         item.view.$el.attr('style', `max-width : ${this.widthVer}px`);
      });
      if(this.dsType === 'vertical'){
        const gapMr = this.getStyle()[MR_RIGHT] && parseInt(this.getStyle()[MR_RIGHT].replace('px','').trim()) || 0;
        this.selectedComp.find(this.selectorContent).forEach((item: any) => {
          item.view.$el.attr('style', `width : calc(100% - ${this.widthVer}px`);
        });
      }
      return;
    }
    this.setStyle(`${value}px`, W_TITLE);
    this.deleteInlineStyleWidth();
    this.handleUpdateDisplayType();
    this.updateDockingPosInfo();
  }

  handleUpdateDisplayType(){
    const gapMr = this.getStyle()[MR_RIGHT] && parseInt(this.getStyle()[MR_RIGHT].replace('px','').trim()) || 0;
    let styles = GLOBAL.editor.getStyles(`#${this.selectedComp.getId()} ${this.selectorContent}`);
    if(this.dsType === 'vertical'){
      styles['width'] = `calc(100% - ${this.widthVer}px )`;
      styles['right'] = '0';
      styles['left'] = 'auto';
      styles['top'] = '0';
      styles['height'] = '100%';
    }
    if(this.dsType === 'horizontal'){
      styles['width'] = `100%`;
      styles['right'] = 'auto';
      styles['left'] = '0';
      styles['top'] = 'auto';
      styles['height'] = `calc(100% - var(${HEIGHT_TITLE}) )`;
    }
    GLOBAL.editor.setStyles(`#${this.selectedComp.getId()} ${this.selectorContent}`, styles);
    this.detectChanges();
  }

  deleteInlineStyleWidth(){
    this.selectedComp.find(this.selectorItem).forEach((item: any) => {
      item.view.$el.removeAttr('style');
    });
    this.selectedComp.find(this.selectorContent).forEach((item: any) => {
      item.view.$el.removeAttr('style');
    });
  }

  handlerSelectAlignTitle(e: any, align: 'flex-start' | 'center' | 'flex-end'){
    this.alignTitle = align;
    this.setStyle(align, JUSTIFY);
    this.detectChanges();
  }

}
