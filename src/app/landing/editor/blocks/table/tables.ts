import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoTableBlock {
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
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh'])
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
          width: 50%;
          min-height: 100px;
          display: grid;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          --bg-grd: none;
          --bg: var(--c11);
          --alpha-bg: 0;
          background-color: rgba(var(--bg,var(--c11)),var(--alpha-bg,1));
          background-image: var(--bg-grd);
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
        }
        .wp-block-table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
        }
        .wp-block-table td, .wp-block-table th {
            border: 1px solid;
            word-break: normal;
            vertical-align: middle;
        }
        .wp-block-table td > div, .wp-block-table th > div {
            padding: 0.5em;
        }

      `,
      html: `
        <div id="${id}" mo-type="table" class="mo-comp mo-comp-container">
        <table class="wp-block-table has-fixed-layout">
        <thead class="thead">
        <tr>
            <th><div class="mo-comp" data-columns="1" resizable="false" draggable="false" removable="false" moveable mo-type="text"><p class="font-8 mo-text" data-mo-type="text" data-highlightable="1">Column1</p></div></th>
            <th><div class="mo-comp" data-columns="2" resizable="false" draggable="false" removable="false" mo-type="text"><p class="font-8 mo-text" data-mo-type="text" data-highlightable="1">Column2</p></div></th>
            <th><div class="mo-comp" data-columns="3" resizable="false" draggable="false" removable="false" mo-type="text"><p class="font-8 mo-text" data-mo-type="text" data-highlightable="1">Column3</p></div></th>
        </tr>
        </thead>
        <tbody class="tbody">
        <tr>
            <td data-columns="1" data-rows="1" style="white-space: pre-wrap; min-width: 1px;">ÁDSDS</td>
            <td data-columns="2" data-rows="1" style="white-space: pre-wrap; min-width: 1px;">﻿</td>
            <td data-columns="3" data-rows="1" style="white-space: pre-wrap; min-width: 1px;">﻿</td>
        </tr>
        <tr>
            <td data-columns="1" data-rows="2" style="white-space: pre-wrap; min-width: 1px;">dsadassad</td>
            <td data-columns="2" data-rows="2" role="textbox" style="white-space: pre-wrap; min-width: 1px;">﻿</td>
            <td data-columns="3" data-rows="2" role="textbox" style="white-space: pre-wrap; min-width: 1px;">﻿</td>
        </tr>
        </tbody>
        </table>
        </div>
      `,
      ids: [id]
    };
  }
}

export {
  MoTableBlock 
}