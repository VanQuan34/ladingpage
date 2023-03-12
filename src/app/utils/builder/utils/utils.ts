import { ICss } from "src/app/landing/editor/editor-wrapper";

class BuilderUtils {

  constructor() {
  }

  /**
   * convert css array to string
   * @param css 
   * @returns 
   */
  static convertCssToString(cssArr: ICss[]): string {
    let cssStr = '';
    cssArr.forEach(css => {
      let name = '';
      if (css.selectors.length) {
        css.selectors.forEach(selector => {
          if (selector.startsWith('#')) {
            name = selector;
          } else {
            name = `.${selector}`;
          } 
        });
      } else {
        name = css.selectorsAdd;
      }

      if (css.state) {
        name = `${name}${css.state}`;
      }

      // if (css.selectors.length > 1) {
      //   console.log('selectors=', css.selectors);
      // }
      // add styles
      let cssItem = `${name} {`;
      for (const key in css.style) {
        cssItem = `${cssItem} ${key}:${css.style[key]};`;
      }
      cssItem = `${cssItem} }`;
      
      // add media
      if (css.atRuleType === 'media') {
        cssItem = `@media ${css.mediaText} { ${cssItem} }`;
      }

      cssStr = `${cssStr} ${cssItem}`;

    });
    return cssStr;
  }

}

export {
  BuilderUtils
}