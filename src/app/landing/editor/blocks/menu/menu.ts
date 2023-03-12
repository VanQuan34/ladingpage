import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoMenuBlock {
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
        value: '60',
        unit: '%',
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh'])
      },
      minWidth: {
        isEnable: true,
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
        isEnable: false,
        value: '',
        unit: 'auto',
        units: []
      },
      minHeight: {
        isEnable: false,
        value: '',
        unit: 'none',
        units: []
      },
      maxHeight: { 
        isEnable: false,
        value: 0,
        unit: 'none',
        units: []
      },
      content :  null,
      dragContent: {
        content: '',
        width: '300px',
        height: '60px'
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
    let liItems = '';
    GLOBAL.landingPage.menus[0].list.forEach(menu => {
      let li = `<li class="menuItem-wrapper">
        <a href="#" class="menuItem">
          <div class="menuItem-container">
            <span class="menuItem-label">${menu.name}</span>
          </div>
        </a>
      </li>
      `;
      liItems = `${liItems }${li}`;
    })

    blockItem.content = {
      style: `
        #${id} {
          height: auto;
          width: 60%;
          display: grid;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;

          --pad: 10px 10px 10px 10px;
          --pad-it: 10px 5px 10px 5px;
          --pad-itw: 0px 4px 0px 4px;
          --txt-theme: --font-7;

          padding: var(--pad);
        }

        ol, li {
          list-style: none;
        }

        .hor-menu {
          width: 100%;
          height: 100%;
          direction: ltr;
          justify-content: center;
          flex-grow: 1;
          display: flex;
        }

        #${id} .hor-menu > .menuItem-wrapper {
          flex-grow: inherit;
          padding: var(--pad-itw);
        }

        #${id} .menuItem-wrapper > .menuItem {
          padding: var(--pad-it);
          display: block;
          text-decoration: none; 
        }

        .menuItem-container {
          align-items: center;
          justify-content: center;
          display: flex;
          flex-grow: 1;
        }

        #${id} .menuItem-label {
          color: rgba(var(--c15), 1);
          font: var(--font-7)
        }

      `,
      html: `
        <div id="${id}" mo-type="menu" class="mo-comp">
          <ul class="hor-menu">
            ${ liItems }
          </ul>
        </div>
      `,
      ids: [id]
    };
  }
}

export {
  MoMenuBlock 
}