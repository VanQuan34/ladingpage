import { GLOBAL, ICss } from "src/app/landing/editor/editor-wrapper";
import { IPage, ITheme } from "src/app/landing/editor/root.service";
import { BuilderUtils } from "./utils/utils";

class ContentBuilderEditor {
  constructor() {

  } 
  
  /**
   * build content
   * @param page 
   */
  buildEditorContent(page: IPage) {
    // const _html = GLOBAL.editor.runCommand('build-content', {});
    // console.log('_html=',_html);
    const theme = GLOBAL.landingPage.theme;
    const html = GLOBAL.editor.getHtml();
    const css = GLOBAL.editor.getCss();
    // const parseHtml = GLOBAL.editor.getParser().parseHtml(`<style>${css}</style>${html}`);
    const parseCss = GLOBAL.editor.parseCss(`<style>${css}</style>`);

    const filterCss = this.filterCssTheme(theme, parseCss);
    page.body = this.filterAttributes(html);
    page.style = BuilderUtils.convertCssToString(filterCss);

    console.log('page=', page);
    // console.log('filterCss=', filterCss, `<style>${css}</style>`);
  }

  /**
   * filter attributes. example data-preview, ...
   * @param html 
   * @returns 
   */
  filterAttributes(html: string) {
    const container = document.createElement("div");
    $(container).html(html);
    $(container).find('[data-preview=hover]').removeAttr('data-preview');
    $(container).find('[data-mo-type]').removeAttr('data-mo-type');
    
    return $(container).html();
  }

  /**
   * filter css theme
   * @param theme 
   * @param parseCss 
   */
  filterCssTheme(theme: ITheme, parseCss: ICss[]): ICss[] {
    const themeFontIds = theme.fonts.map(item => {
      return item.id;
    });
    const fontClass = ['font-1', 'font-2', 'font-3', 'font-4', 'font-5', 'font-6', 'font-7', 'font-8', 'font-9', 'font-10']
    const filterCss = parseCss.filter(item => {
      if (item.selectorsAdd === ':root'){
        return false;
      }
      if (item.selectors.length && fontClass.includes(item.selectors[0])) {
        return false;
      }
      if (item.selectors.length && themeFontIds.includes(item.selectors[0])) {
        return false;
      }
      return true;
    });
    console.log('filterCssTheme filterCss=',filterCss, ' theme=', theme);
    return filterCss;
  }

}

export {
  ContentBuilderEditor
}