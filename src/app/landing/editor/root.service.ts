import { Injectable } from '@angular/core';
import { ToastTranslateService } from '../../api/common/toast-translate.service';
import { Fonts, IColorVar, IFontItem } from '../../common/common-types';
import { MoFontApiService } from '../../api/fontApi'
import { GLOBAL } from './editor-wrapper';
import { Utils } from 'src/app/utils/utils';
import { uid } from 'uid';
import { getDefaultTemplate, DemoTemplate } from 'src/app/config';
import { IThemeFontItem } from './toolbar/left/site-styles/text/text.component';
import { IGradient } from 'src/app/components/color/set/gradient/gradient.component';
import { FontUtils } from 'src/app/utils/fontUtils';


interface  IMediaBreakPoint {
  id: string;
  min?: number;
  max?: number;
  device?: 'desktop' | 'mobile' | 'tablet';
  deviceIcon?: string;
  name: string;
  next?: number;
  isSelected: boolean;
} 


interface IAnchor {
  id: string;
  name: string;
  objectId: string;
}

interface IColorPaletteItem {
  id: string;
  rgb: string;
  hex?: string;
  isDark?: boolean;
}

interface IColorPalette {
  id: string;
  title: string;
  hexColor?: string;
  ls?: number[];
  colors: IColorPaletteItem[];
}

interface ITheme {
  fonts: {
    id: string,
    class: string,
    name: string,
    desc: string,
    tag: string
    style: {
      'font-family': string,
      'font-style': string,
      'font-weight': string,
      'font-size': string,
      'color': string,
      'line-height': string
    }
  }[];
  myColors: string[],
  myGradientColors: IGradient[]
  colorPalettes: IColorPalette[]
}

interface IMenuLink {
  href: string;
}

interface IMenuAnchor {
  id: string;
  pageId: string;
}

interface IMenuPage {
  id: string;
  name: string;
}

interface IEmail {
  href: string;
}

interface IPhone{
  href: string;
}

interface IMenuItem {
  id: string;
  name: string;
  type: IMenuPage | IMenuLink | IMenuAnchor;
}

interface IMenu{
  id: string;
  name: string;
  list: IMenuItem[];
}

interface IPage {
  id: string;
  name: string;
  isHome: boolean;
  isSelected: boolean;
  body: string;
  style: string;
  url?: string;
  slug?: string;
  title?: string;
  desc?: string;
  allowIndex?: boolean;
  anchors: IAnchor[];
  breakPoints: IMediaBreakPoint[];
}

interface IPopup {
  id: string;
  name: string;
}

interface ILandingPage {
  theme: ITheme;
  menus: IMenu[];
  pages: IPage[];
  popups: IPopup[];
}

@Injectable()
export class MoRootManagerService {

  constructor(
    private _fontApi: MoFontApiService,
    private _toast: ToastTranslateService
  ) {
  }

  /**
   * return default landing page config
   */
  initDefaultLandingPage(): ILandingPage {
    const defaultTemplate = getDefaultTemplate();
    const landingPage: ILandingPage = {
      theme: {
        fonts: [],
        myColors: [],
        myGradientColors: [],
        colorPalettes: []
      },
      menus: [],
      pages: [
        {
          id: uid(),
          name: 'Trang chủ',
          isHome: true,
          body: defaultTemplate.body,
          style: defaultTemplate.style,
          isSelected: true,
          anchors: [],
          breakPoints: this.getBreakPointsDefault()
        }
      ],
      popups: []
    };
    // set font theme
    this.setFontThemeLadingPage(landingPage);
    // set color theme
    this.setThemeColors(landingPage);
    // set menu
    this.setMenuLandingPage(landingPage);

    return landingPage;
  }

  getBreakPointsDefault(): IMediaBreakPoint[] {
    const breakPoints: IMediaBreakPoint[] =
     [
      {
        id: 'all',
        device: 'desktop',
        deviceIcon: 'mo-icn-desktop_view',
        min: 1001,
        name: 'Máy tính để bàn',
        isSelected: true
      },
      {
        id: uid(),
        min: 751,
        max: 1000,
        next: 0, 
        device: 'tablet',
        deviceIcon: 'mo-icn-tablet_view',
        name: 'Máy tính bảng',
        isSelected: false
      }, 
      {
        id: uid(),
        min: 320,
        max: 750,
        next: 1000,
        device: 'mobile',
        deviceIcon: 'mo-icn-phone_view',
        name: 'Điện thoại',
        isSelected: false
      }
    ];
    return breakPoints;
  }

  /**
   * set menu landing page
   * @param landingPage 
   */
  setMenuLandingPage(landingPage: ILandingPage) {
    landingPage.menus = [];
    const menu: IMenu = {
      id: uid(),
      name: 'Menu',
      list: []
    }
    landingPage.pages.forEach(page => {
      const _page: IMenuPage = {
        id: page.id,
        name: page.name
      }
      menu.list.push({
        id: uid(),
        name: _page.name,
        type: _page
      });
    });
    landingPage.menus.push(menu);
  }

  /**
   * set font theme landing page
   * @param landingPage 
   */
  setFontThemeLadingPage(landingPage: ILandingPage) {
    landingPage.theme.fonts = [
      { 
        id: '--font-1', 
        class: 'font-1',
        name: 'Tiêu đề 1',
        desc: 'Tiêu đề 1',
        tag: 'h1',
        style: {
          'font-family': "'Roboto', sans-serif",
          'font-style': 'normal',
          'font-weight': '700',
          'font-size': '88px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-2',
        class: 'font-2',
        name: 'Tiêu đề 2',
        desc: 'Tiêu đề 2',
        tag: 'h2',
        style: {
          'font-family': "'Roboto'",
          'font-style': 'normal',
          'font-weight': '700',
          'font-size': '70px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-3',
        class: 'font-3',
        name: 'Tiêu đề 3',
        desc: 'Tiêu đề 3',
        tag: 'h3',
        style: {
          'font-family': "'Roboto', sans-serif",
          'font-style': 'normal',
          'font-weight': '700',
          'font-size': '50px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-4',
        class: 'font-4',
        name: 'Tiêu đề 4',
        desc: 'Tiêu đề 4',
        tag: 'h4',
        style: {
          'font-family': "'Roboto', sans-serif",
          'font-style': 'normal',
          'font-weight': '700',
          'font-size': '40px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-5',
        class: 'font-5',
        name: 'Tiêu đề 5',
        desc: 'Tiêu đề 5',
        tag: 'h5',
        style: {
          'font-family': "'Roboto', sans-serif",
          'font-style': 'normal',
          'font-weight': '700',
          'font-size': '28px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-6',
        class: 'font-6',
        name: 'Tiêu đề 6',
        desc: 'Tiêu đề 6',
        tag: 'h6',
        style: {
          'font-family': "'Roboto', sans-serif",
          'font-style': 'normal',
          'font-weight': '600',
          'font-size': '22px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-7',
        class: 'font-7',
        name: 'Văn bản 1',
        desc: 'Văn bản 1',
        tag: 'p',
        style: {
          'font-family': "'Open Sans', sans-serif",
          'font-style': 'normal',
          'font-weight': '400',
          'font-size': '18px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-8',
        class: 'font-8',
        name: 'Văn bản 2',
        desc: 'Văn bản 2',
        tag: 'p',
        style: {
          'font-family': "'Open Sans', sans-serif",
          'font-style': 'normal',
          'font-weight': '400',
          'font-size': '16px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-9',
        class: 'font-9',
        name: 'Văn bản 3',
        desc: 'Văn bản 3',
        tag: 'p',
        style: {
          'font-family': "'Open Sans', sans-serif",
          'font-style': 'normal',
          'font-weight': '400',
          'font-size': '14px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      },
      { 
        id: '--font-10',
        class: 'font-10',
        name: 'Văn bản 4',
        desc: 'Văn bản 4',
        tag: 'p',
        style: {
          'font-family': "'Open Sans', sans-serif",
          'font-style': 'normal',
          'font-weight': '400',
          'font-size': '12px',
          'color': 'rgba(var(--c15), 1)',
          'line-height': '150%'
        }
      }
    ];
  }

  /**
   * set theme colors
   * @param landingPage 
   */
  setThemeColors(landingPage: ILandingPage) {
    landingPage.theme.myColors = [
      '#000000',
      '#ffffff',
      '#C0C0C0',
      '#808080',
      '#800000',
      '#FF0000',
      '#800080',
      '#FF00FF',
      '#008000',
      '#00FF00',
      '#808000',
      '#FFFF00',
      '#000080',
      '#0000FF',
      '#008080',
      '#00FFFF'
    ];
    landingPage.theme.colorPalettes = [
      {
        id: 'c1',
        title: 'Màu nền và văn bản',
        colors: [
          {id:'--c11', rgb:'255, 255, 255'},
          {id:'--c12', rgb:'204, 204, 204'},
          {id:'--c13', rgb:'153, 153, 153'},
          {id:'--c14', rgb:'102, 102, 102'},
          {id:'--c15', rgb:'51, 51, 51'},
        ]
      },
      {
        id: 'c2',
        title: 'Màu thao tác',
        colors: [
          {id:'--c21', rgb:'63, 185, 238'},
          {id:'--c22', rgb:'20, 159, 220'},
          {id:'--c23', rgb:'15, 119, 164'},
          {id:'--c24', rgb:'10, 78, 108'},
          {id:'--c25', rgb:'5, 37, 52'},
        ]
      },
      {
        id: 'c3',
        title: 'Mầu khác 1',
        colors: [
          {id:'--c31', rgb:'202, 110, 220'},
          {id:'--c32', rgb:'182, 57, 207' },
          {id:'--c33', rgb:'139, 38, 159'},
          {id:'--c34', rgb:'92, 25, 169'},
          {id:'--c35', rgb:'46, 13, 52'},
        ]
      },
      {
        id: 'c4',
        title: 'Mầu khác 2',
        colors: [
          {id:'--c41', rgb:'255, 2, 61'},
          {id:'--c42', rgb:'206, 0, 48'},
          {id:'--c43', rgb:'155, 0, 36'},
          {id:'--c44', rgb:'104, 0, 24'},
          {id:'--c45', rgb:'53, 0, 12'},
        ]
      },
      {
        id: 'c5',
        title: 'Mầu khác 3',
        colors: [
          {id:'--c51', rgb:'55, 52, 238'},
          {id:'--c52', rgb:'21, 18, 216'},
          {id:'--c53', rgb:'16, 14, 164'},
          {id:'--c54', rgb:'11, 9, 112'},
          {id:'--c55', rgb:'6, 5, 61'},
        ]
      },
    ];
  }

  /**
   * return full html page
   * @param page 
   * @param theme 
   * @returns 
   */
  getFullHtmlPage(page: IPage, theme: ITheme) {
    let themeStyles = ``;
    let root = `:root { `;
    let fonts = '';
    
    // generate root color
    theme.colorPalettes.forEach(item => {
      item.colors.forEach(color => {
        root += ` ${color.id}:${color.rgb};`;
        GLOBAL.rootStyles[color.id] = color.rgb;
      });
    });

    // generate root font
    theme.fonts.forEach(item => {
      const style = item.style;
      const fontStyle = `${style['font-style']} normal ${style['font-weight']} ${style['font-size']}/${style['line-height']} ${style['font-family']};`;
      const font = `${item.id}: ${fontStyle};`;
      GLOBAL.rootStyles[item.id] = fontStyle;
      root += ` ${font}`;
    });

    root += '}';

    // generate font theme
    theme.fonts.forEach(font => {
      fonts = `${fonts} .${font.class}{`;
      fonts = `${fonts} font: var(${font.id}) ;`;
      fonts = `${fonts} color: ${font.style['color']} ;`;
      // for (const key in font.style) {
      //   fonts = `${fonts} ${key}:${font.style[key]};`;
      // }
      fonts = `${fonts} }`;
    });

    themeStyles = `${root} ${fonts}`;
    console.log('themeStyles= ', themeStyles);
    return `
      <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
              <!-- NAME: SELL PRODUCTS -->
              <!--[if gte mso 15]>
              <xml>
                  <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
              </xml>
              <![endif]-->
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">
                ${ page.style } ${themeStyles}
              </style>
          </head>
          ${ page.body }
        </html>
      ` ;
    
  }

  /**
   * return hex color
   * @param colorVar 
   * @returns 
   */
  getHexColorVar(colorVar: string) {
    if (GLOBAL.rootStyles) {
      return Utils.rgbToHex(GLOBAL.rootStyles[colorVar]);
    }
    const root = GLOBAL.editor.getRule(':root', { type: 3 });
    GLOBAL.rootStyles = root.get('style');
    return Utils.rgbToHex(GLOBAL.rootStyles[colorVar]);
  }

  /**
   * get color var from var css or hexa color
   * @param color 
   * @param isCssVar 
   * @returns ColorVar
   */
  getColorVar(color: string, isCssVar: boolean = false): IColorVar {
    let output: IColorVar = null;
    if (!color) {
      return output;
    }
    if (isCssVar) {
      const rgb = GLOBAL.rootStyles[color];
      output = {
        color: Utils.rgbToHex(rgb),
        rgbColor: rgb,
        cssVar: color
      } 
      return output;
    }
    let cssVars: any = Utils.extractVarValues(color);
    const cssVar = cssVars && cssVars.length && cssVars[0];
    if (cssVar) {
      const rgb = GLOBAL.rootStyles[cssVar];
      output = {
        color: Utils.rgbToHex(rgb),
        rgbColor: rgb,
        cssVar: cssVar
      } 
      return output;
    }
    const isHexaColor = color.includes('#') ? true : false;
    output = {
      color: isHexaColor ? color : Utils.rgbToHex(color),
      rgbColor: isHexaColor ? Utils.hexToRgb(color) : color,
      cssVar: undefined
    } 
    return output;
  }

  /**
   * load all fonts
   * @returns 
   */
  async loadAllFont() {
    const response = await this._fontApi.getListFont(-1, 20, 'all');
    if (!response || response.code !== 200) {
      this._toast.show('error', response.message);
      return;
    }
    Fonts.AllFonts = response.data.map((item: any) => {
      //this.parseFont(item);
      return FontUtils.parseFont(item);
    });

    Fonts.AllFonts = Fonts.AllFonts.filter((item: IFontItem) => {
      if (Fonts.IgnoreFonts.includes(item.title)) {
        return false;
      }
      return true;
    });

    Fonts.AllFonts = [...Fonts.AllFonts, ...Fonts.MoreFonts];
    console.log('loadAllFont AllFonts0 =', Fonts.AllFonts);
    FontUtils.buildHeaderLinkCss(Fonts.AllFonts);

    Fonts.AllFonts = [...Fonts.AllFonts, ...Fonts.DefaultFonts];
    Fonts.AllFonts.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0
    });
    console.log('loadAllFont AllFonts=', Fonts.AllFonts);
  }

  
}

export {
  ILandingPage,
  IPage,
  ITheme,
  IAnchor,
  IMenuAnchor,
  IMenuPage,
  IMenuLink,
  IColorPalette,
  IColorPaletteItem,
  IMediaBreakPoint
}
