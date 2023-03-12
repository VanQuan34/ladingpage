import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoContainerBlock {
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
        isEnable: true,
        value: '50',
        unit: '%',
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh', 'line', 'max-content'])
      },
      minWidth: {
        isEnable: true,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxWidth: {
        isEnable: false,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      height: {
        isEnable: true,
        value: '',
        unit: 'auto'
      },
      minHeight: {
        isEnable: true,
        value: 300,
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
        width: '300px',
        height: '300px'
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
          width: 50%;
          min-height: 300px;
         
          display: grid;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;

          --bg: rgba(var(--c12) ,1);
          --rd: 0px 0px 0px 0px;
          --shd: none;
          --boxShadowToggleOn-shd: none;

          border-radius: var(--rd);
          background: var(--bg);
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          box-shadow: var(--shd);
        }

      `,
      html: ` 
        <div id="${id}" mo-type="container" class="mo-comp mo-layout-container mo-comp-container">
        </div>
      `,
      ids: [id]
    };
  }
}

export {
  MoContainerBlock 
}