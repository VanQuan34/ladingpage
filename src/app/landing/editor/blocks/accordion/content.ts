import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoAccordionContentBlock {
  constructor() {
  }

  static getBlock() {
    const newUid: string = `${uid()}`;
    const blockItem: IBlock = this.getBlockItem(newUid);
    return blockItem;
  }

  /**
   * get block item
   * @param newUid
   * @returns 
   */
  static getBlockItem(newUid: string): IBlock {
    const blockItem: IBlock = {
      id: `comp-${newUid}`,
      width: {
        isEnable: false,
        value: '',
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      minWidth: {
        isEnable: false,
        value: '',
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxWidth: {
        isEnable: false,
        value: '',
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      height: {
        isEnable: true,
        value: 'auto',
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      minHeight: {
        isEnable: true,
        value: '200',
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },

      maxHeight: { isEnable: false, unit: 'none' },
      content :  null,
      dragContent: {
        content: '',
        width: '300px',
        height: '200px'
      }
    };
    
    return blockItem;
  }
}

export {
  MoAccordionContentBlock
}