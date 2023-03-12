import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';
import { MoFieldInputBlock } from '../form/field-input';
import { MoTextBlock } from '../text/text-bock';

class MoFormBlock {

  
  
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
        value: '35',
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
        isEnable: true,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      height: {
        isEnable: true,
        value: 396,
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      minHeight: {
        isEnable: false,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },

      maxHeight: { isEnable: false, unit: 'none' },
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
    let fieldInput = MoFieldInputBlock.getBlock();
    let fieldText = MoTextBlock.getBlock(true);

    // console.log('fieldInput:', fieldInput);
    console.log('fieldInput:', fieldText);

    const formId = `comp-${uId}`;
    const itemUid: string = `${uid()}`;
    const titleId = `comp-${itemUid}_${uid()}`;
    const fieldId = `comp-${itemUid}_${uid()}`;
    const field1Id = `comp-${itemUid}_${uid()}`;
    const field2Id = `comp-${itemUid}_${uid()}`;
    const field3Id = `comp-${itemUid}_${uid()}`;
    const field4Id = `comp-${itemUid}_${uid()}`;

    blockItem.content = {
      style: `
      #${formId} .mo-comp {
        position: relative;
      }

      #${formId} {
        width: 35%;
        height: auto;
        background-color: #fff;
        display: block;
        --rd: 0px;
        --shd: none;
        --bg: rgba(var(--c11) ,1);
        --brc: rgba(var(--c11) ,1);
        --brw: 0px;
        --alpha-bg: 1;
        --alpha-brd: 0;
        --boxShadowToggleOn-shd: none;

        background: var(--bg);
        border-width: var(--brw);
        border-style: var(--brs);
        border-color: var(--brc);
        box-shadow: var(--shd);
        border-radius: var(--rd,5px);
        box-sizing: border-box;
        row-gap: 20px;
        column-gap: 20px;
        display: grid;
        grid-template-rows: minmax(70px,max-content) minmax(80px,max-content) minmax(80px,max-content) minmax(80px,max-content) minmax(80px,max-content); 
        grid-template-columns: 1fr 1fr;
      }

 
      `,
      html: ` 
        <div id="${formId}" mo-type="form" class="mo-comp mo-comp-container">
     
        </div>
      `,
      ids: [
        formId
      ]
    };
    
    // drag content 
    blockItem.dragContent.content = ``;
  }

}
export {MoFormBlock};