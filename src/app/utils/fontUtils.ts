import { Fonts, IColorVar } from "../common/common-types";
import { GLOBAL } from "../landing/editor/editor-wrapper";
import { IThemeFontItem } from "../landing/editor/toolbar/left/site-styles/text/text.component";
import { Utils } from "./utils";

class FontUtils {
  /**
   * parse font
   * @param fontItem 
   * @returns 
   */
  static parseFont(fontItem: any) {
    const normalStyle = [];
    const italicStyle = [];
    fontItem.value = fontItem.title;
    fontItem.html = `<span style="font-family: '${fontItem['value']}'">${fontItem['value']}</span>`;
    fontItem.html = fontItem.html;
    for (let i = 0; i < fontItem.font_weight.length; i++) {
      const item = fontItem.font_weight[i];
      if (typeof (item) === 'string' && item.includes('i')) {
        italicStyle.push(parseInt(item));
      } else if (typeof (item) === 'string') {
        normalStyle.push(parseInt(item));
      } else {
        normalStyle.push(item);
      }
    }
    fontItem.fontStyle = [{ style: 'normal', weight: normalStyle }, { style: 'italic', weight: italicStyle }]
    fontItem.url = fontItem.url_info && fontItem.url_info.url;
    return fontItem;
  }

  /**
   * build header link css
   * @param fontList 
   */
  static buildHeaderLinkCss(fontList: any[]) {
    for (let i = 0; i < fontList.length; i++) {
      const item = fontList[i];
      const foundFont = Fonts.DefaultFonts.find((font) => {
        if (item.id === font.id) {
          return true;
        }
        return false;
      });
      // neu la default font thi bo qua
      if (foundFont) {
        continue;
      }
      const currLink = document.getElementById(item.id);
      if (currLink) {
        currLink.remove();
      }
      let linkEl: any = document.createElement('link');
      linkEl.type = 'text/css';
      linkEl.rel = 'stylesheet';
      // linkEl.id = item.id;
      linkEl.href = item.url_info && item.url_info.url;
      linkEl.crossOrigin = "anonymous";

      document.head.appendChild(linkEl);
    }
  }

  /**
   * build iframe font link
   */
  static buildIframeFontLink = () => {
    Fonts.IframeFonts = [];
    const fontListValues: any[] = [];
    const allRules = GLOBAL.editor.getAllRules();
    allRules.each((rule: any) => {
      const style = rule.toJSON().style;
      let fontFamily = style && style['font-family'];
      if (!fontFamily) {
        return;
      }
      const fontArr = fontFamily.split(',');
      fontFamily = fontArr[0].trim();
      fontFamily = fontFamily.replaceAll("'", '');
      fontFamily = fontFamily.replaceAll('"', '');
      this.pushFontFamily(fontFamily, fontListValues);
    });
    // push root font family
    this.parseRootFontTheme(fontListValues);
  }

  /**
   * push font family
   * @param fontFamily 
   * @param fontListValues 
   */
  static pushFontFamily(fontFamily: string, fontListValues: any[]) {
    const iframeEl = GLOBAL.editor.getFrameEl();
    const fontItem = Fonts.AllFonts.find((item: any) => {
      if (item.title === (fontFamily && fontFamily.trim()) && !fontListValues.includes(item.value)) {
        return true;
      }
      return false;
    });
    console.log('pushFontFamily fontFamily= ', fontFamily, ' fontItem=', fontItem);
    if (fontItem && (fontItem.url_info && fontItem.url_info.url)) {
      fontListValues.push(fontItem.title);
      // create head font item
      this.createIframeFontHeadElement(fontItem, iframeEl);
      // store fontItem
      Fonts.IframeFonts.push(fontItem);
    }
  }

  /**
   * parse root font theme
   * @param fontListValues 
   */
  static parseRootFontTheme(fontListValues: any[]) {
    const styles = GLOBAL.editor.getStyles(':root', {type: 3});
    for(let i=1; i <10; i++) {
      const id = `--font-${i}`;
      const font = styles[id];
      if (!font) {
        continue;
      }
      let fontArr: string[] = font.split(' ');

      if (fontArr.length < 5) {
        continue;
      }
      fontArr.splice(0, 4);
      const fonts = fontArr.join(' ');
      fontArr = fonts.split(',');
      let fontFamily = fontArr[0].trim();
      fontFamily = Utils.replaceAll(fontFamily,'"','');
      fontFamily = Utils.replaceAll(fontFamily,',','');
      this.pushFontFamily(fontFamily, fontListValues);
    }
  }

  /**
   * create iframe FontHead element
   * @param fontItem 
   * @param iframeEl 
   */
  static createIframeFontHeadElement = (fontItem: any, iframeEl: any) => {
    const linkEl: any = document.createElement('link');
    linkEl.type = 'text/css';
    linkEl.rel = 'stylesheet';
    linkEl.id = fontItem.id;
    linkEl.href = fontItem.url_info && fontItem.url_info.url;
    linkEl.crossOrigin = "anonymous";
    $(iframeEl.contentDocument.head).append(linkEl);
  }

  /**
   * add font head 
   * @param fontName 
   * @returns 
   */
  static addFontHeadIntoIframe = (fontName: string) => {
    const iframeEl = GLOBAL.editor.getFrameEl();
    const foundFont = Fonts.IframeFonts.find(item => {
      if (item.title === fontName) {
        return true;
      }
      return false;
    });

    if (foundFont) {
      return;
    }

    const fontItem = Fonts.AllFonts.find(item => {
      if (item.title === fontName) {
        return true;
      }
      return false;
    });

    if (!fontItem || (!fontItem.url_info || !fontItem.url_info.url)) {
      return;
    }

    Fonts.IframeFonts.push(fontItem);
    this.createIframeFontHeadElement(fontItem, iframeEl);
  }

  /**
   * get font weight name
   * @param weight 
   * @returns 
   */
  static getFontWeightName(weight: string){
    switch(weight) {
      case '300':
        return 'Light';
      case '400':
        return 'Regular';
      case '500':
        return 'Medium';
      case '600':
        return 'Semi Bold';
      case '700':
        return 'Bold';
      case '800':
        return 'Extra Bold';
      case '900':
        return 'Black';
      default:
        return '';
    }
  }

  /**
    * get root fonts
    * @returns 
  */
  static  getAllRootFonts() {
   GLOBAL.fonts = [];
   for (let i = 0; i < GLOBAL.landingPage.theme.fonts.length; i++) {
     const font = GLOBAL.landingPage.theme.fonts[i];
     const style = font.style;
     let colorVar: IColorVar = Utils.parseColorVar(style['color']);
     const fontFamily = Utils.extractFontFamily(style['font-family']);
     const fontItem: IThemeFontItem = {
       color: `rgba(${colorVar.rgbColor}, ${colorVar.alpha})`,
       colorVar: colorVar,
       fontSize: style['font-size'],
       desc: font.desc,
       font: `'${fontFamily}', sans-serif`,
       fontFamily: fontFamily,
       fontSizeNumber:  parseInt(style['font-size']),
       fontStyle: style['font-style'],
       fontWeight: style['font-weight'],
       id: font.id,
       className: font.class,
       lineHeight: style['line-height'],
       name: font.name,
       tag: font.tag,
       html: ''
     }
     this.buildFontItemHtml(fontItem);
     GLOBAL.fonts.push(fontItem);
   }

   console.log('getAllRootFonts=', GLOBAL.fonts);
   return GLOBAL.fonts;
  }

  /**
   * build fontItem html
   * @param fontItem 
   */
  static buildFontItemHtml(fontItem: any){
    fontItem.html = `
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="d-flex align-items-center ">
          <div class="mo-wb-h-20px mo-wb-w-20px mo-wb-border-radius-4px mo-wb-border-general mo-wb-mr-8px"
            style="background-color: ${fontItem.color}">
          </div>
          <span style="
            font-family: ${fontItem.font};
            font-style: ${fontItem.fontStyle}; 
            font-weight: ${fontItem.fontWeight};">${fontItem.name}</span>
        </div>
        <div class="mo-wb-ml-12px mo-wb-mr-12px">${fontItem.fontSize}</div>
      </div>`
  }


}

export {
  FontUtils
}