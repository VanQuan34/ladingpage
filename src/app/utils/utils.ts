
import { IColorVar } from '../common/common-types';
import { IGradient, IGradientItem } from '../components/color/set/gradient/gradient.component';
import { DomComponent, GLOBAL } from '../landing/editor/editor-wrapper';
import { IBgImage } from '../landing/editor/inspector/design/elements/background/background.component';

class Utils {

  static compareTwoNumbers = (number1: any, number2: any) => {
    // console.log('compareTwoNumbers number1=', number1, ' float number 1=', parseFloat(`${number1}`));
    // console.log('compareTwoNumbers number2=', number2, ' float number 2=', parseFloat(`${number2}`))
    return parseFloat(`${number1}`) === parseFloat(`${number2}`);
  }

  static componentToHex = (c: any) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static rgbToHex = (rgb: string) => {
    const rgbArr = rgb && rgb.split(',');
    if (!rgbArr || rgbArr.length < 3) {
      return '';
    }
    const r = parseInt(rgbArr[0].trim());
    const g = parseInt(rgbArr[1].trim());
    const b = parseInt(rgbArr[2].trim());
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  static hexToRgb = (hexColor: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (!result) {
      return '';
    }

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return r + "," + g + "," + b;
  }

  static extractVarValues = (inputValue: string) => {
    const reg = /var\([^)]+\)/g;
    if (!inputValue) {
      return [];
    }
    const values: string[] = [];
    const matchArr = inputValue.match(reg);
    if (!matchArr || !matchArr.length) {
      return [];
    }
    for (let i = 0; i < matchArr.length; i++) {
      let match = matchArr[i];
      match = match.replace('var(', '');
      match = match.replace(')', '');
      values.push(match);
    }
    return values;
  }

  /**
   * parse color var
   * @param rgbaStr 
   * @returns 
   */
  static parseColorVar = (rgbaStr: string): IColorVar => {
    const colorVar: IColorVar = {
      color: '',
      rgbColor: '',
      cssVar: '',
      alpha: 1
    }
    let colorStr = rgbaStr.replace('rgba(', '');
    // colorStr = colorStr.replace(')', '');
    
    let arr = colorStr.split(',');
    if (!arr.length) {
      return colorVar;
    }

    const alpha = arr[arr.length - 1];
    colorVar.alpha = parseFloat(alpha);
    arr.splice(arr.length - 1, 1);

    let rgbColor = arr.join(',');

    const cssVars = this.extractVarValues(rgbColor);
    if (!cssVars.length) {
      colorVar.rgbColor = rgbColor;
      colorVar.color = this.rgbToHex(rgbColor);
      return colorVar;
    }
    colorVar.cssVar = cssVars[0];
    const rgb = GLOBAL.rootStyles[colorVar.cssVar];
    colorVar.rgbColor = rgb;
    colorVar.color = this.rgbToHex(rgb);

    return colorVar;
  }

  static extractFontFamily = (fontFamily: string) => {
    let fonts = fontFamily.split(',');
    let font = fonts[0].trim();
    font = font.replace(/"/g, '');
    font = font.replace(/'/g, '');
    return font;
  }

  static decode = (str: string) => {
    let txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  static escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  static replaceAll = (str: string, find: string, replace: string): string => {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  /**
   * generate gradient background
   * @param gradient 
   * @returns 
   */
  static generateGradientBackground(gradient: IGradient, useHexColor: boolean = true): string {
    let background: string = '';
    // console.log('generateGradientBackground gradient=', gradient);
    // generate liner gradient
    if (gradient.type === 'line') {
      let linerGradient = `linear-gradient(${gradient.angle}deg, `;
      gradient.colors.forEach((gradientItem: IGradientItem, index: number) => {
        linerGradient = `${linerGradient}  rgba(${this.generateRgbColor(gradientItem.color, useHexColor)} , ${gradientItem.color.alpha}) ${gradientItem.percent}%`;
        linerGradient = index !== gradient.colors.length - 1 ? `${linerGradient}, ` : `${linerGradient}`;
      });

      background = `repeat padding-box border-box 0% / auto scroll  ${linerGradient})`;
      return background;
    }
    let radialGradient = `radial-gradient(circle at ${gradient.centerPos.left}% ${gradient.centerPos.top}%, `;
    gradient.colors.forEach((gradientItem: IGradientItem, index: number) => {
      radialGradient = `${radialGradient}  rgba(${this.generateRgbColor(gradientItem.color, useHexColor)} , ${gradientItem.color.alpha}) ${gradientItem.percent}%`;
      radialGradient = index !== gradient.colors.length - 1 ? `${radialGradient}, ` : `${radialGradient}`;
    });

    background = `repeat padding-box border-box 0% / auto scroll  ${radialGradient})`;
    return background;
  }

  /**
   * generate background image
   * @param bgImage 
   * @returns 
   */
  static generateBackgroundImage(bgImage: IBgImage): string {
    let background: string = '';
    background = `repeat padding-box border-box 0% / auto scroll  url(${bgImage.url})`;
    return background;
  }

  static generateRgbColor(colorVar: IColorVar, useHexColor: boolean = false) {
    if (colorVar.cssVar && !useHexColor) {
      return `var(${colorVar.cssVar})`;
    }
    return colorVar.rgbColor;
  }
  
  /**
   * generate background color
   * @param colorVar 
   * @returns 
   */
  static generateBackgroundColor(colorVar: IColorVar, useHexColor: boolean = true): string {
    let background: string = '';
    background = `linear-gradient(rgba(${this.generateRgbColor(colorVar, useHexColor)} , ${colorVar.alpha}) 0%, rgba(${this.generateRgbColor(colorVar, useHexColor)} , ${colorVar.alpha}) 100%)`;
    return background;
  }

  /**
   * copy gradient
   * @param gradient 
   * @returns 
   */
  static copyGradient(gradient: IGradient, sliderWidth: number = 258): IGradient {
    const _gradient = {
      type: gradient.type,
      alpha: gradient.alpha,
      angle: gradient.angle,
      centerPos: gradient.centerPos,
      colors: gradient.colors.map(item=> {
        const newGradientColor: IGradientItem = {
          id: item.id,
          percent: item.percent,
          left: item.percent * sliderWidth / 100,
          color: {
            color: item.color.color,
            rgbColor: item.color.rgbColor,
            cssVar: item.color.cssVar,
            alpha: item.color.alpha,
          }
        }
        return newGradientColor
      })
    };
    return _gradient;
  }

  static copyColor(colorVar: IColorVar): IColorVar {
    const color: IColorVar = {
      color: colorVar.color,
      rgbColor: colorVar.rgbColor,
      cssVar: colorVar.cssVar,
      alpha: colorVar.alpha,
    }
    return color;
  }
  /**
   * return copy object
   * @param obj 
   */
  static copyObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * compare between two objects 
   * @param obj1 
   * @param obj2 
   * @returns 
   */
  static compare(obj1: any, obj2: any): boolean {
    if (!obj1 || !obj2) {
      return false;
    }
    return JSON.stringify(obj1) === JSON.stringify(obj2) ? true : false;
  }

}

export {
  Utils
}