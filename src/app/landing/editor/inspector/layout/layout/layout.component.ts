import { MoWbDropdownComponent } from './../../../../../components/dropdown/dropdown.component';
import {
  Component, ChangeDetectionStrategy, ViewChild
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../base.component';
import { IUnit, UnitKey } from '../../../../../utils/unitUtil';
import { GLOBAL } from '../../../editor-wrapper';
import { IGridCell, IGridGap, IGridInfo } from 'src/app/utils/gridLayoutUtil';
import { EditorConstants } from '../../../constants';
import {uid} from 'uid'
import { MoLandingEditorInspectorLayoutAddGridCustomComponent } from './add-grid-custom/grid-custom.component';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorLayoutItemComponent extends MoLandingEditorInspectorBaseComponent {
  
  type: string = '';
  menuColumnItem: any[];
  menuRowItem: any[];
 
  isColumnOpen: boolean = true;
  isRowOpen: boolean = true;

  columns: IGridCell[] = [];
  rows: IGridCell[] = [];

  rowGap: IGridGap;
  colGap: IGridGap;

  fullUnits: IUnit[];
  units: IUnit[];
  gapUnits: IUnit[];

  rectOver: any;


  override onInit() {
    this.menuColumnItem = [
      {
        id: 'left',
        title: 'Thêm cột bên trái'
      },
      {
        id: 'right',
        title: 'Thêm cột bên phải'
      },
      {
        id: 'remove',
        title: 'Xoá cột'
      }
    ];
    this.menuRowItem = [
      {
        id: 'top',
        title: 'Thêm hàng bên trên'
      },
      {
        id: 'bottom',
        title: 'Thêm hàng bên dưới'
      },
      {
        id: 'remove',
        title: 'Xoá hàng'
      }
    ];

    this.fullUnits = GLOBAL.unit.getLayoutUnits();
    this.units = GLOBAL.unit.getLayoutUnits(true);
    this.gapUnits = GLOBAL.unit.getGridGapUnits();
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
  }

  override onDestroy(): void {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
  }
  
  /**
   * override set value
   * @returns 
   */
  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      this.type = '';
      this.detectChanges();
      return;
    }
    const attrs = this.selectedComp.getAttributes();
    const moType = attrs['mo-type'];
    this.type = moType === 'section' || moType === 'container'
      || (this.selectedComp.hasClass('mo-comp-container') &&  moType !== 'repeater') ? 'container' : '';

    this.setGridInfo();
  }
  
  /**
   * set grid info
   * @returns 
   */
  setGridInfo() {
    const gridInfo: IGridInfo = this.selectedComp.get('grid-info');
    console.log('grid-info:', gridInfo);
    if (!gridInfo) {
      this.detectChanges();
      return;
    }
    this.columns = gridInfo.cols;
    this.rows = gridInfo.rows;
    this.rowGap = gridInfo.rowGap;
    this.colGap = gridInfo.colGap;


    this.detectChanges();
  }

  /**
   * show column
   * @param column 
   */
  showOverColumn(column: any) {
    let height = 0;
    for (let i=0; i < this.rows.length; i++) {
      height += this.rows[i].pos.height;
      if (i !== this.rows.length - 1) {
        height += this.rowGap.valuePx;
      }
    }
    const gridInfo: IGridInfo = this.selectedComp.get('grid-info');
    const canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
    this.rectOver = {
      height: height,
      width: column.pos.width,
      left: column.pos.left + canvasRect.left + gridInfo.rect.left,
      top: column.pos.top + canvasRect.top + gridInfo.rect.top,
    };

    this.detectChanges();
    // GLOBAL.editor.showCanvasElement('.mo-grid-layout-over', this.selectedModel.view.el, rect);
  }
  /**
   * show over row
   * @param row 
   */
  showOverRow(row: any) {
    let width = 0;
    for (let i=0; i < this.columns.length; i++) {
      width += this.columns[i].pos.width;
      if (i !== this.columns.length - 1) {
        width += this.colGap.valuePx;
      }
    }

    const gridInfo: IGridInfo = this.selectedComp.get('grid-info');
    const canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
    this.rectOver = {
      height: row.pos.height,
      width: width,
      left: row.pos.left + canvasRect.left + gridInfo.rect.left,
      top: row.pos.top + canvasRect.top + gridInfo.rect.top,
    };

    this.detectChanges();
    // GLOBAL.editor.showCanvasElement('.mo-grid-layout-over', this.selectedModel.view.el, rect);
  }

  hideOverRow() {
    this.rectOver = null;
    this.detectChanges();
    // GLOBAL.editor.hideCanvasElement('.mo-grid-layout-over');
  }

  hideOverColumn() {
    this.rectOver = null;
    this.detectChanges();
    // GLOBAL.editor.hideCanvasElement('.mo-grid-layout-over');
  }

  /**
   * change column grid unit
   * @param unit 
   * @param item 
   * @param index 
   */
  changeItemUnit(isColumn: boolean, unit: IUnit, item: any, index: number, isMinUnit: boolean = false, isMaxUnit: boolean = false) {
    const canvas = GLOBAL.editor.getCanvas();
    const el = this.selectedComp.view.el;
    const rect = el.getBoundingClientRect();
    let info = item.info;
    
    if (isMinUnit) {
      info = item.info.min;
      info.unit = unit.key;
    } else if (isMaxUnit) {
      info = item.info.max;
      info.unit = unit.key;
    } else {
      item.info.unit = unit.key;
    }
    
    switch(unit.key) {
      case UnitKey.px:
        info.value = isColumn ? item.pos.width : item.pos.height;
        break;
      case UnitKey.per:
        info.value = isColumn ? 100 * item.pos.width / rect.width : 100 * item.pos.height / rect.height;
        break;
      case UnitKey.vh:
        const vh = canvas.getWindow().innerHeight;
        info.value = isColumn ? 100 * item.pos.width / vh : 100 * item.pos.height / vh;
        break;
      case UnitKey.vw:
        const vw = canvas.getWindow().innerWidth;
        info.value = isColumn ? 100 * item.pos.width / vw : 100 * item.pos.height / vw;
        break;
      case UnitKey.fr:
        info.value = this.convertFRValue(item, index, isColumn);
        break;
      case UnitKey.minC:
      case UnitKey.maxC:
      case UnitKey.auto:
        info.value = '';
        break;
      case UnitKey.minMax: 
        item.info.min = {
          unit: 'px',
          value: isColumn ? item.pos.width : item.pos.height
        };
        item.info.max = {
          unit: 'max-content',
          value: ''
        };
        break;
      default:
        break;
    }
    if (isColumn) {
      this.columns[index] = item;
      this.updateGridColumnStyle();
      item = this.columns[index];
    } else {
      this.rows[index] = item;
      this.updateGridRowStyle();
      item = this.rows[index];
    }
    
    this.detectChanges();
  }

  /**
   * convert fr value
   * @param item 
   * @param index 
   * @param isColumn 
   * @returns 
   */
  convertFRValue(item: any, index: number, isColumn: boolean = true) {
    if (isColumn) {
      let totalWidth = 0;
      let totalFr = 0;
      for (let i=0; i < this.columns.length; i++) {
        const col = this.columns[i];
        if (i === index || col.info.unit != 'fr') {
          continue;
        }
        totalWidth += col.pos.width;
        totalFr += parseFloat(col.value);
      }
      if (!totalFr || !totalWidth) {
        return 1;
      }
      // console.log('convertFRValue index = ', index, ' totalWidth=', totalWidth, ' totalFr=', totalFr);
      return totalFr * item.pos.width / totalWidth ;
    }

    let totalHeight = 0;
    let totalFr = 0;
    for (let i=0; i < this.rows.length; i++) {
      const row = this.rows[i];
      if (i === index || row.info.unit != 'fr') {
        continue;
      }
      totalHeight += row.pos.height;
      totalFr += parseFloat(row.value);
    }
    if (!totalFr || !totalHeight) {
      return 1;
    }
    // console.log('convertFRValue index = ', index, ' totalWidth=', totalWidth, ' totalFr=', totalFr);
    return totalFr * item.pos.height / totalHeight ;
  }

  updateGridColumnStyle() {
    let gridCol = '';
    for (let i=0; i < this.columns.length; i++) {
      const col = this.columns[i].info;
      const unit = col.unit;
      let _style = '';
      switch(unit) {
        case UnitKey.px:
        case UnitKey.fr:
        case UnitKey.per:
        case UnitKey.vh:
        case UnitKey.vw:
          _style = `${col.value}${col.unit}`;
          break;
        case UnitKey.auto:
        case UnitKey.maxC:
        case UnitKey.minC:
          _style = `${col.unit}`;
          break;
        case UnitKey.minMax:
          _style = `minmax(${col.min.value}${col.min.unit},${col.max.value}${col.max.unit})`;
          break;
        default:
          break;
      };
      gridCol = `${gridCol} ${_style}`;
    }
    console.log('gridCol=', gridCol);
    this.setStyle(gridCol, 'grid-template-columns');
    // GLOBAL.editor.updateSelectedComp();
    this.setGridInfo();

    this.updateSelectedComp();
  }

  updateGridRowStyle() {
    let gridRow = '';
    console.log('this.grid:', this.rows);
    for (let i=0; i < this.rows.length; i++) {
      const row = this.rows[i].info;
      const unit = row.unit;
      let _style = '';
      switch(unit) {
        case UnitKey.px:
        case UnitKey.fr:
        case UnitKey.per:
        case UnitKey.vh:
        case UnitKey.vw:
          _style = `${row.value}${row.unit}`;
          break;
        case UnitKey.auto:
        case UnitKey.maxC:
        case UnitKey.minC:
          _style = `${row.unit}`;
          break;
        case UnitKey.minMax:
          _style = `minmax(${row.min.value}${row.min.unit},${row.max.value}${row.max.unit})`;
          break;
        default:
          break;
      };
      gridRow = `${gridRow} ${_style}`;
    }
    console.log('gridRow=', gridRow);
    this.setStyle(gridRow, 'grid-template-rows');
    this.setGridInfo();

    this.updateSelectedComp();
  }

  insertColumn(selectMenuItem: any, colItem: any, index: number) {
    console.log('handleOnMenuColumnSelect selectMenuItem=', selectMenuItem, ' colItem=', colItem, ' index=', index);
    const newCol: IGridCell = {
      info: {
        value: '1',
        unit: 'fr'
      }
    }
    switch (selectMenuItem.id) {
      case 'left':
        this.columns.splice(index,0, newCol);
        break;
      case 'right':
        this.columns.splice(index + 1,0, newCol);
        break;
      case 'remove':
        this.columns.splice(index,1);
        break;
      default:
        break;
    }

    this.updateGridColumnStyle();
  }

  /**
   * insert row
   * @param selectMenuItem 
   * @param rowItem 
   * @param index 
   */
  insertRow(selectMenuItem: any, rowItem: any, index: number) {
    // console.log('handleOnMenuColumnSelect selectMenuItem=', selectMenuItem, ' colItem=', rowItem, ' index=', index);
    const newRow: IGridCell = {
      info: {
        value: '1',
        unit: 'fr'
      }
    }
    switch (selectMenuItem.id) {
      case 'top':
        this.rows.splice(index,0, newRow);
        break;
      case 'bottom':
        this.rows.splice(index + 1,0, newRow);
        break;
      case 'remove':
        this.rows.splice(index,1);
        break;
      default:
        break;
    }
    this.updateGridRowStyle();
  }

  /**
   * change row gap value
   * @param value 
   */
  changeRowGapValue(value: number) {
    this.rowGap.value = value;
    this.rowGap.valuePx = GLOBAL.unit.convertUnitValueToPixel(value, null, this.rowGap.unit);
    this.setStyle(`${value}${this.rowGap.unit}`, 'row-gap');

    this.updateSelectedComp();
  }

  /**
   * change column gap value
   * @param value 
   */
  changeColGapValue(value: number) {
    this.colGap.value = value;
    this.colGap.valuePx = GLOBAL.unit.convertUnitValueToPixel(value, null, this.colGap.unit);
    this.setStyle(`${value}${this.colGap.unit}`, 'column-gap');

    this.updateSelectedComp();
  }

  /**
   * change row gap unit
   * @param unit 
   */
  changeRowGapUnit(unit: IUnit) {
    const value = GLOBAL.unit.convertPixelValueToUnitValue(this.rowGap.valuePx, null, unit.key);
    this.rowGap.value = value;
    this.rowGap.unit = unit.key;

    this.setStyle(`${value}${this.rowGap.unit}`, 'row-gap');
    this.detectChanges();
  }

  /**
   * change column gap unit
   * @param unit 
   */
  changeColGapUnit(unit: IUnit) {
    const value = GLOBAL.unit.convertPixelValueToUnitValue(this.colGap.valuePx, null, unit.key);
    this.colGap.value = value;
    this.colGap.unit = unit.key;

    this.setStyle(`${value}${this.colGap.unit}`, 'column-gap');
    this.detectChanges();
  }

  updateSelectedComp() {
    GLOBAL.editor.getModel().trigger(EditorConstants.GRID_LAYOUT_CHANGED_EVENT);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }
  
  handleOnColumnToggle(e: any) {
    this.isColumnOpen = !this.isColumnOpen;
    this.detectChanges();
  }

  handleOnRowToggle(e: any) {
    this.isRowOpen = !this.isRowOpen;
    this.detectChanges();
  }

  handleOnMenuColumnSelect(selectMenuItem: any, colItem: any, index: number) {
    this.insertColumn(selectMenuItem, colItem, index);
  }

  handleOnMenuRowSelect(selectMenuItem: any, rowItem: any, index: number) {
    this.insertRow(selectMenuItem, rowItem, index);
  }
  
  handleOnMouseOver(e: any, item: any) {
    //console.log('handleOnMouseOver item=', item);
    this.showOverColumn(item);
  }

  handleOnMouseOut(e: any, item: any) {
    //console.log('handleOnMouseOut item=', item);
    this.hideOverColumn();
  }

  handleOnRowMouseOver(e: any, item: any) {
    //console.log('handleOnMouseOver item=', item);
    this.showOverRow(item);
  }

  handleOnRowMouseOut(e: any, item: any) {
    //console.log('handleOnMouseOut item=', item);
    this.hideOverRow();
  }

  handleOnColumnUnitChange(unit: IUnit, item: any, index: number) {
    this.changeItemUnit(true, unit, item, index);
  }

  handleOnColumnValueChanged(val: number, item: any, index: number) {
    // console.log('handleOnColumnValueChanged val=', val, ' item=', item, ' index=', index);
    this.columns[index].info.value = val;
    this.updateGridColumnStyle();
  }

  handleOnAddColumnButtonClick(e: any) {
    this.columns.push({
      info: {
        value: '1',
        unit: 'fr'
      }
    });
    this.updateGridColumnStyle();
  }

  handleOnChangeColumnMinUnit(unit: IUnit, item: any, index: number) {
    this.changeItemUnit(true, unit, item, index, true);
  }

  handleOnChangeColumnMaxUnit(unit: IUnit, item: any, index: number) {
    this.changeItemUnit(true, unit, item, index, false, true);
  }

  handleOnChangeColumnMinValue(value: number, item: any, index: number) {
    this.columns[index].info.min.value = value;
    this.updateGridColumnStyle();
    item = this.columns[index];
    this.detectChanges();
  }

  handleOnChangeColumnMaxValue(value: number, item: any, index: number) {
    this.columns[index].info.max.value = value;
    this.updateGridColumnStyle();
    this.detectChanges();
  }


  /**
   * handle unit row change
   * @param unit 
   * @param item 
   * @param index 
   */
  handleOnRowUnitChange(unit: IUnit, item: any, index: number) {
    this.changeItemUnit(false, unit, item, index);
  }

  handleOnRowValueChanged(val: number, item: any, index: number) {
    // console.log('handleOnColumnValueChanged val=', val, ' item=', item, ' index=', index);
    this.rows[index].info.value = val;
    this.updateGridRowStyle();
  }

  handleOnAddRowButtonClick(e: any) {
    this.rows.push({
      info: {
        value: '1',
        unit: 'fr'
      }
    });
    this.updateGridRowStyle();
  }

  handleOnChangeRowMinUnit(unit: IUnit, item: any, index: number) {
    this.changeItemUnit(false, unit, item, index, true);
  }

  handleOnChangeRowMaxUnit(unit: IUnit, item: any, index: number) {
    this.changeItemUnit(false, unit, item, index, false, true);
  }

  handleOnChangeRowMinValue(value: number, item: any, index: number) {
    this.rows[index].info.min.value = value;
    this.updateGridRowStyle();
    item = this.rows[index];
    this.detectChanges();
  }

  handleOnChangeRowMaxValue(value: number, item: any, index: number) {
    this.rows[index].info.max.value = value;
    this.updateGridRowStyle();
    this.detectChanges();
  }

  override handleOnCompUndo = () => {
    this.setValue();
  }

  handleOnRowGapValueChanged(value: number){
    this.changeRowGapValue(value);
  }

  handleOnColGapValueChanged(value: number) {
    this.changeColGapValue(value);
  }

  handleOnRowGapUnitChange(unit: IUnit) {
    this.changeRowGapUnit(unit);
  }

  handleOnColumnGapUnitChange(unit: IUnit) {
    this.changeColGapUnit(unit);
  }

  handleOnSelectedCompUpdated = () => {
    this.setValue();
  }


}
