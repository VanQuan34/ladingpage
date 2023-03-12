import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { IColorVar } from 'src/app/common/common-types';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { Utils } from 'src/app/utils/utils';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { MoLandingEditorInspectorEditAccordionComponent } from './edit/edit.component';
interface IDsType {
  id: string,
  order: number;
  name: string;
}
const DISPLAY = '--display';
const DRT = '--direction';
const SHOW_ICON = '--show-icon';
const SIZE_ICON = '--size-icon';
const COLOR_ICON = '--color-icon';
const ORDER = '--order';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-comps-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorAccordionComponent extends MoLandingEditorInspectorBaseComponent {

  selectorContainer: string = '.mo-accordion-container';
  selectorContent: string = ' .mo-accordion-content';
  selectorTitle: string = '.accordion-title';
  selectorText: string = '.head-title';
  selectorIcon: string =  '.icon-toggle';
  dsTypes: IDsType[] = [];
  directions: IDsType[] = [];
  direction: string;
  dsType: string;
  showIcon: boolean;
  sizeIcon: number;
  fontColor: any;
  override title: string;

  override onInit() {
    this.dsTypes = [
      {
        id: 'top',
        order: 0,
        name: 'Title trên cùng'
      },
      {
        id: 'bottom',
        order: 0,
        name: 'Title dưới cùng'
      },
      ];
      this.directions = [
        {
          id: 'ltr',
          order: 0,
          name: 'Trái sang phải'
        },
        {
          id: 'rtl',
          order: 1,
          name: 'Phải sang trái'
        },
        ];
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
    this.dsType = this.getStyle()[DISPLAY] && this.getStyle()[DISPLAY].trim() || 'top';
    this.direction = this.getStyle()[DRT] && this.getStyle()[DRT].trim() || 'ltr';
    this.showIcon = this.getStyle()[SHOW_ICON] && JSON.parse(this.getStyle()[SHOW_ICON]) || false;
    this.sizeIcon = this.getStyle()[SIZE_ICON] && parseInt(this.getStyle()[SIZE_ICON].replace('px','').trim()) || 25;
    this.fontColor = this.getStyle()[COLOR_ICON] ? Utils.parseColorVar(this.getStyle()[COLOR_ICON]) : '';
  }

  handleOnSelectDirection(direction: any){
   this.direction = direction.id;
   this.setStyle(direction.id, DRT);
   this.setStyle(direction.order, ORDER);
   this.detectChanges();
  }

  handleOnChangeShowIcon(e: any){
    if (this.selectedComp.find(this.selectorIcon).length === 0 ) return;
    this.showIcon  = e.active;
    this.setStyle(e.active, SHOW_ICON);
    if(!this.showIcon){
      this.selectedComp.find(this.selectorIcon)[0].view.$el[0].style.display = 'none';
    }
    else{
      this.selectedComp.find(this.selectorIcon)[0].view.$el.removeAttr('style');
    }
  }

  handleOnSelectDisplayType(type: any){
    if(this.selectedComp.find(this.selectorTitle).length === 0 ) return;
    this.dsType = type.id;
    this.setStyle(type.id, DISPLAY);
    if(this.dsType === 'bottom'){
      this.selectedComp.find(this.selectorTitle)[0].view.$el[0].style.order = 1;
    } else{
      this.selectedComp.find(this.selectorTitle)[0].view.$el.removeAttr('style');
    }
  }

  handleOnChangeSizeIcon(value: number){
    this.changeSizeIcon(value, false);
  }

  handleOnInputSizeValueChanged(value: number){
    this.changeSizeIcon(value, true);
  }

  changeSizeIcon(value: number, isInline: boolean) {
    this.sizeIcon = value;
    this.detectChanges();
    if (isInline) {
      this.selectedComp.find(`${this.selectorIcon} svg`).forEach((item: any) => {
         item.view.$el.attr('style', `width : ${this.sizeIcon}px`);
      });
      return;
    }
    this.setStyle(`${value}px`, SIZE_ICON);
    this.selectedComp.find(`${this.selectorIcon} svg`).forEach((item: any) => {
      item.view.$el.removeAttr('style');
    });
    this.updateDockingPosInfo();
  }

  handleOnFontColorChanged(colorVar: IColorVar) {
    this.changeTextColor(colorVar, true);
  }

  handleOnFontColorSelect(colorVar: IColorVar) {
    this.changeTextColor(colorVar, false);
  }

  handleOnFontColorClosed() {
    // this.clearInlineStyles();
  }

  changeTextColor(selectColor: IColorVar, isInline: boolean = false) {
    const value =  `rgba(${selectColor.rgbColor},${selectColor.alpha})`;
    this.fontColor = selectColor;
    this.setStyle(value, COLOR_ICON);
    this.detectChanges();
  }

  handleOnClickEditAccordion(e: any){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorEditAccordionComponent).create(this._injector);
    popup.instance.onClose.subscribe(() => { 
      this._domService.removeComponentFromBody(popup);
    });

    popup.instance.newTitle.subscribe((value: string) => {
      const compSelected = this.selectedComp.find(this.selectorText)[0];
      compSelected.view.el.innerText = value;
      this.setValue();
    });

    popup.instance.showContent.subscribe((value: boolean) => {
      if( this.selectedComp.find('input').length === 0) return;
      if(this.selectedComp.find(this.selectorContent).length === 0) return;

      const idContent = this.selectedComp.find(this.selectorContent)[0].getId();
      const idUse = idContent.includes('_') && ` [id^="${idContent.split('_')[0]}_"]` || this.selectorContent;
      if(value === true){
        this.selectedComp.find('input')[0].view.el.setAttribute('checked','');
        this.selectedComp.find('input')[0].view.$el.checked = true;
        const styles = GLOBAL.editor.getStyles(`#${this.selectedComp.getId()}[id^="item"]:not(:checked) ~ ${this.selectorContent}`);
        delete styles['height'];
        delete styles['min-height'];
        GLOBAL.editor.setStyles(`#${this.selectedComp.getId()}${idUse}`, styles);
        this.updateDockingPosInfo();
      }
      else{
        this.selectedComp.find('input')[0].view.el.removeAttribute('checked');
        this.setStyle(0, 'min-height', ` [id^="item"]:not(:checked) ~ ${this.selectorContent}`);
        this.setStyle(0, 'height', ` [id^="item"]:not(:checked) ~ ${this.selectorContent}`);
        this.updateDockingPosInfo();
      }
    });
    this._domService.addDomToBody(popup);
    this.detectChanges();
  }

}
