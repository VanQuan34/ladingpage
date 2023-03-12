import { GLOBAL, ICss } from "src/app/landing/editor/editor-wrapper";
import { IPage, ITheme } from "src/app/landing/editor/root.service";
import { Utils } from "../utils";
import { BuilderFontUtils } from "./utils/fontUtils";
import { BuilderUtils } from "./utils/utils";
const minifier = require('string-minify');

/**
 * build content preview
 */
class BuilderContentPreview {

  constructor() {
  }

  /**
   * build page content
   * @param page 
   * @returns 
   */
  public buildPageContent(page: IPage, theme: ITheme) {
    console.log('buildPageContent page=', page, theme);
    const html = page.body;
    const css = page.style;
    // build theme style
    const themeStyle = this.buildThemeStyle(theme);
    const style = `<style>${css}${themeStyle}</style>`
    const parseCss = GLOBAL.editor.parseCss(style);
    return this.buildHtml(html, parseCss);
  }

 /**
  * build html
  * @param html 
  * @param parseCss 
  * @param theme 
  * @returns 
  */
  private buildHtml(html: string, parseCss: ICss[]) {
    const container = document.createElement('div');
    $(container).html(html);
    // remove meta tags
    $(container).find('meta').remove();
    // filter data attributes
    this.filterDataAttributes(container);
    // build page style
    const styles = this.buildStyle(parseCss);
    // generate custom style
    let customCss = '';
    // build meta data
    const meta = this.buildMeta();
    // build css link
    const cssLink = this.buildCssLink();
    // build javascript link
    const javascriptLink = this.buildExternalJavascriptLink();
    // build script
    const script = this.buildScript();
    // build font link
    const fontLinks = BuilderFontUtils.buildFontLinks(parseCss); 
    // generate full html page
    let fullHtml: string =`
      <!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          ${meta}
          ${cssLink}
          ${fontLinks}
          ${javascriptLink}
          <script type="text/javascript" src="https://npmcdn.com/flickity@2/dist/flickity.pkgd.js"> </script>
          <script src="https://unpkg.com/flickity-fullscreen@1/fullscreen.js"></script>
          <style type="text/css"> ${styles} ${customCss} </style>
          ${script}
        </head>
        <body>
          ${$(container).html()}
        </body>
      </html>
    `;

    const miniHtml = minifier(fullHtml);
    console.log('miniHtml=', miniHtml);
    return miniHtml;
  }     

  /**
   * build style
   * @param parseCss
   * @param theme 
   * @returns 
   */
  private buildStyle(parseCss: ICss[]): string {
    let styles = BuilderUtils.convertCssToString(parseCss);
    // replace data preview
    styles = Utils.replaceAll(styles, '[data-preview="hover"]', ':hover');
    return `${styles}`;
  }

  /**
   * build theme style
   * @param theme 
   * @returns 
   */
  private buildThemeStyle(theme: ITheme): string {
    let themeStyles = ``;
    let root = `:root{ `;
    let fonts = '';
    
    // generate root color
    theme.colorPalettes.forEach(item => {
      item.colors.forEach(color => {
        root += ` ${color.id}:${color.rgb};`;
      });
    });

    // generate root font
    theme.fonts.forEach(item => {
      const style = item.style;
      const fontStyle = `${style['font-style']} normal ${style['font-weight']} ${style['font-size']}/${style['line-height']} ${style['font-family']};`;
      const font = `${item.id}: ${fontStyle}`;
      root += ` ${font}`;
    });

    root += '}';

    // generate font theme
    theme.fonts.forEach(font => {
      fonts = `${fonts} .${font.class}{`;
      fonts = `${fonts} font: var(${font.id}) ;`;
      fonts = `${fonts} color: ${font.style['color']} ;`;
      fonts = `${fonts} }`;
    });

    themeStyles = `${root} ${fonts}`;
    return themeStyles;
  }
  
  /**
   * remove data attributes
   * @param containerEl 
   */
  private filterDataAttributes(containerEl: HTMLElement){
    $(containerEl).find('[data-preview]').removeAttr('data-preview');
    $(containerEl).find('[data-mo-type]').removeAttr('data-mo-type');
    $(containerEl).find('[mo-type]').removeAttr('mo-type');
    $(containerEl).find('[data-highlightable]').removeAttr('data-highlightable');
    $(containerEl).find('[data-content]').removeAttr('data-content');
    $(containerEl).find('[data-type]').removeAttr('data-type');
  }

  /**
   * build meta tags
   * @returns 
   */
  private buildMeta() {
    let meta = `
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    `;
    return meta;
  }

  /**
   * build css link
   * @returns 
   */
  private buildCssLink() {
    let cssLink = ``;
    return cssLink;
  }

  /**
   * build external javascript link
   * @returns 
   */
  private buildExternalJavascriptLink() {
    let javascriptLink = ``;
    return javascriptLink;
  }

  /**
   * build script
   * @returns 
   */
  private buildScript() {
    let script = ` `;
    return script;
  }

}

export {
  BuilderContentPreview
}