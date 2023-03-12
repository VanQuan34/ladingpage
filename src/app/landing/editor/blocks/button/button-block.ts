import { uid } from 'uid';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoButtonBlock {
  constructor() {

  }

  static getBlock(width: string| number = '142', unit: string = 'px', content: string ='Bắt đầu', borderRadius: number = 999) {
    const newId: string = `b${uid()}`;
    const blockItem: IBlock = this.getBlockItem(newId, width, unit);
    
    this.setBlockContent(blockItem, newId, width, unit, content, borderRadius);

    return blockItem;
  }

  /**
   * get block item
   * @param newId
   * @returns 
   */
  static getBlockItem(newId: string,width: string | number, unit: string ): IBlock {
    const blockItem: IBlock = {
      id: newId,
      width: {
        isEnable: true,
        value: width,
        unit: unit,
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
        isEnable: false,
        value: '',
        unit: 'auto'
      },
      minHeight: {
        isEnable: true,
        value: 46,
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxHeight: { isEnable: false, unit: 'none' },
      content :  null,
      dragContent: {
        content: '',
        width: '142px',
        height: '46px'
      }
    };

    return blockItem;
  }
  // repeat padding-box border-box 0% 0% / auto auto scroll radial-gradient(circle at 17% 51%, rgba(var(--c11) , 0.9) 0%, rgba(180, 90, 211, 0.9) 16%, rgba(145, 133, 122, 0.9) 100%), repeat padding-box border-box 0% / auto scroll linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), repeat padding-box border-box 0% 0% / auto auto scroll linear-gradient(90deg, rgba(149, 158, 229, 0.9) 0%, rgba(237, 69, 160, 0.9) 27%, rgba(85, 99, 66, 0.9) 55%, rgba(146, 139, 149, 0.9) 84%, rgba(145, 133, 122, 0.9) 100%); 
  /**
   * set block content
   * @param blockItem 
   * @param newId 
   */
  static setBlockContent(blockItem: IBlock, newId: string, width: string | number, unit: string, content: string, brd: number) {
    blockItem.content =  {
      style: `
        #${newId} {
          height: auto;
          width: ${width}${unit};
          min-height: 46px;
          
          --txt-theme: --font-8;

          --trans1: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
          --horizontalPadding: 0px;
          --verticalPadding: 0px;
          --trans2: color 0.4s ease 0s;
          --txt: var(--c11);
          
          --label-align: center;
          --theme-font: font-8;
          --margin-left: 0px;
          --margin-right: 0px;
          
          --bg: rgba(var(--c15) ,1);
          --bgh: rgba(var(--c22) ,1);
          --rd: ${brd}px ${brd}px ${brd}px ${brd}px;
          --shd: none;
          --boxShadowToggleOn-shd: none;

          border-radius: var(--rd,5px);
          background: var(--bg);
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          box-shadow: var(--shd);
          transition: var(--trans1);
        }

        .mo-content-inner {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          justify-content: var(--label-align);
          min-width: 100%;
          text-align: initial;
          width: -moz-max-content;
          width: max-content;
          cursor: pointer;
          padding-bottom: var(--verticalPadding,0);
          padding-left: var(--horizontalPadding,0);
          padding-right: var(--horizontalPadding,0);
          padding-top: var(--verticalPadding,0);
          position: relative;
          text-decoration: none;
        }

        .mo-content-inner:before {
          align-self: stretch;
          content: "";
          width: var(--margin-left);
        }

        .mo-content-inner:after{
          align-self: stretch;
          content: "";
          width: var(--margin-right);
        }

        #${newId}[data-preview="hover"] {
          background: var(--bgh);
          border-style: var(--brs_h);
          border-color: var(--brc_h);
        }

        #${newId} .mo-button-text {
          color: rgba(var(--c11), 1);
          font: var(--font-8)
        }
      
      `,
      html: `
        <div id="${newId}" role="button" mo-type="button" class="mo-comp" aria-disabled="false">
          <div class="mo-content-inner">
            <span class="mo-button-text">${content}</span>
          </div>
        </div>
      `,
      ids: [newId]
    };
    
    // drag content 
    blockItem.dragContent.content = ``;
  }

  static appendToForm(formComp: any, config: any){
    const attrs = formComp.getAttributes();
    if(attrs['mo-type'] !== 'form'){
      return;
    }
    let button: IBlock = this.getBlock(config.width, config.unit, config.content, config.borderRadius);

    if(!button){
      return;
    }
    let htmlFieldInput = GLOBAL.compUtil.convertCompHtml(button.content, formComp);
    const comps: DomComponent[] = GLOBAL.compUtil.appendToContainer(htmlFieldInput, formComp)
    const styleId = GLOBAL.compUtil.getStyleCompId(comps[0]);
    const styles = GLOBAL.editor.getStyles(styleId);

    styles['margin-left'] = '0px';
    styles['margin-top'] = '0px';
    styles['margin-bottom'] = '0px';
    styles['margin-right'] = '0px';
    styles['align-self'] = 'start';
    styles['justify-self'] = 'start';
    styles['grid-row-start'] = config.gridRowStart;
    styles['grid-row-end'] = config.gridRowEnd;
    styles['grid-column-start'] = config.gridColStart;
    styles['grid-column-end'] = config.gridColEnd;

    GLOBAL.editor.setStyles(styleId, styles);
  }
}



export {
  MoButtonBlock
}