
import { DomComponent, GLOBAL } from '../landing/editor/editor-wrapper';
import { IGridArea } from './gridLayoutUtil';

const enum UnitKey {
  px = 'px',
  per = '%',
  vh = 'vh',
  vw = 'vw',
  minC = 'min-content',
  maxC = 'max-content',
  minMax = 'minmax',
  none = 'none',
  auto = 'auto',
  fr = 'fr',
  line = 'line'
};

interface IUnit {
  key: UnitKey,
  value: string,
  label: string,
  title: string
}

const Units: any = {
  'px': {
    key: 'px',
    value: 'px',
    label: 'px',
    title: 'Pixel(px)',
  },

  '%': {
    key: '%',
    value: '%',
    label: '%',
    title: 'Phần trăm(%)'
  },

  'vh': {
    key: 'vh',
    value: 'vh',
    label: 'vh',
    title: 'Chiều cao cổng nhìn(vh)'
  },

  'vw': {
    key: 'vw',
    value: 'vw',
    label: 'vw',
    title: 'Chiều rộng cổng nhìn(vw)'
  },

  'min-content': {
    key: 'min-content',
    label: 'min-c',
    value: 'min-content',
    title: 'Nội dung tối thiểu(min-c)'
  },

  'max-content': {
    key: 'max-content',
    label: 'max-c',
    value: 'max-content',
    title: 'Nội dung tối đa(max-c)'
  },

  'minmax': {
    key: 'minmax',
    label: 'minmax',
    value: 'minmax',
    title: 'Tối thiểu / Tối đa'
  },

  'fr': {
    key: 'fr',
    label: 'fr',
    value: 'fr',
    title: 'Phân số(fr)'
  },

  'auto': {
    key: 'auto',
    label: 'Tự động',
    value: 'auto',
    title: 'Tự động'
  },

  'none': {
    key: 'none',
    label: 'Không',
    value: 'none',
    title: 'Không'
  },

  'line' : {
    key: 'divider',
    label: 'Không',
    value: 'none',
    title: 'Không'
  }
}

interface IUnitInfoItem {
  value: any,
  unit: string
}
interface IUnitInfo {
  value: any,
  valuePx?: number,
  unit: string,
  min?: IUnitInfoItem,
  max?: IUnitInfoItem
}

class UnitUtil {
  constructor() {

  }

  getUnits = (keys: string[]) => {
    const units: any[] = [];
    for (let i=0; i < keys.length; i++) {
      units.push(Units[keys[i]]);
    }
    return units;
  }
  
  getSizeUnits = () => {
    const units: any[] = [];
    units.push(Units[UnitKey.px]);
    units.push(Units[UnitKey.per]);
    units.push(Units[UnitKey.vh]);
    units.push(Units[UnitKey.vw]);
    units.push(Units[UnitKey.auto]);
  
    return units;
  }
  
  getLayoutUnits = (ignoreMinMax: boolean = false) => {
    const units: any[] = [];
    units.push(Units[UnitKey.px]);
    units.push(Units[UnitKey.fr]);
    units.push(Units[UnitKey.per]);
    units.push(Units[UnitKey.auto]);
    units.push(Units[UnitKey.vh]);
    units.push(Units[UnitKey.vw]);
    units.push(Units[UnitKey.minC]);
    units.push(Units[UnitKey.maxC]);
  
    if (!ignoreMinMax) {
      units.push(Units[UnitKey.minMax]);
    }
    return units;
  }

  getGridGapUnits = () => {
    const units: any[] = [];
    units.push(Units[UnitKey.px]);
    units.push(Units[UnitKey.vh]);
    units.push(Units[UnitKey.vw]);
    return units;
  }

  getPaddingUnits = () => {
    const units: any[] = [];
    units.push(Units[UnitKey.px]);
    // units.push(Units[UnitKey.per]);
    units.push(Units[UnitKey.vh]);
    units.push(Units[UnitKey.vw]);
  
    return units;
  }
  
  parseUnit = (value: string): string => {
    if (!value) {
      return null;
    }
    if (value.includes('minmax')) {
      return 'minmax';
    }
    let unitKey = '';
    for (let key in Units) {
      const unit = Units[key];
      if (value.includes(unit.value)) {
        unitKey = unit.value;
        break;
      }
    }
    return unitKey;
  }
  
  /**
   * parse unit info
   * @param value 
   * @returns IUnitInfo
   */
  parseUnitInfo = (value: string): IUnitInfo => {
    const valueInfo: IUnitInfo = {
      unit: 'px',
      value: '0',
      valuePx: 0
    }
    if (!value) {
      return valueInfo;
    }
    const unit = this.parseUnit(value);
    valueInfo.unit = unit;

    if (unit === 'minmax') {
      value = value.replace('minmax(', '');
      value = value.replace(')','');
      const arr = value && value.split(',');
      if (arr.length > 1) {
        valueInfo.min = this.parseUnitInfo(arr[0].trim());
        valueInfo.max = this.parseUnitInfo(arr[1].trim());
      }
      
      return valueInfo;
    }
  
    switch(unit) {
      case 'min-content':
      case 'max-content':
      case 'auto':
        valueInfo.value = '';
        break;
      default:
        valueInfo.value = parseFloat(value);
        break;
    }
  
    return valueInfo;
  }
  
  getValueSize = (inputValue: string, unit: UnitKey) => {
    let value: string = '';
    const unitItem = Units[unit];
    inputValue = unitItem && inputValue && inputValue.replace(unitItem.value, '');
    // if (!inputValue) {
    //   return value;
    // }
    switch (unit) {
      case UnitKey.px:
      case UnitKey.fr:
      case UnitKey.vh:
      case UnitKey.vw:
      case UnitKey.per:
        value = inputValue;
        break;
      case UnitKey.auto:
        value = '';
        break;
      default:
        break;
    }
    // console.log('getValueSize inputValue=', inputValue, ' value=', value);
    return value;
  }
  
  convertToFloatValue = (inputValue: string, numberToFixed: number = 1) => {
    inputValue = `${inputValue}`;
    if (!numberToFixed) {
      return parseFloat(inputValue).toFixed(0); 
    }
    const arrNum = inputValue.split('.');
    if (arrNum.length < 2) {
      return parseFloat(inputValue);
    }
    // console.log('convertToFloatValue arrNum=',arrNum, ' length=', arrNum[1].length);
    if (arrNum[1] && arrNum[1].length > 1) {
      return parseFloat(inputValue).toFixed(numberToFixed);
    }
    return parseFloat(inputValue);
  }
  
  /**
   * get size by unit
   * @param comp 
   * @param container 
   * @param unit 
   */
  getSizeByUnit = (comp: DomComponent, unit: any, isHorSize: boolean = true) => {
    const canvas = GLOBAL.editor.getCanvas();
    const compRect: DOMRect = comp.view.el.getBoundingClientRect();
    let gridArea: IGridArea;
    const container = GLOBAL.compUtil.getContainer(comp);
    if (container) {
      gridArea = GLOBAL.grid.getGridArea(compRect, container);
    }
    const originSize = isHorSize ? compRect.width : compRect.height;
    const containerSize = gridArea && (isHorSize ? gridArea.width : gridArea.height);
    switch(unit) {
      case UnitKey.px:
        return originSize;
        break;  
      case UnitKey.per:
        if (gridArea) {
          const size = originSize * 100 / containerSize;
          return size;
        }
        break;
      case UnitKey.vw:
        const vw = canvas.getWindow().innerWidth;
        const sizeW = originSize * 100 / vw;
        return sizeW;
      case UnitKey.vh:
        const vh = canvas.getWindow().innerHeight;
        const sizeH = originSize * 100 / vh;
        return sizeH;
      default:
        return '';
    }
    return '';
  }

  /**
   * convert unit value to px value
   * @param originValue 
   * @param containerValue 
   * @param unit 
   * @returns 
   */
  convertUnitValueToPixel = (originValue: number, containerValue: number, unit: string): number => {
    let value = originValue;
    switch(unit) {
      case UnitKey.px:
        return value;
      case UnitKey.per:
        if (containerValue) {
          value = originValue * containerValue / 100;
          return value;
        } 
        return 0;
      case UnitKey.vw:
        const vw = GLOBAL.editor.getIframeWin().innerWidth;
        return originValue * vw / 100 ;
      case UnitKey.vh:
        const vh = GLOBAL.editor.getIframeWin().innerHeight;
        return originValue * vh / 100 ;
      default:
        return value;
    }
  }

  /**
   * convert pixel value to Unit value
   * @param pixelValue 
   * @param containerValue 
   * @param unit 
   * @returns 
   */
  convertPixelValueToUnitValue(pixelValue: number, containerValue: number, unit: string): number {
    switch(unit) {
      case UnitKey.px:
        return pixelValue;
      case UnitKey.per:
        if (containerValue) {
          const size = pixelValue * 100 / containerValue;
          return size;
        } 
        return 0;
      case UnitKey.vw:
        const vw = GLOBAL.editor.getIframeWin().innerWidth;
        return pixelValue * 100 / vw ;
      case UnitKey.vh:
        const vh = GLOBAL.editor.getIframeWin().innerHeight;
        return pixelValue * 100 / vh ;
      default:
        return pixelValue;
    }
  }
}



export {
  IUnit,
  Units,
  UnitKey,
  UnitUtil,
  IUnitInfo
}

