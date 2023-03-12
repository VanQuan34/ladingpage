import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,ViewChildren,
  Output, Input, ElementRef, ChangeDetectorRef, QueryList, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../../components/detection.component';
import { lightness, hsl, saturation } from 'simpler-color';
import { ColorPickerModal } from '../../../../../../common/common-types';
import { GLOBAL } from '../../../../editor-wrapper';
import { Utils } from 'src/app/utils/utils';
declare var require: any
import { IColorPalette, IColorPaletteItem } from 'src/app/landing/editor/root.service';
import { EditorConstants } from 'src/app/landing/editor/constants';
var tinycolor = require("tinycolor2");

@Component({
  selector: 'mo-wb-landing-editor-toolbar-site_styles-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorSiteStylesColorComponent extends MoWbDetectionComponent {
  
  paletteColors: IColorPalette[];
  selectedColorId: string;
  selectedColorItem: IColorPaletteItem;
  tempPaletteColor: IColorPalette;

  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onClose = new EventEmitter<any>();
  @ViewChild('refSel') selectedColorRef: ElementRef;
  
  override ngOnInit() {
    this.paletteColors = GLOBAL.landingPage.theme.colorPalettes;
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
  }

  override ngAfterViewInit() {
    this.initColor();
  }

  override ngOnDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
  }

  /**
   * init array colors
   */
  initColor() {
    for (let i=0; i < this.paletteColors.length; i++) {
      const pColorItem = this.paletteColors[i];
      for (let j=0; j < pColorItem.colors.length; j++) {
        const colorItem = pColorItem.colors[j];
        // const id = `--${pColorItem.id}${j}`;
        const rgb = colorItem.rgb; // this.getRootParam(id);
        const hexColor = Utils.rgbToHex(rgb);
        colorItem.hex = hexColor;
        colorItem.isDark = !tinycolor(hexColor).isLight();
      }
      pColorItem.hexColor = pColorItem.colors[0].hex;
    }
    this.updateGlobalRootColor();
    console.log('initColor colors=', this.paletteColors);
    this.detectChanges();
  }

  /**
   * return rgb color  
   * @param name 
   * @returns 
   */
  getRootParam(name: string): string {
    const root = GLOBAL.editor.getRule(':root', {type: 3});
    if (!root) {
      return '';
    }
    const rootStyles = root.getStyle();
    return rootStyles[name];
  }
  
  /**
   * gen colors
   * @param item 
   */
  genColors(item: IColorPalette) {
    const color = item.hexColor;
    const id = item.id;
    const _hsl = hsl(color);
    let colors : any[] = [];

    colors = [color];
    const disCountLight =  Math.round(_hsl.l / 5);
    for (let i = 1 ; i < 5; i++) {
      const l = _hsl.l - i *disCountLight;
      let _color = lightness(color, l);
      colors.push(_color);
    }

    item.colors = colors.map((_color: any, index: number) => {
      return {
        id: `--${id}${index+1}`,
        rgb: Utils.hexToRgb(_color),
        hex: _color,
        isDark: !tinycolor(_color).isLight()
      }
    });
  }

  /**
   * show the color chooser modal
   * @param color 
   * @param pos 
   * @param callback 
   * @param callbackSubmit 
   * @param closeCallback 
   * @returns 
   */
  showColorModal = (color: string, pos: any, callback: (color: string) => void, callbackSubmit: (color: string) => void, closeCallback: () => void) => {
    if (!ColorPickerModal.Instance) {
      return;
    }
    if (ColorPickerModal.ColorChangedEventSubscription) {
      ColorPickerModal.ColorChangedEventSubscription.unsubscribe();
      ColorPickerModal.ColorChangedEventSubscription = null;
    }
    if (ColorPickerModal.ColorSubmitEventSubscription) {
      ColorPickerModal.ColorSubmitEventSubscription.unsubscribe();
      ColorPickerModal.ColorSubmitEventSubscription = null;
    }
    if (ColorPickerModal.ColorCloseEventSubscription) {
      ColorPickerModal.ColorCloseEventSubscription.unsubscribe();
      ColorPickerModal.ColorCloseEventSubscription = null;
    }

    ColorPickerModal.ColorChangedEventSubscription = ColorPickerModal.Instance.onColorChanged.subscribe(callback);
    ColorPickerModal.ColorSubmitEventSubscription = ColorPickerModal.Instance.onColorSubmit.subscribe(callbackSubmit);
    ColorPickerModal.ColorCloseEventSubscription = ColorPickerModal.Instance.onClose.subscribe(closeCallback);
    ColorPickerModal.Instance.setColor(color);
    ColorPickerModal.Instance.pos = pos;
    ColorPickerModal.Instance.show();
  }

  /**
   * set root styles
   * @param styles 
   * @returns 
   */
  setRootStyles(styles: any) {
    const root = GLOBAL.editor.getRule(':root', {type: 3});
    if (!root) {
      return;
    }
    const rootStyles = root.getStyle();
    const mergeStyles = {...rootStyles, ...styles};
    root.setStyle(mergeStyles, {});
    this.updateGlobalRootColor();
  }

  /**
   * get root styles
   * @returns 
   */
  getPaletteColorFromRootStyles(): IColorPalette[] {
    const root = GLOBAL.editor.getRule(':root', {type: 3});
    const rootStyles = root.getStyle();
    const paletteColors: IColorPalette[] = Utils.copyObject(this.paletteColors);

    paletteColors.forEach(paletteColor => {
      paletteColor.colors.forEach(colorItem => {
        colorItem.rgb = rootStyles[colorItem.id];
        const hexColor = Utils.rgbToHex(colorItem.rgb);
        colorItem.hex = hexColor;
        colorItem.isDark = !tinycolor(hexColor).isLight();
      });
      paletteColor.hexColor = paletteColor.colors[0].hex;
    });
    return paletteColors;
  }


  /**
   * update color palette item
   * @param colorId 
   * @param hexColor 
   * @param isInline 
   * @returns 
   */
  updateColorPaletteItem(colorId: string, hexColor: string, isInline: boolean = false) {
    const rgbColor = Utils.hexToRgb(hexColor);
    if (isInline) {
      GLOBAL.editor.getWrapper().view.$el.attr('style', `${colorId}:${rgbColor}`);
      this.detectChanges();
      return;
    }
    this.removeInlineStyle();
    const styleUpdate: any = {}
    styleUpdate[colorId] = rgbColor;
    this.setRootStyles(styleUpdate);
    this.detectChanges();
  }

  /**
   * update root style color palette
   * @param paletteColor 
   * @param isInline 
   * @returns 
   */
  updateRootColorPalette(paletteColor: IColorPalette, index: number, isInline: boolean = false) {
    // update inline color palette
    if (isInline) {
      let styleUpdate: string = ``;
      for (let i=0; i < paletteColor.colors.length; i++) {
        const colorId = paletteColor.colors[i].id;
        styleUpdate = `${styleUpdate} ${colorId}:${paletteColor.colors[i].rgb};`;
      }
      GLOBAL.editor.getWrapper().view.$el.attr('style', styleUpdate);
      return;
    }
    this.removeInlineStyle();
    // restore color palette
    if (this.tempPaletteColor) {
      this.paletteColors.splice(index, 1, Utils.copyObject(this.tempPaletteColor));
      this.tempPaletteColor = null;
      // console.log('restore palette color=', paletteColor, this.paletteColors);
      this.detectChanges();
      return;
    }
    const styleUpdate: any = {};
    for (let i=0; i < paletteColor.colors.length; i++) {
      const colorId = paletteColor.colors[i].id;
      styleUpdate[`${colorId}`] = paletteColor.colors[i].rgb;
    }
    this.setRootStyles(styleUpdate);
    this.detectChanges();
  }

  /**
   * remove attr inline style
   */
  removeInlineStyle() {
    // remove attr style inline
    GLOBAL.editor.getWrapper().view.$el.removeAttr('style');
  }

  close() {
    this.onClose.emit();
  }

  /**
   * update root style
   */
  updateRootStyle() {
    const paletteColors = this.getPaletteColorFromRootStyles(); 
    if (!Utils.compare(paletteColors, this.paletteColors)) {
      this.paletteColors = Utils.copyObject(paletteColors);
      this.updateGlobalRootColor();
      this.detectChanges();
    }
  }

  /**
   * update global root style
   */
  updateGlobalRootColor(paletteColors: IColorPalette[] = this.paletteColors) {
    paletteColors.forEach(paletteColor => {
      paletteColor.colors.forEach(item => {
        GLOBAL.rootStyles[item.id] = item.rgb;
      });
    });

    GLOBAL.landingPage.theme.colorPalettes = Utils.copyObject(paletteColors);
  }

  handleOnCloseIconClick(e: any) {
    this.close();
  }

  /**
   * handle on color palette item mouseover
   * @param e 
   * @param item 
   */
  handleOnColorMouseover(e: any, item: IColorPaletteItem) {
    setTimeout(() => {
      this.selectedColorId = item.id;
      this.detectChanges();
    },0);
  }

  /**
   * handle color palette item mouseout
   * @param e 
   */
  handleOnColorMouseout(e: any) {
    this.selectedColorId = '';
    this.detectChanges();
  }
  
  /**
   * handle on color palette item click
   * @param e 
   * @param colorItem 
   * @param colorEl 
   */
  handleOnColorItemClick(e: any, colorItem: IColorPaletteItem, colorEl: HTMLElement) {
    const rect = colorEl.getBoundingClientRect();
    const pos =  {
      top: rect.top + 50,
      left: rect.left + 50
    }
    this.showColorModal(colorItem.hex, pos, 
      (color: string) => {
        // console.log('hello color=',color);
        this.selectedColorItem.hex = color;
        this.selectedColorItem.isDark = !tinycolor(color).isLight();
        this.updateColorPaletteItem(colorItem.id, color, true);
      },
      (color: string) => {
        colorItem.hex = color;
        colorItem.rgb = Utils.hexToRgb(color);
        colorItem.isDark = !tinycolor(color).isLight();
        this.updateColorPaletteItem(colorItem.id, color, false);
      },
      () => {
        this.selectedColorItem = null;
        this.removeInlineStyle();
        this.detectChanges();
      }
    );
    this.selectedColorItem = Utils.copyObject(colorItem);
    $(this.selectedColorRef.nativeElement).css({'top': `${rect.top - 3}px`, 'left': `${rect.left - 3}px`});
    this.detectChanges();  
  }

  /**
   * handle on edit color palette
   * @param item 
   * @param buttonEl
   */
  handleOnEditColorButtonClick(item: IColorPalette, index: number, buttonEl: HTMLElement) { 
    const rect = buttonEl.getBoundingClientRect();
    const pos =  {
      top: rect.top + 20,
      left: rect.left + 50
    }
    // store palette color
    this.tempPaletteColor = Utils.copyObject(item);
    this.showColorModal(item.hexColor, pos, 
      (color: string) => {
        item.hexColor = color;
        this.genColors(item);
        this.updateRootColorPalette(item, index, true);
        this.detectChanges();
      },
      (color: string) => {
        // select color
        this.tempPaletteColor = null;
      },
      () => { 
        // close color
        this.updateRootColorPalette(item, index); 
      }
    );
    this.detectChanges();  
  }

  handleOnCompUndo = () =>{
    setTimeout(() => {
      this.updateRootStyle();
    }, 50);
    
  }

  handleOnCompRedo = () => {
    setTimeout(() => {
      this.updateRootStyle();
    }, 50);
  }

}
