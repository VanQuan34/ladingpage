
import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import { IGridArea, IGridCell, IGridInfo } from 'src/app/utils/gridLayoutUtil';
import { UnitKey } from 'src/app/utils/unitUtil';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { EditorConstants } from '../../../constants';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../inspector/base.component';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-row_col',
  templateUrl: './row_col.component.html',
  styleUrls: ['./row_col.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarRowColComponent extends MoLandingEditorInspectorBaseComponent {
  
  override selectedComp: DomComponent;
  rowItems: {
    id: string;
    value: number;
  }[] = [];
  colItems: {
    id: string;
    value: number;
  }[] = [];

  selectedRowId: string = '1';
  selectedColId: string = '1';

  rows: IGridCell[] = [];
  cols: IGridCell[] = [];

  override onInit() {
    for (let i=0; i < 25; i ++) {
      const item = {
        id: `${i + 1}`,
        value: i + 1
      }
      this.rowItems.push(item);
      this.colItems.push(item);
    }
    this.selectedComp = GLOBAL.editor.getSelected();
    GLOBAL.editor.getEditor().on(EditorConstants.GRID_LAYOUT_CHANGED_EVENT, this.handleOnGridLayoutChanged);
  }

  override onAfterViewInit() {
    this.setGridInfo();
  };
  

  override onDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.GRID_LAYOUT_CHANGED_EVENT, this.handleOnGridLayoutChanged);
  }

  setGridInfo() {
    const gridInfo: IGridInfo = this.selectedComp.get('grid-info');
    if (!gridInfo) {
      this.detectChanges();
      return;
    }
    this.cols = gridInfo.cols;
    this.rows = gridInfo.rows;
    this.selectedRowId = `${this.rows.length}`;
    this.selectedColId = `${this.cols.length}`;

    this.detectChanges();
  }

  /**
   * change grid columns number
   * @param colNumber 
   */
  changeGridColumnNumber(colNumber: number) {
    const colLength = this.cols.length;
    if (colLength > colNumber) {
      this.cols = this.cols.splice(0, colNumber);
    } else {
      for(let i= 0; i < colNumber - colLength; i++) {
        const newCol: IGridCell = {
          info: {
            value: '1',
            unit: 'fr'
          }
        }
        this.cols.push(newCol);
      }
    }
    this.selectedColId = `${this.cols.length}`;
    this.updateGridColumnStyle();
  }

  /**
   * change grid row number
   * @param rowNumber 
   */
  changeGridRowNumber(rowNumber: number) {
    const rowsLength = this.rows.length;
    if (rowsLength > rowNumber) {
      this.rows = this.rows.splice(0, rowNumber);
    } else {
      for(let i= 0; i < rowNumber - rowsLength; i++) {
        const newRow: IGridCell = {
          info: {
            value: '1',
            unit: 'fr'
          }
        }
        this.rows.push(newRow);
      }
    }
    this.selectedRowId = `${this.rows.length}`;
    this.detectChanges();
    console.log('changeGridRowNumber rowNumber=', rowNumber, ' rows length=', this.rows);
    this.updateGridRowStyle();
  }

  /**
   * update grid column style
   */
  updateGridColumnStyle() {
    let gridCol = '';
    for (let i=0; i < this.cols.length; i++) {
      const col = this.cols[i].info;
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
    // this.setGridInfo();

    this.updateSelectedComp();
  }

  /**
   * update grid row style
   */
  updateGridRowStyle() {
    let gridRow = '';
    console.log('updateGridRowStyle rows=', this.rows);
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

    this.updateSelectedComp();
  }

  /**
   * update select comp
   */
  updateSelectedComp() {
    GLOBAL.editor.getModel().trigger(EditorConstants.GRID_LAYOUT_CHANGED_EVENT);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }

  handleOnRowChanged(item: any){
    const rowNumber = item.value;
    this.changeGridRowNumber(rowNumber);
  }

  handleOnColChanged(item: any){
    const colNumber = item.value;
    this.changeGridColumnNumber(colNumber);
  }

  handleOnGridLayoutChanged = () => {
    setTimeout(() => {
      this.setGridInfo();
    }, 100);
  }

}
