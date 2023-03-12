import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../../components/base.component';
import { MoLandingEditorSiteStylesTextEditComponent } from './edit/edit.component';
import { GLOBAL } from '../../../../editor-wrapper';
import { cloneDeep } from 'lodash';
import { Utils } from 'src/app/utils/utils';
import { IColorVar } from 'src/app/common/common-types';
import { FontUtils } from 'src/app/utils/fontUtils';

interface IThemeFontItem {
  color: string;
  colorVar: IColorVar;
  fontSize: string;
  desc: string;
  font: string;
  fontFamily: string;
  fontSizeNumber: number;
  fontStyle: string;
  fontWeight: string;
  id: string;
  className: string;
  lineHeight: string;
  name: string;
  tag: string;
  html: string;
}

@Component({
  selector: 'mo-wb-landing-editor-toolbar-site_styles-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorSiteStylesTextComponent extends MoWbBaseComponent {
  
  fonts: IThemeFontItem[] = [];
  
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onClose = new EventEmitter<any>();
  
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.initFonts();
  }

  override ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  initFonts() {
    this.fonts = [...GLOBAL.fonts];
    this.detectChanges();
  }

  close() {
    this.onClose.emit();
  }
  /**
   * show edit font popup
   * @param fontItem 
   * @param targetEl 
   */
  showEditFontPopup(fontItem: IThemeFontItem, targetEl: HTMLElement) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorSiteStylesTextEditComponent).create(this._injector);
    modalRef.instance.fontItem = Utils.copyObject(fontItem);
    console.log('fontItem=', modalRef.instance.fontItem);
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    
    modalRef.instance.onApply.subscribe((item: any) => { 
      this.updateFontItem(item);
    });

    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(targetEl);
  }

  /**
   * update font
   * @param fontItem 
   * @returns 
   */
  updateFontItem(fontItem: IThemeFontItem) {
    let foundFontItem = this.fonts.find(item => {
      if (item.id === fontItem.id) {
        return true;
      }
      return false
    });

    if (!foundFontItem) {
      return;
    }
    foundFontItem.fontSize = fontItem.fontSize;
    foundFontItem.desc = fontItem.desc;
    foundFontItem.font = fontItem.font;
    foundFontItem.fontFamily = fontItem.fontFamily;
    foundFontItem.fontSizeNumber = fontItem.fontSizeNumber;
    foundFontItem.fontStyle = fontItem.fontStyle;
    foundFontItem.fontWeight = fontItem.fontWeight;
    foundFontItem.colorVar = fontItem.colorVar;
    foundFontItem.color = `rgba(${fontItem.colorVar.rgbColor}, ${fontItem.colorVar.alpha})`;

    // clone font object
    // foundFontItem = Utils.copyObject(fontItem);
    // build font html
    FontUtils.buildFontItemHtml(foundFontItem);
    
    //console.log('updateFontItem foundFontItem=', foundFontItem);
    this.detectChanges();
    // update font style
    this.updateFontStyle(foundFontItem);
    // add head font element
    FontUtils.addFontHeadIntoIframe(foundFontItem.fontFamily);
    // store global font
    GLOBAL.fonts = [...this.fonts];
    console.log('Themes Fonts = ', GLOBAL.fonts);
  }

  /**
   * update style font item
   * @param fontItem 
   */
  updateFontStyle(fontItem: IThemeFontItem) {
    console.log('updateFontStyle fontItem=', fontItem);
    const styles = {
      color: fontItem.colorVar.cssVar ? `rgba(var(${fontItem.colorVar.cssVar}), ${fontItem.colorVar.alpha})` : `rgba(${fontItem.colorVar.rgbColor}, ${fontItem.colorVar.alpha})` ,
      'font-size': fontItem.fontSize,
      'font-family': `'${fontItem.fontFamily}', sans-serif`,
      'font-weight': fontItem.fontWeight,
      'font-style': fontItem.fontStyle,
    }
    // update color theme
    const themeFontStyle = GLOBAL.editor.getStyles(`${fontItem.className}`, {fixMedia: true, type: 1});
    console.log('theme font style=', themeFontStyle);
    themeFontStyle['color'] = styles.color;
    GLOBAL.editor.setStyles(`${fontItem.className}`, themeFontStyle, {fixMedia: true, type: 1}); 

    // update root font
    const font = `${fontItem.fontStyle} normal ${fontItem.fontWeight} ${fontItem.fontSize}/${fontItem.lineHeight} '${fontItem.fontFamily}', sans-serif;`;
    const rootStyles = GLOBAL.editor.getStyles(':root', {type: 3, fixMedia: true});
    rootStyles[fontItem.id] = font;
    console.log('rootStyles=', rootStyles, ' font id');
    GLOBAL.editor.setStyles(':root', rootStyles, {fixMedia: true}); 

    // update global font
    const foundItem = GLOBAL.landingPage.theme.fonts.find( item => {
      return item.id === fontItem.id ? true : false;
    });

    if (!foundItem) {
      return;
    }
    
    foundItem.style['color'] = styles['color'];
    foundItem.style['font-size'] = styles['font-size'];
    foundItem.style['font-family'] = styles['font-family'];
    foundItem.style['font-weight'] = styles['font-weight'];
    foundItem.style['font-style'] = styles['font-style'];
  }

  handleOnCloseIconClick(e: any) {
    this.close();
  }

  handleOnItemClick(e: any,fontItem: IThemeFontItem, itemEl: HTMLElement) {
    this.showEditFontPopup(fontItem, itemEl);
  }

}

export {
  IThemeFontItem
}
            