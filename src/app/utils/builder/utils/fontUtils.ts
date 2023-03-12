import { Fonts } from "src/app/common/common-types";
import { ICss } from "src/app/landing/editor/editor-wrapper";
import { Utils } from "../../utils";

class BuilderFontUtils {

  static buildFontLinks(parseCss: ICss[]): string {
    console.log('parseFont styles=', parseCss);
    let fontLinks = ``;
    const fontNameList: string[] = [];
    // parse style font family
    this.parseStyleFontFamily(parseCss, fontNameList);
    // parse root style font family
    this.parseRootStyleFontFamily(parseCss, fontNameList);

    fontNameList.forEach(fontFamily => {
      fontLinks = `${fontLinks} ${this.buildFontLink(fontFamily)}`;
    });
    
    console.log('buildFontLink fontNameList=', fontNameList, fontLinks);
    return fontLinks;
  }

  /**
   * parse style fontFamily
   * @param parseCss 
   * @param fontNameList 
   */
  static parseStyleFontFamily(parseCss: ICss[], fontNameList: string[]) {
    for (let i = 0; i < parseCss.length; i++) {
      const css: ICss = parseCss[i];
      const style = css.style;
      let fontFamily = style && style['font-family'];
      if (!fontFamily) {
        continue;
      }
      const fontArr = fontFamily.split(',');
      fontFamily = fontArr[0].trim();
      fontFamily = fontFamily.replaceAll("'", '');
      fontFamily = fontFamily.replaceAll('"', '');
      if (fontNameList.includes(fontFamily)) {
        continue;
      }
      fontNameList.push(fontFamily);
    }
  }

  /**
   * parse root style fontFamily
   * @param parseCss 
   * @param fontNameList 
   */
  static parseRootStyleFontFamily(parseCss: ICss[], fontNameList: string[]) {
    const rootCss = parseCss.find(css => {
      return css.selectorsAdd === ':root' ? true : false;
    });
    if (!rootCss) {
      return;
    }
    const rootStyles = rootCss.style;

    for (let i = 1; i <= 10; i++) {
      const id = `--font-${i}`;
      const font = rootStyles[id];
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
      fontFamily = Utils.replaceAll(fontFamily, '"', '');
      fontFamily = Utils.replaceAll(fontFamily, ',', '');

      if (fontNameList.includes(fontFamily)) {
        continue;
      }
      fontNameList.push(fontFamily);
    }
  }

  /**
   * return string font link
   * @param fontFamily 
   */
  static buildFontLink(fontFamily: string) {
    let fontLink = ``;
    const fontItem = Fonts.AllFonts.find((item: any) => {
      if (item.title === (fontFamily && fontFamily.trim())) {
        return true;
      }
      return false;
    });

    if (!fontItem){
      return fontLink;
    }

    // console.log('pushFontFamily fontFamily= ', fontFamily, ' fontItem=', fontItem);
    if (fontItem.url_info && fontItem.url_info.url) {
      fontLink = `<link rel="stylesheet" type="text/css" href="${fontItem.url_info.url}" crossOrigin="anonymous">`;
    }

    return fontLink;
  }
}

export {
  BuilderFontUtils
}