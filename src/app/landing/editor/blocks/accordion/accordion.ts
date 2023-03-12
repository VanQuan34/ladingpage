import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoAccordionBlock {
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
        value: 'auto',
        unit: 'none',
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
    const item1Id = `comp-${itemUid}__${uid()}`;
    const accordId = `item_${uid()}`;

    blockItem.content = {
      style: `
        #${id} {
          height: auto;
          width: 50%;
          display: grid;
          overflow: hidden;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          --rd: 0px 0px 0px 0px;
          --trans1: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
          --shd: none;
          --horizontalPadding: 20px;
          --verticalPadding: 10px;
          --trans2: color 0.4s ease 0s;
          --txt: var(--c11);
          --bg: rgba(var(--c11) ,0);
          --bgh: rgba(var(--c15) ,1);
          --brd: var(--c15);
          --brw: 0px;
          --bgh-title: rgba(var(--c12) ,1);
          --bg-title: rgba(var(--c12) ,1);
          --label-align: center;
          --txt-theme: --font-8;
          --theme-font: font-8;
          --margin-bottom: 15px;
          --mt: 0px;
          --ml: 0px;
          --mr: 0px;
          --mb: 10px;
          --display: top;
          --direction: ltr;
          --order: 0;
          --show-icon: true;
          --size-icon: 25px;
          --color-icon: rgba(var(--c15), 1);
          border-radius: var(--rd,5px);
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          box-shadow: var(--shd);
          background: var(--bg);
        }

        [id^="comp-${itemUid}__"] {
          --brw: 0px;
          --brd: var(--c13);
          --bg: rgba(var(--c12) , 1);
          --rd: 0px 0px 0px 0px;
          --shd: none;
          --alpha-brd: 0;
          --alpha-bg: 1;
          --boxShadowToggleOn-shd: none;
          --shc-mutated-brightness: 116,117,119;
          --height-title: 55px;
          // height: calc(100% - var(--height-title));
          min-height: 200px;
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
          background: var(--bg);
        }
        
        .mo-accordion-container {
          display: flex;
          flex-direction: column;
        }
        
        .mo-comp-not-move {
          cursor: default !important;
        }
        .mo-accordion-container input[type="checkbox"]{
          display: none;
        }
        .mo-accordion-container [name="accordion"]:checked ~ .accordion-title .open {
          display: none;
      }
        .mo-accordion-container .accordion-title{
            text-decoration: none;
            cursor: pointer; 
            max-width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: var(--verticalPadding,0);
            padding-left: var(--horizontalPadding,0);
            padding-right: var(--horizontalPadding,0);
            padding-top: var(--verticalPadding,0);
            margin-top: var(--mt);
            margin-right: var(--mr);
            margin-bottom: var(--mb);
            margin-left: var(--ml);    
          }
          .mo-accordion-container [name="accordion"]:not(:checked) ~ .mo-accordion-content{
            visibility: hidden;
            opacity:0;
          }
        .mo-accordion-container [name="accordion"]:checked ~ .mo-accordion-content{
          visibility: visible;
          opacity: 1;
          z-index: 999; 
        }

        .mo-accordion-container [name="accordion"]:not(:checked) ~ .accordion-title .close {
          display: none;
        }

        .mo-accordion-container [name="accordion"]:checked ~ .accordion-title .open {
          display: none;
        }

        #${id} .mo-accordion-container [name="accordion"] + .accordion-title{
          background: var(--bg-title);
          color: rgba(var(--c15), 1);
          font: var(--font-8);
        }

        #${id} .mo-accordion-container [name="accordion"]:checked + .accordion-title{
          background: var(--bgh-title);
          color: rgba(var(--c15), 1);
          font: var(--font-8);
        }
        .mo-accordion-container .icon-toggle {
          display: flex;
        }
        #${id} .icon-toggle svg{
          width: var(--size-icon);
        }
        
        #${id} .icon-toggle svg path{
          fill: var(--color-icon);
        }

        #${id} .head-title{
          order: var(--order);
        }

        #${id} .mo-accordion-container{
          cursor: pointer;
        }
      `,
      html: ` 
        <div id="${id}" mo-type="accordion" class="mo-comp mo-comp-bg mo-comp-container">
          <div class="mo-accordion-container">
              <input type="checkbox" id="${accordId}" name="accordion" checked>
              <label class="accordion-title" for="${accordId}">
                <div class="head-title">Accordion Item# </div>
                <div class="icon-toggle">
                <svg class="open" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 24 24" class="" fill="#000"> <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path></svg>
                <svg class="close" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 24 24" class="" fill="#000"> <path d="M19,13H5V11H19V13Z"></path></svg>
                </div>
              </label> 
              <div id="${item1Id}" removable="false" draggable="false" resizable="false" class="mo-accordion-content mo-comp-container mo-comp-not-move" mo-type="accordion-content" data-mo-type="default"> 
              </div>
          </div>
        </div>
      `,
      ids: [
        id, item1Id,
      ]
    };
    
    // drag content 
    blockItem.dragContent.content = ``;
  }
}

export {
  MoAccordionBlock 
}