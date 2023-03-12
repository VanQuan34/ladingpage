import {
  Component, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { GLOBAL } from '../../../../editor-wrapper';
import { IUnit, IUnitInfo } from 'src/app/utils/unitUtil';
import { EditorConstants } from 'src/app/landing/editor/constants';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-position-padding',
  templateUrl: './padding.component.html',
  styleUrls: ['./padding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorPositionPaddingComponent extends MoLandingEditorInspectorBaseComponent {
  
  pl: IUnitInfo;
  pt: IUnitInfo;
  pr: IUnitInfo;
  pb: IUnitInfo;
  units: any[];

  override onInit() {
    this.units = GLOBAL.unit.getPaddingUnits();
  }

  override onDestroy(): void {
  }
  
  /**
   * override set value
   * @returns 
   */
  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    this.setPaddingValue();
    this.detectChanges();
  }

  /**
   * set padding value
   */
  setPaddingValue() {
    const styles = GLOBAL.compUtil.getGridContainerStyles(this.selectedComp);
    const paddingLeft = styles['padding-left'];
    const paddingRight = styles['padding-right'];
    const paddingTop = styles['padding-top'];
    const paddingBottom = styles['padding-bottom'];
    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const containerRect = container && container.view.el.getBoundingClientRect();

    this.pt = this.parserPaddingValue(paddingTop, containerRect && containerRect.height);
    this.pl = this.parserPaddingValue(paddingLeft, containerRect && containerRect.width);
    this.pr = this.parserPaddingValue(paddingRight, containerRect && containerRect.width);
    this.pb = this.parserPaddingValue(paddingBottom, containerRect && containerRect.height);

    this.detectChanges();
  }

  parserPaddingValue(value: string, containerSize: number) {
    const paddingInfo : IUnitInfo = GLOBAL.unit.parseUnitInfo(value);
    paddingInfo.valuePx = GLOBAL.unit.convertUnitValueToPixel(paddingInfo.value, containerSize, paddingInfo.unit);
    return paddingInfo;
  }

  /**
   * change padding value
   * @param value 
   * @param type 
   */
  changePaddingValue(value: number, type: 'top' | 'left' | 'right' | 'bottom') {
    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const containerRect = container.view.el.getBoundingClientRect();
    let paddingValue = '';
    switch(type) {
      case 'top':
        paddingValue = `${value}${this.pt.unit}`;
        this.pt.value = value;
        this.pt.valuePx = GLOBAL.unit.convertUnitValueToPixel(value, containerRect.height * 2, this.pt.unit);
        this.setStyle(paddingValue, 'padding-top');
        break;
      case 'left':
        paddingValue = `${value}${this.pl.unit}`;
        this.pl.value = value;
        this.pl.valuePx = GLOBAL.unit.convertUnitValueToPixel(value, containerRect.width * 2, this.pl.unit);
        this.setStyle(paddingValue, 'padding-left');
        break;
      case 'right':
        paddingValue = `${value}${this.pr.unit}`;
        this.pr.value = value;
        this.pr.valuePx = GLOBAL.unit.convertUnitValueToPixel(value, containerRect.width * 2, this.pr.unit);
        this.setStyle(paddingValue, 'padding-right');
        break;
      case 'bottom':
        paddingValue = `${value}${this.pb.unit}`;
        this.pb.value = value;
        this.pb.valuePx = GLOBAL.unit.convertUnitValueToPixel(value, containerRect.width * 2, this.pb.unit);
        this.setStyle(paddingValue, 'padding-bottom');
        break;
      default:
        break;
    }
    const pa = {
      
    }
    // raise padding change event
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_PADDING_CHANGED_EVENT, {
      pt: this.pt,
      pl: this.pl,
      pr: this.pr,
      pb: this.pb
    });
    // update docking pos
    this.updateDockingPosInfo();
  }

  /**
   * change padding unit
   * @param unit 
   * @param type 
   */
  changePaddingUnit(unit: IUnit, type: 'top' | 'left' | 'right' | 'bottom') {
    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const containerRect = container.view.el.getBoundingClientRect();
    const rect = this.selectedComp.view.el.getBoundingClientRect();
    let newValue: any;
    switch(type) {
      case 'top':
        newValue = GLOBAL.unit.convertPixelValueToUnitValue(this.pt.valuePx, rect.height * 2, unit.value);
        this.pt.value = newValue;
        this.pt.unit = unit.value;
        this.setStyle(`${newValue}${this.pt.unit}`, 'padding-top');
        break;
      case 'left':
        newValue = GLOBAL.unit.convertPixelValueToUnitValue(this.pl.valuePx, rect.width , unit.value);
        this.pl.value = newValue;
        this.pl.unit = unit.value;
        this.setStyle(`${newValue}${this.pl.unit}`, 'padding-left');
        break;
      case 'right':
        newValue = GLOBAL.unit.convertPixelValueToUnitValue(this.pr.valuePx, rect.width , unit.value);
        this.pr.value = newValue;
        this.pr.unit = unit.value;
        this.setStyle(`${newValue}${this.pr.unit}`, 'padding-right');
        break;
      case 'bottom':
        newValue = GLOBAL.unit.convertPixelValueToUnitValue(this.pb.valuePx, rect.height * 2, unit.value);
        this.pb.value = newValue;
        this.pb.unit = unit.value;
        this.setStyle(`${newValue}${this.pb.unit}`, 'padding-bottom');
        break;
      default:
        break;
    }
    // raise padding change event
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_PADDING_CHANGED_EVENT, {
      pt: this.pt,
      pl: this.pl,
      pr: this.pr,
      pb: this.pb
    });
    // update docking pos
    this.updateDockingPosInfo();
  }

  // /**
  //  * set grid container styles
  //  * @param value 
  //  * @param property 
  //  */
  // override setStyle(value: string, property: string) {
  //   const styles = GLOBAL.compUtil.getGridContainerStyles(this.selectedComp);
  //   styles[property] = value;
  //   const gridId = GLOBAL.compUtil.getGridContainerId(this.selectedComp.getId());
  //   GLOBAL.editor.setStyles(`#${this.selectedComp.getId()} .${gridId}`, styles);
  // }

  handleOnPaddingValueChange(value: number, type: 'top' | 'left' | 'right' | 'bottom') {
    this.changePaddingValue(value, type);
  }

  handleOnPaddingUnitChange(unit: IUnit, type: 'top' | 'left' | 'right' | 'bottom') {
    this.changePaddingUnit(unit, type);
  }
  
}
