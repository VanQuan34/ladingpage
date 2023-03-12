import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoTabsBlock {
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
        isEnable: true,
        value: '350',
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      minHeight: {
        isEnable: false,
        value: '',
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
    const item1Id = `comp-${itemUid}_${uid()}`;
    const item2Id = `comp-${itemUid}_${uid()}`;
    const tab1Id = `item_${uid()}`;
    const tab2Id = `item_${uid()}`;

    blockItem.content = {
      style: `
        #${id} {
          height: 300px;
          width: 50%;
          display: grid;
          overflow: hidden;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          --rd: 25px 25px 25px 25px;
          --trans1: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
          --shd: none;
          --horizontalPadding: 35px;
          --verticalPadding: 10px;
          --trans2: color 0.4s ease 0s;
          --txt: var(--c11);
          --bg: rgba(var(--c11) ,1);
          --bgh: rgba(var(--c15) ,1);
          --brd: var(--c15);
          --brw: 0px;
          --bgh-title: rgba(var(--c12) ,1);
          --bg-title: rgba(var(--c11) ,1);
          --label-align: center;
          --txt-theme: --font-8;
          --theme-font: font-8;
          --margin-bottom: 15px;
          --mt: 0px;
          --ml: 0px;
          --mr: 15px;
          --mb: 10px;
          --display: horizontal;
          --flex-direction: row;
          --w-title: 150px;
          --justify: flex-start;
          box-shadow: var(--shd);
          background: var(--bg);
        }

        ul.mo-tabs-container {
          position: relative;
          display: flex;
          overflow: hidden;
        }

        #${id} .mo-tabs-container{
          flex-direction: var(--flex-direction);
          justify-content: var(--justify);
        }

        [id^="comp-${itemUid}_"]  {
          --brw: 0px;
          --brd: var(--c13);
          --bg: rgba(var(--c12) ,1);
          --rd: 0px 0px 0px 0px;
          --shd: none;
          --alpha-brd: 0;
          --alpha-bg: 1;
          --boxShadowToggleOn-shd: none;
          --shc-mutated-brightness: 116,117,119;
          --height-tabTitle: 55px;
          height: calc(100% - var(--height-tabTitle) );
          min-width: 0px;
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
          box-shadow: var(--shd);
          background: var(--bg);
        }

        .mo-comp-not-move {
          cursor: default !important;
        }
        .mo-tabs-container [name="tab"]{
          position: block;
          position: absolute;
          display: none;
        }
        .mo-tabs-container li {
          float: left;
          display: block;
        }
        #${id} .mo-tabs-container li{
          max-width: var(--w-title);
          margin-right: var(--mr);
        }
        .mo-tabs-container li .label-title{
            text-decoration: none;
            display: inline-block;
            cursor: pointer; 
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            padding-bottom: var(--verticalPadding,0);
            padding-left: var(--horizontalPadding,0);
            padding-right: var(--horizontalPadding,0);
            padding-top: var(--verticalPadding,0);
            border-radius: var(--rd,5px);
            border-width: var(--brw);
            border-style: var(--brs);
            border-color: var(--brc);
            box-shadow: var(--shd);
            margin-top: var(--mt);
            margin-bottom: var(--mb);
            margin-left: var(--ml);    
          }
        
        .mo-tabs-container .mo-tab-content {
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 0;
        }

        [id^="comp-${itemUid}_"] .mo-tab-content{
          top: var(--height-tabTitle);
        }
        
        .mo-tabs-container [name="tab"]:not(:checked) ~ .mo-tab-content{
          visibility: hidden;
          opacity: 0;
        }
        .mo-tabs-container [name="tab"]:checked ~ .mo-tab-content{
          visibility: visible;
          opacity: 1;
        }

        #${id} .mo-tabs-container [name="tab"] + .label-title{
          background: var(--bg-title);
          color: rgba(var(--c15), 1);
          font: var(--font-8);
        }

        #${id} .mo-tabs-container [name="tab"]:checked + .label-title  {
          background: var(--bgh-title);
          color: rgba(var(--c15), 1);
          font: var(--font-8);
          font-size: 16px;
          font-weight: 400;
          line-height: 150%;
          font-family: 'Open Sans', sans-serif;
        }
      `,
      html: ` 
        <div id="${id}" mo-type="tabs" class="mo-comp mo-comp-bg mo-comp-container">
          <ul class="mo-tabs-container">
            <li id="tab-${tab1Id}">
              <input type="radio" id="${tab1Id}" name="tab" checked>
              <label class="label-title" for="${tab1Id}">Tab # </label> 
              <div id="${item1Id}" removable="false" draggable="false" resizable="false" class="mo-tab-content mo-comp-container mo-comp-not-move" mo-type="tab-content" data-mo-type="default"> 
              </div>
            </li>
            <li id="tab-${tab2Id}">
              <input type="radio" id="${tab2Id}" name="tab">
              <label class="label-title" for="${tab2Id}">Tab #2</label>
              <div id="${item2Id}" removable="false" draggable="false" resizable="false" class="mo-tab-content mo-comp-container mo-comp-not-move" mo-type="tab-content" data-mo-type="default"> 
              </div>
            </li>
          </ul>
        </div>
      `,
      ids: [
        id, item1Id, item2Id,
      ]
    };
    
    // drag content 
    blockItem.dragContent.content = ``;
  }
}

export {
  MoTabsBlock 
}