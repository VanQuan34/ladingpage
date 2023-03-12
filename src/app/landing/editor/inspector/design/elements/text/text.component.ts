import {
  Component,  Input, ChangeDetectionStrategy, 
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { Fonts, IColorVar } from '../../../../../../common/common-types';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { Utils } from 'src/app/utils/utils';
import { IThemeFontItem } from 'src/app/landing/editor/toolbar/left/site-styles/text/text.component';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { FontUtils } from 'src/app/utils/fontUtils';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsTextComponent extends MoLandingEditorInspectorBaseComponent {
  
  themeFonts: IThemeFontItem[] = [];
  fonts: any[] = [];
  themeFontId: string = '';
  selectedFontValue: string = '';
  child: any[];
  fontWeights: any[];
  fontWeight: string;
  themeFont: IThemeFontItem;
  fontSize: number;
  fontColorVar: IColorVar;
  lineHeight: number = 150;
  lineSpacing: number = 0;
  fontStyle: string;
  fontDecoration: string = '';
  textAlign: string ='';
  letterSpacing: number = 0;

  @Input() themeIdVar: string = '--txt-theme';
  @Input() override selectorAdd: string = ' > .mo-text';
  @Input() textClass: string = 'mo-text';
  @Input() override selectorAddRegular: string = '';

  override onInit(): void {
    this.themeFonts = [...GLOBAL.fonts];
    this.fonts = Fonts.AllFonts;
  }

  override onAfterViewInit() {
    this.setValue();
    this.detectChanges();
  }

  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    const attrs = this.selectedComp.getAttributes();
    this.moType = attrs['mo-type'];
    // find font theme
    this.themeFont = this.findFontTheme();
    console.log('themefont:', this.themeFont);

    if (!this.themeFont) {
      return;
    }
    // get fonts
    this.getFont();
    this.detectChanges();
  }

  /**
   * find font theme
   * @returns 
   */
  findFontTheme() {
    const attrs = this.selectedComp.getAttributes();
    const moType = attrs['mo-type'];

    this.themeFontId = this.getThemeId(moType);
    if (!this.themeFontId) {
      return null;
    }
    this.themeFontId = this.themeFontId.trim();
    // get theme font
    const themeFont = this.themeFonts.find(item => {
      if (item.id === this.themeFontId) {
        return true;
      }
      return false;
    });
    return themeFont;
  }

  /**
   * get theme id
   * @param moType 
   * @returns theme id
   */
  getThemeId(moType: string): string {
    let themeId: string = '';
    const styles = this.getStyle('-1');
    themeId = styles[this.themeIdVar];
    console.log('getThemeId styles=', styles);
    if (themeId) {
      console.log('themeId=', themeId);
      return themeId;
    }
    // if (moType === 'text') {
    //   const $el = this.selectedComp.view.$el;
    //   const children = $el.children();
    //   const child = children && children.length && children[0];
    //   themeId = child ? $(child).attr('class').trim() : '';
    // } else {
    //   const $el = this.targetModel.view.$el;
    //   const classArr = $el.attr('class').trim().split(' ');
    //   themeId = classArr.length && classArr[classArr.length - 1];
    // }

    return themeId;
  }

  /**
   * get font
   */
  getFont() {
    // get font family
    this.selectedFontValue = this.themeFont['fontFamily'];
    // get font style
    const fontItem = this.fonts.find( item => {
      if (item.value === this.selectedFontValue) {
        return true;
      }
      return false;
    });

    const fontWeights = (fontItem && fontItem.fontStyle[0].weight) || [];
    this.fontWeights = fontWeights.map((weight: any) => {
      const newItem: any = {
        id: `${weight}`
      };
      newItem.name = FontUtils.getFontWeightName(newItem.id);
      return newItem;
    });
    this.fontWeight = this.themeFont.fontWeight;
    
    // get style font
    let styles = this.getStyle();
    if (this.state !== 'REGULAR') {
      const regularStyle = this.getStyle(this.selectorAddRegular);
      styles = {...regularStyle, ...styles};
      // console.log('styles=', styles);
    }
    // get font family 
    const fontFamily = styles['font-family'];
    if (fontFamily) {
      this.selectedFontValue = Utils.extractFontFamily(fontFamily);
    }

    // get font weight
    const fontWeight = styles['font-weight'];
    this.fontWeight = fontWeight || this.fontWeight;

    // get font size
    let fontSize = styles['font-size'];
    if (fontSize) {
      fontSize = parseFloat(fontSize);
    }

    this.fontSize = fontSize || this.themeFont.fontSizeNumber;
    // get font color
    this.fontColorVar = (styles['color'] && styles['color'].trim() !== 'undefined') ? Utils.parseColorVar(styles['color']) : this.themeFont.colorVar;
    // console.log('fontColorVar=', this.fontColorVar);

    // get font style
    let fontStyle = styles['font-style'];
    this.fontStyle = fontStyle || this.themeFont.fontStyle;

    // get text decoration
    let textDecoration = styles['text-decoration'] || '';
    this.fontDecoration = textDecoration.trim();

    // get text align
    let textAlign = styles['text-align'] || '';
    this.textAlign = textAlign.trim();

    // get line height
    let lineHeight = styles['line-height'] || this.themeFont.lineHeight || '';
    this.lineHeight = parseFloat(lineHeight);

    //get letter spacing
    let letterSpacing = styles['letter-spacing'] || '0';
    this.letterSpacing = parseFloat(letterSpacing);
  }

  /**
   * change font family
   * @param fontItem 
   */
  changeFontFamily(fontItem: any) {
    this.selectedFontValue = fontItem['value'];
    FontUtils.addFontHeadIntoIframe(this.selectedFontValue);
    this.setStyle(`'${this.selectedFontValue}', sans-serif`, 'font-family');
    // update font weights
    const fontWeights = fontItem.fontStyle[0].weight || [];
    this.fontWeights = fontWeights.map((weight: any) => {
      const newItem: any = {
        id: `${weight}`
      };
      newItem.name = FontUtils.getFontWeightName(newItem.id);
      return newItem;
    });

    const foundWeight = this.fontWeights.find( item => {
      if (item.id === this.fontWeight) {
        return true;
      }
      return false;
    });

    if (!foundWeight && this.fontWeights.length) {
      this.fontWeight = this.fontWeights[this.fontWeights.length - 1].id;
      this.changeFontWeight(this.fontWeight);
    }
    this.detectChanges();
  }

  /**
   * change text color
   * @param selectColor 
   */
  changeTextColor(selectColor: IColorVar, isInline: boolean = false) {
    const value = selectColor.cssVar ? `rgba(var(${selectColor.cssVar}),${selectColor.alpha})` : `rgba(${selectColor.rgbColor},${selectColor.alpha})`;
    if (isInline) {
      this.$targetEls.attr('style', `color: ${value}`);
      this.detectChanges();
      return;
    }
    this.clearInlineStyles();
    this.fontColorVar = selectColor;
    this.setStyle(value, 'color');
    this.detectChanges();
  }

  //  /**
  //  * change textcolor
  //  * @param selectColor 
  //  */
  //  changeTextColor(selectColor: IColorVar) {
  //   this.fontColor = selectColor.color;
  //   this.fontColorVar = selectColor.cssVar;
 
  //   const value = this.fontColorVar ? `rgb(var(${this.fontColorVar}))` : this.fontColor;
  //   this.setStyle(value, 'color');
 
  //   this.detectChanges();
  // }

  /**
   * change font weight
   * @param fontWeight 
   */
  changeFontWeight(fontWeight: string) {
    this.fontWeight = fontWeight;
    this.setStyle(this.fontWeight, 'font-weight');
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
    //GLOBAL.editor.updateSelectedComp();
  }

  /**
   * change text decoration
   * @param textDecoration 
   */
  changeTextDecoration(textDecoration: string) {
    this.fontDecoration = textDecoration;
    this.setStyle(this.fontDecoration, 'text-decoration');
  }

  /**
   * change fontSize
   * @param fontSize 
   */
  changeFontSize(fontSize: number, inlineStyle: boolean = false) {
    this.fontSize = fontSize;

    if (!inlineStyle) {
      this.clearInlineStyles();
      this.setStyle(`${this.fontSize}px`, 'font-size');
    } else {
      const styles = `font-size: ${this.fontSize}px`;
      this.setInlineStyles(styles);
    }
    this.detectChanges();
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
    //GLOBAL.editor.updateSelectedComp();
  }

  /**
   * change font style
   * @param fontStyle 
   */
  changeFontStyle(fontStyle: string) {
    this.fontStyle = fontStyle;
    this.setStyle(this.fontStyle, 'font-style');
    this.detectChanges();
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }
  
  /**
   * change line height
   * @param lineHeight 
   */
  changeLineHeight(lineHeight: number) {
    this.lineHeight = lineHeight;
    this.setStyle(`${this.lineHeight}%`, 'line-height');
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }

  /**
   * change text align
   * @param align 
   */
  changeTextAlign(align: string) {
    this.textAlign = align;
    this.setStyle(this.textAlign, 'text-align');
  }
  /**
   * change letter spacing
   * @param letterSpacing 
   */
  changeLetterSpacing(letterSpacing: number) {
    this.letterSpacing = letterSpacing;
    this.setStyle(this.letterSpacing, 'letter-spacing');
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
    //GLOBAL.editor.updateSelectedComp();
  }

  /**
   * change theme font
   * @param themeFont 
   */
  changeThemeFont(themeFont: IThemeFontItem) {
    const newTag = themeFont.tag;
    const currTextComps = GLOBAL.editor.getWrapper().find(this.selectorId);
    // replete theme font
    for (let i = 0; i < currTextComps.length; i++) {
      const comp = currTextComps[i];
      const innerHtml = comp.view.$el.html();
      let html: string;
      if(this.moType === 'tabs'){
        const forInput = comp.view.$el.attr('for');
        html = `<label for="${forInput}" class="${this.textClass}">${innerHtml}</label>`;
      } else{
      html = `<${newTag}  class="${this.moType === 'text' ? themeFont.className : ''} ${this.textClass}">${innerHtml}</${newTag}>`;
      }
      comp.replaceWith(html);
    }
    
    // set new theme
    this.themeFont = themeFont;
    this.themeFontId = themeFont.id;
    // update theme font id
    this.setStyle(themeFont.id, this.themeIdVar, '-1');
    if (this.moType === 'text'){
      // remove old theme css
      this.removeOldThemeRuleCss();
    } else {
      const fontStyle = this.getStyle();
      // const color = themeFont.colorVar.cssVar ? `rgba(var(${themeFont.cssVar}),${selectColor.alpha})` : `rgba(${selectColor.rgbColor},${selectColor.alpha})`;
      const font = `var(${themeFont.id})`;
      this.removeOldThemeRuleCss();
      this.setStyles([
        { 
          value: fontStyle['color'],
          property: 'color'
        },
        { 
          value: font,
          property: 'font'
        },
      ])
    }
    // refresh new font
    this.getFont();
    // update target elements
    this.$targetEls = GLOBAL.editor.getWrapper().view.$el.find(this.selectorId);
    this.detectChanges();
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }

  /**
   * remove old theme rule css
   */
  removeOldThemeRuleCss() {
    const cc = GLOBAL.editor.getCssComposer();
    const rules = cc.findByName(this.selectorId, {});
    rules.forEach(rule => {
      cc.removeRule(rule);
    });
  }

  /**
   * set inline styles
   * @param styles 
   */
  setInlineStyles(styles: string) {
    this.$targetEls.attr('style', styles);
  }

  /**
   * clear inline styles
   */
  clearInlineStyles() {
    this.$targetEls.removeAttr('style');
  }

  handleOnSelectThemeFont(themeFont: any) {
    this.changeThemeFont(themeFont);
  }

  handleOnSelectFont(font: any) {
    this.changeFontFamily(font);
  }

  handleOnSelectFontWeight(fontWeightItem: any) {
    this.changeFontWeight(fontWeightItem.id);
  }

  handleOnFontSizeChange(fontSize: number) {
    this.changeFontSize(fontSize);
  }

  handleOnFontColorChanged(colorVar: IColorVar) {
    this.changeTextColor(colorVar, true);
  }

  handleOnFontColorSelect(colorVar: IColorVar) {
    this.changeTextColor(colorVar);
  }

  handleOnFontColorClosed() {
    this.clearInlineStyles();
  }

  handleOnIconFormatClick(e: any, format: string) {
    switch(format) {
      case 'style':
        const fontStyle = this.fontStyle === 'normal' ? 'italic' : 'normal';
        this.changeFontStyle(fontStyle);
        break;
      case 'underline':
      case 'line-through':
        const textDecoration  = this.fontDecoration === format ? '' : format;
        this.changeTextDecoration(textDecoration);
        break;
      default:
        break;
    }
  }

  handleOnIconAlignClick(e:any, align: string) {
    this.changeTextAlign(align);
  }

  handleOnLineHeightChange(value: number) {
    this.changeLineHeight(value);
  }

  handleOnLetterSpacingChange(value: number) {
    this.changeLetterSpacing(value);
  }

  handleOnInputFontSizeSliderValueChanged(value: number) {
    this.changeFontSize(value, true);
  }
  
}
