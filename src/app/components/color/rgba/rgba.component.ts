import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, SimpleChanges, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoWbBaseComponent } from '../../base.component';
import { MoWbColorSetComponent } from '../set/set.component';
import { IColorVar } from '../../../common/common-types';
import { Utils } from 'src/app/utils/utils';
import { IGradient } from '../set/gradient/gradient.component';


@Component({
  selector: 'mo-wb-components-color-rgba',
  templateUrl: './rgba.component.html',
  styleUrls: ['./rgba.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorRgbaComponent extends MoWbBaseComponent {
  
  alphaValue: number = 100;
  background: string = '';
  backgroundAlpha: string = '';
  tempColor: IColorVar;
  tempGradientColor: IGradient;

  @Input() type: any = 'color';
  @Input() title: string;
  @Input() classInclude: string;
  @Input() gradient: IGradient;
  @Input() isOnlyColor: boolean = false;
  @Input() color: IColorVar;

  @Output() onSelectColor = new EventEmitter<IColorVar>();
  @Output() onColorChanged = new EventEmitter<IColorVar>();
  @Output() onCancelSelectedColor = new EventEmitter<any>();
  @Output() onGradientColorChanged = new EventEmitter<IGradient>();
  @Output() onSelectGradientColor = new EventEmitter<IGradient>();
  @Output() onSetColorClosed = new EventEmitter<any>();

  @ViewChild('slider') slider: ElementRef;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.setValue();
    this.detectChanges();
    this.initEvents();
  }

  override ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['color']) {
      this.setValue(); 
    }
  }

  initEvents() {
    this.slider.nativeElement.addEventListener('input', this.handleOnSliderInputValueChanged);
    this.slider.nativeElement.addEventListener('click', this.handleOnSliderValueChanged); 
    this.slider.nativeElement.addEventListener('change', this.handleOnSliderValueChanged); 
  }

  /**
   * set value
   * @returns 
   */
  setValue() {
    // console.log('setValue type = ',this.type);
    if (this.type === 'color' && this.color) {
      const color = this.color.color;
      let rgb = this.color.rgbColor;
      if (this.color.color.trim() === '#ffffff') {
        rgb = '200,200,200';
      };

      this.background = `rgba(${this.color.rgbColor}, ${this.color.alpha})`;
      this.alphaValue = parseInt(`${this.color.alpha * 100}`);
      this.setBackgroundAlpha(rgb);
      // console.log('rgb set value rgb=', rgb, color, ' background=', this.background);
      return;
    }

    if (this.type === 'gradient') {
      this.alphaValue = parseInt(`${this.gradient.alpha * 100}`);
      this.background = Utils.generateGradientBackground(this.gradient);
      this.setBackgroundAlpha();
    }
  }

  /**
   * set background alpha
   * @returns 
   */
  setBackgroundAlpha(rgb: string ='') {
    if (this.type === 'color') {
      this.backgroundAlpha = `linear-gradient(45deg, rgba(${rgb},0) 0%, rgba(${rgb},1) 100%)`;
      this.detectChanges();
      return;
    }

    let colorVar: IColorVar;
    if (this.type === 'gradient') {
      colorVar = this.gradient && this.gradient.colors.length && this.gradient.colors[0].color;
    }
    if (!colorVar) {
      return;
    }
    this.backgroundAlpha = `linear-gradient(45deg, rgba(${colorVar.rgbColor},0) 0%, rgba(${colorVar.rgbColor},1) 100%)`;
    this.detectChanges();
  }


  /**
   * change gradient color
   * @param gradient 
   */
  changeGradientColor(gradient: IGradient) {
    this.gradient = Utils.copyGradient(gradient);
    this.background = Utils.generateGradientBackground(this.gradient);
    this.alphaValue = this.gradient.alpha * 100;
    this.onGradientColorChanged.emit(this.gradient);

    // console.log('changeGradientColor=', gradient);
    this.setBackgroundAlpha();
  }

  /**
   * show select color modal
   * @param targetEl 
   */
  showSetColor(targetEl: HTMLElement) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbColorSetComponent).create(this._injector);
    // set color
    if (this.type === 'color') {
      modalRef.instance.inputColor = {
        color: this.color.color,
        cssVar: this.color.cssVar,
        rgbColor: this.color.rgbColor,
        alpha: this.alphaValue / 100
      };
      this.tempColor = Utils.copyColor(modalRef.instance.inputColor);
    } 
    // set gradient color
    if (this.type === 'gradient') {
      modalRef.instance.gradient = this.gradient;
      modalRef.instance.isOnlyColor = false;
      modalRef.instance.type = 'gradient';
      this.tempGradientColor = Utils.copyGradient(this.gradient);
    }
    modalRef.instance.isOnlyColor = this.isOnlyColor;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      setTimeout(() => {
        if (this.tempColor) {
          this.restoreColor();
        } else if (this.tempGradientColor) {
          this.restoreGradient();
        }
        this.onSetColorClosed.emit();
        this.tempColor = null;
        this.tempGradientColor = null;
        this.detectChanges();
      }, 50);
    });
    modalRef.instance.onColorChanged.subscribe((overColor: IColorVar) => { 
      // console.log('onColorChanged overColor= ',overColor);
      this.type = 'color';
      this.changeOverColor(overColor);
    });
    modalRef.instance.onSelectColor.subscribe((selectedColor: any) => { 
      this.tempColor = null;
      this.tempGradientColor = null;
      this.type = 'color';
      this.onSelectColor.emit(selectedColor);
    });

    modalRef.instance.onGradientColorChanged.subscribe((gradient: IGradient) => {
      this.type = 'gradient';
      this.changeGradientColor(gradient);
    });

    modalRef.instance.onSelectGradientColor.subscribe((gradient: IGradient) => {
      this.tempGradientColor = null;
      this.tempColor = null;
      this.type = 'gradient';
      this.onSelectGradientColor.emit(gradient);
    });

    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(targetEl);
  }

  /**
   * restore color
   * @returns 
   */
  restoreColor() {
    this.type = 'color';
    this.color.color = this.tempColor.color;
    this.color.cssVar = this.tempColor.cssVar;
    this.color.rgbColor = this.tempColor.rgbColor;
    this.color.alpha = this.alphaValue / 100;

    this.setValue();
  }

  /**
   * restore gradient color
   * @returns 
   */
  restoreGradient() {
    this.type = 'gradient';
    this.gradient = Utils.copyGradient(this.tempGradientColor);
    this.updateGradientAlpha(this.alphaValue / 100);
    this.background = Utils.generateGradientBackground(this.gradient);
    this.setBackgroundAlpha();
  }

  /**
   * change over color
   * @param overColor 
   */
  changeOverColor(colorVar: IColorVar) {
    this.color = colorVar;
    this.setValue();
    this.onColorChanged.emit(colorVar);
  }

  /**
   * change alpha
   * @param alphaValue 
   * @returns 
   */
  changeAlpha(alphaValue: number) {
    this.alphaValue = alphaValue;
    const alpha = this.alphaValue / 100;
    if (this.type === 'color') {
      this.color.alpha = alpha;
      this.onColorChanged.emit(this.color);
      this.setValue();
      return;
    }

    if (this.type === 'gradient') {
      this.updateGradientAlpha(alpha);
      this.setValue();
      this.onGradientColorChanged.emit(this.gradient);
    }
  }

  /**
   * select color
   * @returns 
   */
  selectColor() {
    const alpha = this.alphaValue / 100;
    if (this.type === 'color') {
      this.color.alpha = alpha;
      this.onSelectColor.emit(this.color);
      return;
    }

    if (this.type === 'gradient') {
      // this.updateGradientAlpha(alpha);
      this.onSelectGradientColor.emit(this.gradient);
    }
  }
  /**
   * update gradient alpha
   * @param alpha 
   */
  updateGradientAlpha(alpha: number) {
    this.gradient.alpha = alpha;
    this.gradient.colors.forEach(gradientItem => {
      gradientItem.color.alpha = alpha;
    });

    this.alphaValue = alpha * 100;
  }
  
  /**
   * handle rgb color click
   * @param event 
   * @param el 
   */
  handleOnRgbColorClick(event: MouseEvent, el: HTMLElement) {
    this.showSetColor(el);
  }

  handleOnSliderValueChanged = (alphaValue: number) => {
    this.selectColor();
  }

  handleOnSelectAlpha(value: number) {
    this.changeAlpha(value);
    this.selectColor();
  }

  handleOnSliderInputValueChanged = (e: any) => {
    const value = parseFloat(this.slider.nativeElement.value);
    this.changeAlpha(value);
  }
}
