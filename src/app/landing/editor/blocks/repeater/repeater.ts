import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoRepeaterBlock {
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
        value: 300,
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxWidth: {
        isEnable: true,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      height: {
        isEnable: false,
        value: '',
        unit: 'auto'
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
        height: '200px'
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
    const itemUid: string = `${uid()}`;
    const item1Id = `comp-${itemUid}__${uid()}`;
    const item2Id = `comp-${itemUid}__${uid()}`;
    const item3Id = `comp-${itemUid}__${uid()}`;

    blockItem.content = {
      style: `
        #${id} {
          height: auto;
          width: 50%;
          display: grid;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          overflow: hidden;
          --rd: 0px 0px 0px 0px;
          --trans1: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
          --shd: none;
          --horizontalPadding: 0px;
          --verticalPadding: 0px;
          --trans2: color 0.4s ease 0s;
          --txt: var(--c11);
          --bg: rgba(var(--c11) ,1);
          --bgh: rgba(var(--c22) ,1);
          --brd: var(--c15);
          --brw: 0px;
          --label-align: center;
          --theme-font: font-8;
          --display: flex;
          --ds: card;
          --row-gap: 8px;
          --column-gap: 8px;
          --flex-wrap: wrap;
          --number-in-row: 3;
          --on-number: false;
          --flex-direction: row;
          --fl-direction-slide: row;
          --justify-content: center;
          --width: calc(((33.33% - ((0px + 0px) + 5px)) - 1px));
          --on-scroll: false;
          --gr-tpl-columns: repeat(auto-fit, minmax(300px,1fr));
          --gr-auto-rows: minmax(300px, auto);
          --on-balance: false;
          --min-width: 300px;
          --min-height: 300px;
          --overflow-x: hidden;
          --overflow-y: hidden;
          --scrollbar-width: none;
          border-radius: var(--rd,5px);
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          box-shadow: var(--shd);
          background: var(--bg);
        }

        .mo-comp-bg {
          background-color: rgba(var(--bg,var(--c11)),var(--alpha-bg,1));
          background-image: var(--bg-grd);
          border: solid rgba(var(--brd,var(--c11)),var(--alpha-brd,1)) var(--brw,0);
        }

        .mo-comp-bg-full {
          position: absolute;
          top: 0px;
          bottom: 0px;
          right: 0px;
          left: 0px;
        }

       #${id} .mo-repeater-item-container {
          position: relative;
          row-gap: var(--row-gap);
          column-gap: var(--column-gap);
          display: var(--display);
          flex-direction: var(--flex-direction);
          justify-content: var(--justify-content);
          flex-wrap: var(--flex-wrap);
          grid-template-columns: var(--gr-tpl-columns);
          grid-auto-rows: var(--gr-auto-rows);
          overflow-x: var(--overflow-x);
          overflow-y: var(--overflow-y);
          scrollbar-width: var(--scrollbar-width);
        }
        .mo-repeater-item-container::-webkit-scrollbar{
          background: rgb(238 232 232);
        }
        #${id} .mo-repeater-item-container::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background: #c1c1c1;
          box-shadow: inset 1px 1px 2px 0 rgb(78 78 78 / 30%);
        }
        #${id} .mo-repeater-item-container::-webkit-scrollbar-track {
          border-radius: 0;
          background: rgba(78, 78, 78, 0);
        }

        [id^="comp-${itemUid}__"] {
          --brw: 0px;
          --brd: var(--c13);
          --bg: rgba(var(--c12) ,1);
          --rd: 0px 0px 0px 0px;
          --shd: none;
          min-height: 300px;
          height: auto;
          min-width: 0px;
          width: var(--width);
          position: relative;
          margin-left: 0px;
          margin-right: 0px;
          margin-top: 0px;
          margin-bottom: 0px;
          flex-basis: auto;
          flex-grow: 0;
          flex-shrink: 0;
          box-sizing: border-box;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          background: var(--bg);
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          box-shadow: var(--shd);
          border-radius: var(--rd,5px);
        }

        .mo-comp-not-move {
          cursor: default !important;
        }
      `,
      html: ` 
        <div id="${id}" mo-type="repeater"  class="mo-comp mo-comp-bg mo-comp-container">
          <div class="mo-repeater-item-container">
            <div id="${item1Id}" mo-type="repeater-item" draggable="false" resizable="false" class="mo-comp-container mo-comp-not-move">
              <div class="mo-comp-bg-full"></div>
            </div>
            <div id="${item2Id}" mo-type="repeater-item" draggable="false" resizable="false" class="mo-comp-container mo-comp-not-move">
              <div class="mo-comp-bg-full"></div>
            </div>
            <div id="${item3Id}" mo-type="repeater-item" draggable="false" resizable="false" class="mo-comp-container mo-comp-not-move">
              <div class="mo-comp-bg-full"></div>
            </div>
          </div>
        </div>
      `,
      ids: [
        id, item1Id, item2Id, item3Id
      ]
      //removable="false"
    };
    
    // drag content 
    blockItem.dragContent.content = ``;
  }
}

export {
  MoRepeaterBlock 
}