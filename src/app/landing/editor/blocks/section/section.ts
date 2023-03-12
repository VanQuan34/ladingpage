import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoSectionBlock {
  constructor() {

  }

  static getBlock() {
    const newUid: string = `${uid()}`;
    const blockItem: IBlock = this.getBlockItem(newUid);
    this.setBlockContent(blockItem, newUid);
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
        unit: 'auto',
        units: []
      },
      minWidth: {
        isEnable: false,
        value: 0,
        unit: 'none',
        units: []
      },
      maxWidth: {
        isEnable: false,
        value: 0,
        unit: 'none',
        units: []
      },
      height: {
        isEnable: true,
        value: '',
        unit: 'auto',
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh'])
      },
      minHeight: {
        isEnable: true,
        value: 500,
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxHeight: { 
        isEnable: false,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      content :  null,
      dragContent: {
        content: '',
        width: '',
        height: ''
      }
    };

    return blockItem;
  }

  /**
   * set block content
   * @param blockItem 
   * @param uId 
   */
  static setBlockContent(blockItem: IBlock, uId: string) {
    const id = `comp-${uId}`;

    blockItem.content = {
      style: `
        #${id} {
          height: auto;
          width: auto;
          min-height: 500px;
          display: grid;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          --bg: rgba(var(--c11) ,0);
          background: var(--bg);
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
        }

      `,
      html: `
        <section id="${id}" mo-type="section" class="mo-comp mo-comp-container"></section>
      `,
      ids: [id]
    };
  }
}

export {
  MoSectionBlock 
}