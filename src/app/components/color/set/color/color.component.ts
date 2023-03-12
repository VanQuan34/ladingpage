import { Component, EventEmitter, Input, ChangeDetectionStrategy, Output, ElementRef, ViewChild } from '@angular/core';
import { MoWbDetectionComponent } from '../../../../components/detection.component';
import { ColorPickerModal, IColorVar} from '../../../../common/common-types';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { Utils } from 'src/app/utils/utils';
import { IColorPalette, IColorPaletteItem } from 'src/app/landing/editor/root.service';

@Component({
  selector: 'mo-wb-components-color-set-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorSetColorComponent extends MoWbDetectionComponent {

  top: number = 0;
  left: number = 0;

  colors: IColorPalette[] = [];
  myColors: string[] = [];
  hColor: string = '';
  selectedColor: IColorVar;
  alphaBgGradientValue: string;
  alphaVal: number;
  tempColor: IColorVar;

  @Input() inputColor: IColorVar = null;
  @Input() zIndex: number = 3500;
  @Input() classInclude: string;

  @Output() onColorChanged = new EventEmitter<IColorVar>();

  @ViewChild('hoverColor') hoverColorRef: ElementRef;
  @ViewChild('slider') slider: ElementRef;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.initColors();
    this.selectedColor = this.inputColor;
    this.alphaVal = (this.selectedColor && this.selectedColor.alpha || 1) * 100;
    this.setSliderBackgroundGradientValue();
    this.detectChanges();
  }

  override ngOnDestroy() {
  }

  /**
   * init colors
   */
  initColors() {
    this.colors = [...GLOBAL.landingPage.theme.colorPalettes];
    this.myColors = [...GLOBAL.landingPage.theme.myColors];

    this.slider.nativeElement.addEventListener('input', this.handleOnSliderInputValueChanged);

    this.colors.forEach(paletteColor => {
      paletteColor.colors.forEach(colorItem => {
        const hexColor = Utils.rgbToHex(colorItem.rgb);
        colorItem.hex = hexColor;
      });
      paletteColor.hexColor = paletteColor.colors[0].hex;
    });
    
    this.detectChanges();
  }

  /**
   * set slider background gradient
   * @returns 
   */
  setSliderBackgroundGradientValue() {
    const colorVar = this.tempColor || this.selectedColor;
    if (!colorVar) {
      return;
    }
    let rgb = colorVar.rgbColor;
    if (colorVar.color.trim() === '#ffffff') {
      rgb = '200,200,200';
    }
    
    this.alphaBgGradientValue = `linear-gradient(45deg, rgba(${rgb},0) 0%, rgba(${rgb},1) 100%)`;
  }

  /**
   * show hover color
   * @param colorEl 
   * @param color 
   * @param el 
   */
  showHoverColor(colorEl: any, color: string, el: HTMLElement) {
    const rect = colorEl.getBoundingClientRect();

    $(el).css({
      'background-color': color,
      'width': rect.width + 10,
      'height': rect.height + 10,
      'top': `${rect.top - 5}px`,
      'left': `${rect.left - 5}px`,
      'display': 'block'
    });
  }

  /**
   * show color picker
   * @param pos 
   * @param callback 
   * @param callbackSubmit 
   * @param closeCallback 
   * @returns 
   */
  showColorModal = (pos: any, 
    callback: (color: string) => void, 
    callbackSubmit: (color: string) => void, 
    closeCallback: () => void) => {
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
    ColorPickerModal.Instance.setColor(this.myColors[0]);
    ColorPickerModal.Instance.zIndex = this.zIndex + 20;
    ColorPickerModal.Instance.pos = pos;
    ColorPickerModal.Instance.show();
  }

  /**
   * add my color
   * @param color 
   */
  addNewMyColor(color: string) {
    this.myColors.splice(0,0, color);
    GLOBAL.landingPage.theme.myColors = [...this.myColors];
    this.detectChanges();
  }

  /**
   * change alpha color
   * @param alphaValue 
   */
  changeAlpha(alphaValue: number) {
    this.alphaVal = alphaValue;
    const alpha = this.alphaVal / 100;
    this.selectedColor.alpha = alpha;
    const colorVar: IColorVar = this.tempColor || this.selectedColor;
    colorVar.alpha = alpha;
    this.onColorChanged.emit(colorVar);
    this.detectChanges();
  }

  /**
   * get selected color
   * @returns 
   */
  getSelectedColor(): IColorVar {
    return this.selectedColor;
  }
  /**
   * handle color change
   * @param inputColor 
   */
  colorChange(inputColor: string) {
    const alpha = this.alphaVal / 100;
    let colorVar: IColorVar = {
      color: inputColor,
      rgbColor: Utils.hexToRgb(inputColor),
      cssVar: '',
      alpha: alpha
    };
    
    this.tempColor = Utils.copyColor(colorVar);
    this.setSliderBackgroundGradientValue();
    this.onColorChanged.emit(colorVar);
  }

  /**
   * color var change
   * @param inputColor 
   */
  colorVarChange(inputColor: IColorVar) {
    this.tempColor = Utils.copyColor(inputColor);
    this.setSliderBackgroundGradientValue();
    this.onColorChanged.emit(inputColor);
  }
  
  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }
  /**
   * handle on theme color mouse move
   * @param event 
   * @param colorItem 
   * @param colorEl 
   */
  handleOnColorThemeMouseover(event: MouseEvent, colorItem: IColorPaletteItem, colorEl: HTMLElement) {
    const el = this.hoverColorRef.nativeElement;
    $(el).css('border-radius', 0);
    this.showHoverColor(colorEl, colorItem.hex, el);
    this.hColor = colorItem.hex;
    this.detectChanges();
    this.colorVarChange({
      color: colorItem.hex,
      cssVar: colorItem.id,
      rgbColor: Utils.hexToRgb(colorItem.hex),
      alpha: this.alphaVal / 100
    });
  }

  /**
   * handle on theme color mouse out
   * @param event 
   * @param colorItem 
   * @param colorEl 
   */
  handleOnColorThemeMouseout(event: MouseEvent, colorItem: IColorPaletteItem, colorEl: HTMLElement) {
    const el = this.hoverColorRef.nativeElement;
    $(el).css({'display': 'none'});
    this.hColor = '';
    this.detectChanges();
    this.colorChange(this.selectedColor && this.selectedColor.color);
  }

  /**
   * handle on my color mouseover
   * @param event 
   * @param color 
   * @param colorEl 
   */
  handleOnMyColorMouseover(event: any, color: string, colorEl: HTMLElement) {
    const el = this.hoverColorRef.nativeElement;
    $(el).css('border-radius', 4);
    this.showHoverColor(colorEl, color, el);
    this.hColor = color;
    this.detectChanges();
    this.colorChange(this.hColor);
  }

  /**
   * handle on my color theme mouseout
   * @param event 
   * @param color 
   * @param colorEl 
   */
  handleOnMyColorThemeMouseout(event: any, color: string, colorEl: HTMLElement) {
    const el = this.hoverColorRef.nativeElement;
    $(el).css({'display': 'none'});
    this.hColor = '';
    this.detectChanges();
    this.colorChange(this.hColor || (this.selectedColor && this.selectedColor.color));
  }

  /**
   * handle color theme click
   * @param event 
   * @param colorItem 
   * @returns 
   */
  handleOnColorThemeClick(event: any, colorItem: IColorPaletteItem) {
    if (this.selectedColor && this.selectedColor.cssVar && this.selectedColor.color === colorItem.hex) {
      return;
    }
    this.selectedColor = {
      color: colorItem.hex,
      rgbColor: Utils.hexToRgb(colorItem.hex),
      cssVar: colorItem.id,
      alpha: this.alphaVal/100
    }
    this.detectChanges();
  }

  /**
   * handle my color click
   * @param event 
   * @param color 
   * @returns 
   */
  handleOnMyColorClick(event: any, color: string) {
    if (this.selectedColor && !this.selectedColor.cssVar && this.selectedColor.color === color) {
      return;
    }
    this.selectedColor = {
      cssVar: undefined,
      color: color,
      rgbColor: Utils.hexToRgb(color),
      alpha: this.alphaVal/100
    }
    this.detectChanges();
  }

  /**
   * handle add color click
   * @param event 
   * @param el 
   */
  handleOnAddColorClick(event: any, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const pos =  {
      top: rect.top + 30,
      left: rect.left + rect.width
    }

    this.showColorModal(pos, 
      (color: string) => {
      },
      (color: string) => {
        this.addNewMyColor(color);
      },
      () => {
      }
    );
    this.detectChanges();  
  }

  /**
   * handle change alpha
   * @param value 
   */
  handleOnAlphaChanged(value: number) {
    this.changeAlpha(value);
  }

  /**
   * handle slider input changed
   * @param e 
   */
  handleOnSliderInputValueChanged = (e: any) => {
    const value = parseFloat(this.slider.nativeElement.value);
    this.changeAlpha(value);
  }

  /**
   * handle remove color item
   * @param e 
   * @param color 
   * @param index 
   */
  handleOnRemoveColorItem(e: any, color: any, index: number) {
    // console.log('color=',color, ' index= ', index);
    this.myColors.splice(index, 1);
    GLOBAL.landingPage.theme.myColors = [...this.myColors];
    this.detectChanges();
  }
}
