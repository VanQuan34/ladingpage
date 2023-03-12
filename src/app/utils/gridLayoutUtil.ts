
import { GLOBAL, DomComponent } from '../landing/editor/editor-wrapper';
import { IUnitInfo, UnitUtil } from './unitUtil';

interface IGridGap {
  value: number,
  valuePx: number,
  unit: string
}

interface IGridInfo {
  id: string,
  rows: IGridCell[],
  cols: IGridCell[],
  rowGap: IGridGap,
  colGap: IGridGap,
  rect: DOMRect,
  comp: DomComponent,
  actualH: number,
  actualW: number
}

interface IGridArea {
  top: number,
  left: number,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  width: number,
  height: number,
  grid: IGridInfo,
  container: DomComponent
}

interface IGridCell {
  index?: number,
  info: IUnitInfo,
  pos?: {
    top: number,
    left: number,
    width: number,
    height: number
  },
  value?: string
}

class GridLayoutUtil {
  constructor() {

  }

  /**
   * get gridInfo
   * @param comp 
   * @returns 
   */
  getGridInfo(comp: DomComponent): IGridInfo {
    if (!comp) {
      return null
    }
    let styles = GLOBAL.compUtil.getGridContainerStyles(comp);
    let gridComp = GLOBAL.compUtil.getGridContainer(comp);
    // console.log('styles=', styles, 'gridComp=', gridComp);
    if (!gridComp) {
      return null;
    }
    const columnTemplate = styles['grid-template-columns'];
    const columns = this.parseGridTemplate(columnTemplate);
    const rowTemplate = styles['grid-template-rows'];
    const rows = this.parseGridTemplate(rowTemplate);
    const compRect = gridComp.view.el.getBoundingClientRect();
    const rowLength = rows.length;
    const colLength = columns.length;
    if (!rowLength || !colLength) {
      return {
        id: comp.getId(),
        rows: [],
        cols: [],
        colGap: null,
        rowGap: null,
        rect: compRect,
        comp: gridComp,
        actualH: 0,
        actualW: 0
      };
    }
  
    for (let i=1; i <= rowLength; i++) {
      for (let j=1; j <= colLength; j++) {
        const area = `${i}/${j}/${i}/${j+1}`;
        const cellItem = $(`<div class="mo-temp-grid-item" style="grid-area: ${area}"></div>`);
        gridComp.view.$el.append(cellItem);
   
        if (i==1) {
          columns[j-1].pos = this.getCellItemPos(compRect, cellItem);
        }
  
        if (j === 1) {
          rows[i-1].pos = this.getCellItemPos(compRect, cellItem);;
        }
  
        cellItem.remove();
      }
    }

    const rowGapStyle = styles['row-gap'];
    const colGapStyle = styles['column-gap'];
    let rowGap: IGridGap = {
      value: 0,
      valuePx: 0,
      unit: 'px'
    };
    let colGap: IGridGap = {
      value: 0,
      valuePx: 0,
      unit: 'px'
    }
    if (rowGapStyle) {
      rowGap.unit = GLOBAL.unit.parseUnit(rowGapStyle);
      rowGap.value = parseFloat(rowGapStyle);
      rowGap.valuePx = GLOBAL.unit.convertUnitValueToPixel(rowGap.value, null, rowGap.unit);
    }

    if (colGapStyle) {
      colGap.unit = GLOBAL.unit.parseUnit(colGapStyle);
      colGap.value = parseFloat(colGapStyle);
      colGap.valuePx = GLOBAL.unit.convertUnitValueToPixel(colGap.value, null, colGap.unit);
    }

    let actualW = 0;
    for (let i = 0; i < columns.length ; i++) {
      actualW += columns[i].pos.width;
      if (i < columns.length - 1 ) {
        actualW += colGap.valuePx;
      }
    }

    let actualH = 0;
    for (let i = 0; i < rows.length ; i++) {
      actualH += rows[i].pos.height;
      if (i < rows.length - 1 ) {
        actualH += rowGap.valuePx;
      }
    }
  
    const gridInfo: IGridInfo =  {
      id: comp.getId(),
      rows: rows,
      cols: columns,
      rect: compRect,
      comp: gridComp,
      rowGap: rowGap,
      colGap: colGap,
      actualW: actualW,
      actualH: actualH
    };

    return gridInfo;
  }

  getCellItemPos(containerRect: any, cellItem: any) {
    const cellPos = cellItem.get(0).getBoundingClientRect();
    const pos = {
      top: cellPos.top - containerRect.top,
      left: cellPos.left - containerRect.left,
      width: cellPos.width,
      height: cellPos.height
    }
    return pos;
  }

  /**
   * parse grid template
   * @param rule 
   * @returns 
   */
  parseGridTemplate(rule: string): any[] {
    let units: any[] = [];
    let result;
    let newRule = rule;
    if (!newRule) {
      return [];
    }
    // get minmax unit
    result =  this.getMinMaxUnits(newRule);
    units = [...units, ...result.units];
    newRule = result.newRule;
    // console.log('getCellItem result=', result, ' units=', units);
    // get calc unit
    result =  this.getCalcUnits(newRule);
    units = [...units, ...result.units];
    newRule = result.newRule;
  
    // get other rules
    units = [...units, ...this.getOtherUnits(newRule)];
    let arrUnit: any[] = [];
    let startIndex = 0;
    newRule = rule.trim(); 
    while(newRule) {
      for (let i=0; i < units.length; i++) {
        const unit = units[i];
        const index = newRule.indexOf(unit);
        if (index === 0) {
          newRule = newRule.replace(unit, '').trim();
         // console.log('index = ', i, ' foundIndex = ', index, ' unit = ', unit);
          arrUnit.push({
            index: startIndex,
            value: unit,
            info: GLOBAL.unit.parseUnitInfo(unit)
          });
          startIndex += 1;
          units.splice(i, 1);
          break;
        }
      }
      // console.log('arrUnit=', arrUnit);
    }
    return arrUnit;
  }

  /**
   * get MinMax Unit
   * @param rule 
   * @returns 
   */
  getMinMaxUnits(rule: string) {
    let minmax: any[] = [];
    let newRule = rule;
    const reg = /minmax\([^)]+\)/g;
    let found = true;
    while(found) {
      const minmaxMatch = newRule.match(reg);
      if (minmaxMatch && minmaxMatch.length) {
        found = true;
        minmax = [...minmax, ...minmaxMatch];
      } else {
        found = false;
      }
      newRule = newRule.replace(reg, '');
    }
  
    return {
      units: minmax,
      newRule: newRule
    }
  }
    
  /**
   * get calculate unit
   * @param rule 
   * @returns 
   */
  getCalcUnits(rule: string) {
    let calcUnits: any[] = [];
    let newRule = rule;
    const reg = /calc\([^)]+\)/g;
    let found = true;
    while(found) {
      const calcMatch = newRule.match(reg);
      if (calcMatch && calcMatch.length) {
        found = true;
        calcUnits = [...calcUnits, ...calcMatch];
      } else {
        found = false;
      }
      newRule = newRule.replace(reg, '');
    }
  
    return {
      units: calcUnits,
      newRule: newRule
    }
  }
  
  /**
   * get other unit
   * @param rule 
   * @returns 
   */
  getOtherUnits(rule: string) {
    let otherUnits = [];
    let units = [];
    otherUnits = rule && rule.trim().split(' ');
    if (otherUnits && otherUnits.length) {
      for (let i=0; i < otherUnits.length; i++) {
        const unit = otherUnits[i] && otherUnits[i].trim();
        if (!unit) {
          continue;
        }
        units.push(unit);
      }
    }
    // console.log('getOtherUnits otherUnits=',otherUnits, ' units=', units);
    return units || [];
  }   
  
  /**
   * get grid area
   * @param comp 
   * @param container 
   * @returns IGridArea
   */
  getGridArea(compRect: DOMRect, container: DomComponent, gridInfo: IGridInfo = null): IGridArea {
    // get gridInfo of container
    if (!gridInfo) {
      gridInfo = container && this.getGridInfo(container);
    }
    
    const containerRect = (container && container.view.el.getBoundingClientRect()) || {top: 0, left: 0, width: 0, height: 0};
    //const rect = comp.view.el.getBoundingClientRect();
    
    const top = compRect.top - containerRect.top;
    const left = compRect.left - containerRect.left;
    const right = left + compRect.width;
    const bottom = top + compRect.height;
  
    // console.log('getGridArea gridSize=', gridSize);
    if (!gridInfo || !gridInfo.rows.length || !gridInfo.cols.length) {
      return {
        top: containerRect.top,
        left: containerRect.left,
        startRow: 1,
        endRow: 1,
        startCol: 1,
        endCol: 1,
        width: containerRect.width,
        height: containerRect.height,
        grid: gridInfo,
        container: container
      }
    }
    const fixed = 0.0001;
    const rows = gridInfo.rows;
    const columns = gridInfo.cols;
    let startRow = rows.length;
    let endRow = rows.length;
    for (let i=0; i < rows.length; i++) {
      const row = rows[i];
      const rowTop = row.pos.top;
      if (top < rowTop + row.pos.height && top >= rowTop) {
        startRow = i;
        break;
      }
      if (top < rowTop) {
        startRow = i - 1;
        break;
      }
    }

    for (let i=0; i < rows.length; i++) {
      const row = rows[i];
      const rowTop = row.pos.top;
      if (bottom <= rowTop - gridInfo.rowGap.valuePx + fixed) {
        endRow = i;
        break;
      }
      if (bottom > rowTop - gridInfo.rowGap.valuePx + fixed && bottom <= rowTop) {
        endRow = i + 1;
        break;
      }
    }
  
    let startCol = columns.length;
    let endCol = columns.length;
    for (let i=0; i < columns.length; i++) {
      const column = columns[i];
      const colLeft = column.pos.left;
      // console.log('left=', left, ' colLeft=', colLeft, ' i=', i);
      if (left < colLeft + column.pos.width && left >= colLeft) {
        startCol = i;
        // console.log('startCol 1=', startCol);
        break;
      }
      if (left < colLeft) {
        startCol = i - 1;
        break;
      }
    }
    for (let i=0; i < columns.length; i++) {
      const column = columns[i];
      const colLeft = column.pos.left;
      // console.log('right=', right, ' colLeft=', colLeft + fixed, ' i=', i);
      if (right <= colLeft - gridInfo.colGap.valuePx + fixed) {
        endCol = i;
        break;
      }
      if (right > colLeft - gridInfo.colGap.valuePx + fixed && right < colLeft + fixed) {
        endCol = i + 1;
        break;
      }
    }

    endRow += 1;
    endCol += 1;
    startCol += 1;
    startRow += 1;

    startRow = Math.min(rows.length, Math.max(1, startRow));
    startCol = Math.min(columns.length, Math.max(1, startCol));
    
    // console.log('rows=', rows, ' startRow=', startRow);

    const newArea: IGridArea = {
      top: rows[startRow - 1].pos.top,
      left: columns[startCol - 1].pos.left,
      startRow: startRow,
      endRow: endRow,
      startCol: startCol,
      endCol: endCol,
      grid: gridInfo,
      height: 0,
      width: 0,
      container: container
    };
    
    for (let i = startRow - 1; i < endRow - 1 ; i++) {
      newArea.height += rows[i].pos.height;
      if (i < endRow - 2 ) {
        newArea.height += gridInfo.rowGap.valuePx;
      }
    }

    for (let i = startCol - 1; i < endCol - 1; i++) {
      newArea.width += columns[i].pos.width;
      // console.log('newArea index=', i);
      if (i < endCol - 2 ) {
        newArea.width += gridInfo.colGap.valuePx;
      }
    }
    // console.log('startRow=', startRow, ' endRow=', endRow, ' startCol=', startCol, ' endCol=', endCol, ' newArea=', newArea);
    return newArea;
  }

}

export {
  GridLayoutUtil,
  IGridInfo,
  IGridArea,
  IGridGap,
  IGridCell
}