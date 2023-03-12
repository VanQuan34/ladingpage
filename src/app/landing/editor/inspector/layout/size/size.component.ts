import {
    Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
    Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
  } from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../base.component';
import * as $ from 'jquery';
import { harmony, colorScheme, lightness, hsl } from 'simpler-color';
import { GLOBAL } from '../../../editor-wrapper';
import { EditorConstants } from '../../../constants';
import { IBlock, IBlockSize } from '../../../blocks/blocks.service';
import { IUnit } from 'src/app/utils/unitUtil';
import { IDockingPos } from 'src/app/utils/dockUtil';

  @Component({
    selector: 'mo-wb-landing-editor-inspector-layout-size',
    templateUrl: './size.component.html',
    styleUrls: ['./size.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MoLandingEditorInspectorSizeComponent extends MoLandingEditorInspectorBaseComponent {
    
    wSize: IBlockSize;
    minWSize: IBlockSize;
    maxWSize: IBlockSize;
    hSize: IBlockSize;
    minHSize: IBlockSize;
    maxHSize: IBlockSize;

    override onInit() {
      GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnCompResizeEnded);
      GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnCompUpdate);
    }

    override onDestroy(): void {
      GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnCompResizeEnded);
      GLOBAL.editor.getEditor().off(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnCompUpdate);
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

      this.getSizeData();
      this.detectChanges();
    }

    getSizeData() {
      const attrs = this.selectedComp.getAttributes();
      const moType = attrs['mo-type'];

      const blockData: IBlock = this._blockService.getContentBlock(moType);
      this.wSize = blockData && blockData.width;
      this.minWSize = blockData && blockData.minWidth;
      this.maxWSize = blockData && blockData.maxWidth;
      this.hSize = blockData && blockData.height;
      this.minHSize = blockData && blockData.minHeight;
      this.maxHSize = blockData && blockData.maxHeight;

      const styles = this.getStyle();
      const width = styles['width'];
      const minWidth = styles['min-width'];
      const maxWidth = styles['max-width'];
      const height = styles['height'];
      const minHeight = styles['min-height'];
      const maxHeight = styles['max-height'];
      const alignSelf = styles['align-self'];
      const justifySelf = styles['justify-self'];

      if (width && this.wSize) {
        this.wSize.unit = GLOBAL.unit.parseUnit(width);
        this.wSize.value = GLOBAL.unit.getValueSize(width, this.wSize.unit);
        if (justifySelf === 'stretch') {
          this.wSize.isEnable = false;
        } else if (blockData.width.isEnable){
          this.wSize.isEnable = true;
        }
      }

      if (height && this.hSize) {
        this.hSize.unit = GLOBAL.unit.parseUnit(height);
        this.hSize.value = GLOBAL.unit.getValueSize(height, this.hSize.unit);

        if (alignSelf === 'stretch') {
          this.hSize.isEnable = false;
        } else if (blockData.height.isEnable){
          this.hSize.isEnable = true;
        }
      }

      if (minWidth && this.minWSize) {
        this.minWSize.unit = GLOBAL.unit.parseUnit(minWidth);
        this.minWSize.value = GLOBAL.unit.getValueSize(minWidth, this.minWSize.unit);
      }

      if (minHeight && this.minHSize) {
        this.minHSize.unit = GLOBAL.unit.parseUnit(minHeight);
        this.minHSize.value = GLOBAL.unit.getValueSize(minHeight, this.minHSize.unit);
      }

      if (maxWidth && this.maxWSize) {
        this.maxWSize.unit = GLOBAL.unit.parseUnit(maxWidth);
        this.maxWSize.value = GLOBAL.unit.getValueSize(maxWidth, this.maxWSize.unit);
      }

      if (maxHeight && this.maxHSize) {
        this.maxHSize.unit = GLOBAL.unit.parseUnit(maxHeight);
        this.maxHSize.value = GLOBAL.unit.getValueSize(maxHeight, this.maxHSize.unit);
      }
      // console.log('getBlockSizeValue blockData=', blockData, ' moType=', moType);
    }

    /**
     * change unit size
     * @param property 
     * @param unit 
     * @returns 
     */
    changeSizeUnit(property: 'width' | 'min-width' | 'max-width' | 'height' | 'min-height' | 'max-height', unit: IUnit) {
      const selectedModel = GLOBAL.editor.getSelected();
      if (!selectedModel) {
        return;
      }
      // get value
      let value;
      switch(property) {
        case 'width':
        case 'min-width':
        case 'max-width':
          value = GLOBAL.unit.getSizeByUnit(this.selectedComp, unit.key);
          break;
        default:
          value = GLOBAL.unit.getSizeByUnit(this.selectedComp, unit.key, false);
          break;
      }

      // update size
      switch(property) {
        case 'width':
          this.wSize.unit = unit.key;
          this.wSize.value = value;
          break;
        case 'min-width':
          this.minWSize.unit = unit.key;
          this.minWSize.value = value;
          break;
        case 'max-width':
          this.maxWSize.unit = unit.key;
          this.maxWSize.value = value;
          break;
        case 'height':
          this.hSize.unit = unit.key;
          this.hSize.value = value;
          break;
        case 'min-height':
          this.minHSize.unit = unit.key;
          this.minHSize.value = value;
          break;
        case 'max-height':
          this.maxHSize.unit = unit.key;
          this.maxHSize.value = value;
          break;
        default:
          break;
      }

      if (unit.key === 'none') {
        this.setStyles([], [property]);
      } else {
        this.setStyle(`${value}${unit.key}`, property);
      }

      this.updateDockingPosInfo();
      this.detectChanges();
    }

    changeSizeValue(value: any, property:  'width' | 'min-width' | 'max-width' | 'height' | 'min-height' | 'max-height') {
      let unit = '';
      switch(property) {
        case 'width':
          unit = `${this.wSize.unit}`;
          break;
        case 'min-width':
          unit = `${this.minWSize.unit}`;
          break;
        case 'max-width':
          unit = `${this.maxWSize.unit}`;
          break;
        case 'height':
          unit = `${this.hSize.unit}`;
          break;
        case 'min-height':
          unit = `${this.minHSize.unit}`;
          break;
        case 'max-height':
          unit = `${this.maxHSize.unit}`;
          break;
      }

      this.setStyle(`${value}${unit}`, property);
      
      this.updateDockingPosInfo();
    }
    
    /**
     * handle unit changed
     * @param unit 
     * @returns 
     */
    handleOnUnitChange(unit: IUnit, property:  'width' | 'min-width' | 'max-width' | 'height' | 'min-height' | 'max-height') {
      this.changeSizeUnit(property, unit);
    }

    /**
     * handle value change
     * @param value 
     */
    handleOnValueChanged(value: number, property:  'width' | 'min-width' | 'max-width' | 'height' | 'min-height' | 'max-height') {
      this.changeSizeValue(value, property);
    }

    /**
     * handle component resize ended
     */
    handleOnCompResizeEnded = () => {
      this.setValue();
    }

    /**
     * handle on component update
     */
    handleOnCompUpdate = () => {
      this.setValue();
    }
    
  }
  