import { DomComponent } from 'src/app/landing/editor/editor-wrapper';
import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoTextBlock {
  constructor() {

  }

  static getBlock(isTitle: boolean = false, width: number | string = '50' , classTheme: string = 'font-2', content: string = 'Tiêu đề'){
    const newId: string = `b${uid()}`;
    const blockItem: IBlock = {
      id: newId,
      width: {
        isEnable: true,
        value: width,
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
        isEnable: false,
        value: 40,
        unit: 'auto'
      },
      minHeight: {
        isEnable: false,
        unit: 'none'
      },
      maxHeight: { isEnable: false, unit: 'none' },
      content :  null,
      dragContent: {
        content: '',
        width: '300px',
        height: 'auto'
      }
    };
    if (isTitle) {
      blockItem.content = {
        style: `
          #${newId} {
            height: auto;
            width: ${width}%;
            align-self: start;
            justify-self: start;
            --txt-theme: --${classTheme};
          }

        `,
        html: ` 
          <div id="${newId}" mo-type="text" class="mo-comp mo-comp-text">
            <h2 class="${classTheme} mo-text">${content}</h2>
          </div>
        `,
        ids: [newId]
      };
      // get font 
      const font = GLOBAL.landingPage.theme.fonts.find(item => {
        if (item.class === 'font-2') {
          return true;
        }
        return false;
      });
      // drag content 
      blockItem.dragContent.content = `
          <h2 style="font-family: ${font.style['font-family']};
                      font-size: 70px;
                      color: #ffffff;
                      font-weight: ${font.style['font-weight']};
                      font-style: ${font.style['font-style']};
                      line-height: 150%;">Tiêu đề</h2>`;
      return blockItem;
    }
    blockItem.content = {
      style: `
        #${newId} {
          height: auto;
          width: 50%;
          align-self: start;
          justify-self: start;
          --txt-theme: --font-8;
        }
      `,
      html: `
        <div id="${newId}" mo-type="text" class="mo-comp mo-comp-text">
          <p class="font-8 mo-text">Add paragraph text.
          Click “Edit Text” to customize this theme across your site.
          You can update and reuse text themes.</p>
        </div>
      `,
      ids: [newId]
    }
    
    const font = GLOBAL.landingPage.theme.fonts.find(item => {
      if (item.class === 'font-8') {
        return true;
      }
      return false;
    });
    // drag content 
    blockItem.dragContent.content = `
        <h2 style="font-family: ${font.style['font-family']};
                    font-size: ${font.style['font-size']};
                    color: #ffffff;
                    font-weight: ${font.style['font-weight']};
                    font-style: ${font.style['font-style']};
                    line-height: 150%;">Add paragraph text.
                    Click “Edit Text” to customize this theme across your site.
                    You can update and reuse text themes.</h2>`;


    return blockItem;
  }


  static appendToForm(formComp: DomComponent, config: any){
    let textBlock: IBlock = this.getBlock(true, config.width, config.classTheme, config.content);

    if(!textBlock){
      return;
    }

    let htmText = GLOBAL.compUtil.convertCompHtml(textBlock.content, formComp);

    const comps: DomComponent[] = GLOBAL.compUtil.appendToContainer(htmText, formComp)
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
  MoTextBlock
}