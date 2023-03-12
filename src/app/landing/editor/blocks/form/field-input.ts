import { DomComponent } from 'src/app/landing/editor/editor-wrapper';
import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoFieldInputBlock {
  constructor() {
  }

  static getBlock(width: string | number = '100', label: string = '', placeHolder: string ='',  multipleLine?: boolean) {
    const newUid: string = `${uid()}`;
    const blockItem: IBlock = this.getBlockItem(newUid, width);
    this.setBlockContent(blockItem, newUid, width, label, placeHolder, multipleLine);
    return blockItem;
  }

  /**
   * get block item
   * @param newUid
   * @returns 
   */
  static getBlockItem(newUid: string, width: string | number): IBlock {
    const blockItem: IBlock = {
      id: `comp-${newUid}`,
      width: {
        isEnable: true,
        value: width,
        unit: '%',
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh', 'line', 'max-content'])
      },
      minWidth: {
        isEnable: false,
        value: 0,
        unit: 'px',
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
        value: 80,
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

  /**
   * set block content
   * @param blockItem 
   * @param uId 
   */
  static setBlockContent(blockItem: IBlock, uId: string, width: string|number, label: string, placeHolder: string , multipleLine: boolean) {
    const itemUid: string = `${uid()}`;
    const fieldId = `comp-${itemUid}_${uid()}`;
    const labelId = `comp-${itemUid}_${uid()}`;
    const inputId = `comp-${itemUid}_${uid()}`;


    blockItem.content = {
      style: `
      #${fieldId}{
        min-height: 80px;
        height: auto;
        width: ${width}%;
        align-self: start;
        justify-self: start;
        position: relative;
        margin-left: 0%;
        margin-right: 0%;
        margin-top: 0px;
        margin-bottom: 0px;
        display: flex;
        flex-direction: column;
        --shd: none;
        --rd: 0px;
        --fnt: italic normal normal 14px/1.4em avenir-lt-w01_35-light1475496,avenir-lt-w05_35-light,sans-serif;
        --brw: 0px 0px 0px 0px;
        --bg: rgba(var(--c11) ,1);
        --txt: var(--color_15);
        --alpha-txt: 1;
        --brd: var(--color_14);
        --txt2: var(--color_12);
        --alpha-txt2: 1;
        --brwh: 0px 0px 2px 0px;
        --bgh: var(--color_16);
        --brdh: var(--color_14);
        --brwf: 0px 0px 2px 0px;
        --bgf: var(--color_16);
        --brdf: var(--color_14);
        --brwe: 0px 0px 2px 0px;
        --bge: 255,64,64;
        --brde: 255,0,0;
        --bgd: 255,255,255;
        --alpha-bgd: 1;
        --txtd: 219,219,219;
        --alpha-txtd: 1;
        --brwd: 1px;
        --brdd: 219,219,219;
        --alpha-brdd: 1;
        --fntlbl: normal normal normal 14px/1.4em avenir-lt-w01_35-light1475496,avenir-lt-w05_35-light,sans-serif;
        --txtlbl: var(--color_14);
        --alpha-txtlbl: 1;
        --txtlblrq: var(--color_15);
        --alpha-txtlblrq: 1;
        --fntprefix: normal normal normal 16px/1.4em helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif;
        --errorTextFont: var(--font_8);
        --errorTextColor: 255,64,64;
        --alpha-errorTextColor: 1;
        --alpha-bgf: 0.4;
        --alpha-bge: 0.1;
        --alpha-brdh: 1;
        --alpha-brd: 0;
        --alpha-bg: 0.6;
        --alpha-bgh: 0.6;
        --alpha-brde: 1;
        --alpha-brdf: 1;
        --boxShadowToggleOn-shd: none;
        --dir: ltr;
        --textAlign: left;
        --textPadding: 3px 3px 3px 15px;
        --labelPadding: 0 20px 0 1px;
        --requiredIndicationDisplay: inline;
        --labelMarginBottom: 8px;
      }
      .mo-label{
        font-size: 11px;
        line-height: 1;
        display: inline-block;
        text-align: start;
        padding-bottom: 10px;

      }
      .mo-field-input{
        display: flex;
        flex: 1;
        flex-direction: column;
        position: relative;
      }

      .mo-input{
        padding: 3px 3px 3px 10px;
        flex: 1;
      }
      `,
      html: 
      multipleLine ? `
      <div id="${fieldId}" mo-type="field-input" class="mo-comp mo-comp-field">
        <div id="${labelId}" class="mo-label">${label}</div>
          <div class="mo-field-input">
            <textarea id="${inputId}" class="mo-input" placeholder="${placeHolder}"></textarea>
        </div>
      </div>`:`
      <div id="${fieldId}" mo-type="field-input" class="mo-comp mo-comp-field">
        <div id="${labelId}" class="mo-label">${label}</div>
          <div class="mo-field-input">
            <input id="${inputId}" class="mo-input" placeholder="${placeHolder}"/>
        </div>
      </div>`,
      ids: [
        fieldId, labelId, inputId
      ]
    }

    blockItem.dragContent.content = ``;
  }

  static appendToForm(formComp: DomComponent, config: any){
    const attrs = formComp.getAttributes();
    if(attrs['mo-type'] !== 'form'){
      return;
    }
    let fieldInput: IBlock = MoFieldInputBlock.getBlock(config.width, config.label, config.placeHolder, config.multipleLine);

    if(!fieldInput){
      return;
    }
    let htmlFieldInput = GLOBAL.compUtil.convertCompHtml(fieldInput.content, formComp);
    console.log('fieldInput:', fieldInput);
    GLOBAL.compUtil.appendToContainer(htmlFieldInput, formComp);

    const comps: DomComponent[] = GLOBAL.compUtil.appendToContainer(htmlFieldInput, formComp)
    const styleId = GLOBAL.compUtil.getStyleCompId(comps[0]);
    const styles = GLOBAL.editor.getStyles(styleId);

    // const fieldContainer = formComp.find('.mo-comp-field')[config.index];
   
    // const id = fieldContainer.getId();
    // const styles = GLOBAL.editor.getStyles(`#${id}`);

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
  MoFieldInputBlock
}