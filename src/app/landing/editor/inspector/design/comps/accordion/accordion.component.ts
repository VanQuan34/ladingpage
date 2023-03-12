import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { IColorVar } from 'src/app/common/common-types';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { Utils } from 'src/app/utils/utils';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

const TITLE_BGH = '--bgh-title';
const TITLE_BG = '--bg-title';
const HEIGHT_TITLE = '--height-tabTitle';
const MR_BOTTOM = '--mb';
const MR_TOP = '--mt';
const DISPLAY = '--display';
@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorLayoutCompsAccordionComponent extends MoLandingEditorInspectorBaseComponent {

  @Input() selectorAddTextHover: string = ' .mo-accordion-container [id^="item"]:checked + .accordion-title';
  fontColor: any;
  fontColorHover: any;
  bgTitle: string;
  bgTitleHover: string;
  mb: number;
  dsType: string;
  selectorContainer: string = '.mo-accordion-container';
  selectorContent: string = ' .mo-accordion-content';
  selectorTitle: string = '.accordion-title';
  override onInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnUpdateHeightTabContent);
  }
 
  override onAfterViewInit() {
    setTimeout(() => {
      this.setValue();
    }, 0);
  }
 
  override onDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnUpdateHeightTabContent);
  }
 
  override setValue(): void {
    super.setValue();
    this.state = 'REGULAR';
    this.fontColor = this.getStyle()[TITLE_BG] ? Utils.parseColorVar(this.getStyle()[TITLE_BG]) : '';
    this.bgTitle = `rgba(${this.fontColor.rgbColor}, ${this.fontColor.alpha})`;
    this.fontColorHover = this.getStyle()[TITLE_BGH] ? Utils.parseColorVar(this.getStyle()[TITLE_BGH]) : '';
    this.bgTitleHover = `rgba(${this.fontColorHover.rgbColor}, ${this.fontColorHover.alpha})`;
    this.mb = this.getStyle()[MR_BOTTOM] && parseInt(this.getStyle()[MR_BOTTOM].replace('px', '').trim()) || 0;
    this.dsType =  this.getStyle()[DISPLAY] && this.getStyle()[DISPLAY].trim() || 'horizontal';
  }

  /**
   * change tab
   * @param state 
   */
  changeTab(state: 'REGULAR' | 'ACTIVE') {
    this.state = state;

    const attrs = this.selectedComp.getAttributes();
    if (this.state === 'ACTIVE') {
      attrs['data-preview'] = "hover";
    } else {
      attrs['data-preview'] = "regular";
    }
    this.selectedComp.setAttributes(attrs, {});
    this.detectChanges();
  }

  handleOnTabClick(state: 'REGULAR' | 'ACTIVE') {
    this.changeTab(state);
  }

  handleOnFontColorChanged(colorVar: IColorVar, type: 'regular' | 'active') {
    this.changeTextColor(colorVar, true, type);
  }

  handleOnFontColorSelect(colorVar: IColorVar, type: 'regular' | 'active') {
    this.changeTextColor(colorVar, false, type);
  }

  handleOnFontColorClosed() {
    this.clearInlineStyles();
  }

  changeTextColor(selectColor: IColorVar, isInline: boolean = false, type: 'regular' | 'active') {
    const value =  `rgba(${selectColor.rgbColor},${selectColor.alpha})`;
    if(type === 'active'){
      this.fontColorHover = selectColor;
      this.setStyle(value, TITLE_BGH);
      this.bgTitle = value;
    }
    if(type === 'regular'){
      this.fontColor = selectColor;
      this.setStyle(value, TITLE_BG);
      this.bgTitleHover = value;
    }
    this.detectChanges();
  }

   /**
   * clear inline styles
   */
   clearInlineStyles() {
    this.$targetEls.removeAttr('style');
  }

  handleOnUpdateHeightTabContent = () => {
    const compItem = this.selectedComp.find(this.selectorTitle)[0];
    const heightTitle = compItem.view.el.offsetHeight;
    const gapTop = parseInt(this.getStyle()[MR_BOTTOM].replace('px','').trim()) || 0;
    const gapBottom = parseInt(this.getStyle()[MR_TOP].replace('px','').trim()) || 0;
    this.setStyle(`${(heightTitle + gapTop + gapBottom)}px`, HEIGHT_TITLE, this.selectorContent);
  }

}