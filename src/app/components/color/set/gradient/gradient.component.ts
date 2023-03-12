import {
  Component, EventEmitter, Input,
  ChangeDetectionStrategy, Output, ViewChild, ElementRef
} from '@angular/core';
import { MoWbBaseComponent } from '../../../base.component';
import { IColorVar} from '../../../../common/common-types';
import { MoWbColorSetComponent } from '../set.component';
import { uid } from 'uid';
import { Utils } from 'src/app/utils/utils';
import { LinearGradientHelper } from './linearGradientHelper';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';

interface IGradientItem {
  id: string;
  color: IColorVar,
  percent: number,
  left: number;
}
interface IGradient {
  id?: string;
  type: 'line' | 'center';
  angle?: number;
  centerPos?: {
    left: number;
    top: number;
  };
  colors: IGradientItem[];
  alpha: number;
}

@Component({
  selector: 'mo-wb-components-color-set-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorSetGradientComponent extends MoWbBaseComponent {

  selectedColor: IColorVar;
  grdTypes: any[];
  grdTypeId: 'center' | 'line' = 'line';
  isShowPicker: boolean = false;
  pickerLeft: number = 0;
  bgGrdAngle: number = 30;
  
  gradient: IGradient;
  sliderWidth: number;
  sliderLeft: number = 0;
  isDrag: boolean = false;
  background: string;
  selectedColorId: string;
  startMove: {
    clientX: number,
    left: number,
    selectedGrdColor: IGradientItem;
  }
  tempColor: IColorVar;

  myGrdColors: IGradient[];
  mySelectedId: string;

  @Input() zIndex: number = 3500;
  @Input() classInclude: string;
  @Input() inputGradient: IGradient = null;

  @Output() onGradientColorChanged = new EventEmitter<IGradient>();

  @ViewChild('slider') sliderRef: ElementRef;

  override ngOnInit() {
    this.grdTypes= [
      {
        id: 'line',
        title: 'Thẳng'
      },
      {
        id: 'center',
        title: 'Xuyên tâm'
      },
    ];

    this.myGrdColors = [...GLOBAL.landingPage.theme.myGradientColors];
  }

  override ngAfterViewInit() {
    this.sliderWidth = this.sliderRef.nativeElement.getBoundingClientRect().width;
    this.initValue();
    this.detectChanges();
  }

  override ngOnDestroy() {
  }

  /**
   * init value
   */
  initValue() {
    this.gradient = Utils.copyGradient(this.inputGradient, this.sliderWidth);
    this.background = Utils.generateGradientBackground(this.gradient);
  }
  
  /**
   * set picker color position
   * @param event 
   * @param el 
   */
  setPickerColorPosition(event: MouseEvent) {
    const rect = this.sliderRef.nativeElement.getBoundingClientRect();
    this.pickerLeft = event.clientX - rect.left - 9;
    //console.log('pickerLeft=', this.pickerLeft);
    this.isShowPicker = true;
    this.detectChanges();
  }

  /**
   * handle gradient color moving
   * @param event 
   * @param grdItem 
   */
  gradientColorMoving(event: MouseEvent, grdItem: IGradientItem) {
    const rect = this.sliderRef.nativeElement.getBoundingClientRect();
    this.pickerLeft = event.clientX - rect.left - 9;

    grdItem.left = this.pickerLeft;
    grdItem.percent = Math.round(100 * this.pickerLeft / this.sliderWidth);

    this.generateGradientBackground();
    this.detectChanges();
  }
  
  /**
   * change over color
   * @param color 
   * @returns 
   */
  changeOverColor(color: IColorVar){
    const grdItem = this.gradient.colors.find(item => {
      return (item.id === this.selectedColorId) ? true  :false;
    });

    if (!grdItem) {
      return;
    }
    grdItem.color = Utils.copyColor(color);
    this.updateGradientAlpha(color.alpha);
    this.generateGradientBackground();
    this.detectChanges();
  }

  /**
   * change color
   * @param color 
   * @returns 
   */
  changeColor(color: IColorVar){
    const grdItem = this.gradient.colors.find(item => {
      return (item.id === this.selectedColorId) ? true  :false;
    });

    if (!grdItem) {
      return;
    }
    grdItem.color = Utils.copyColor(color);
    this.updateGradientAlpha(color.alpha);
    this.generateGradientBackground();
    this.detectChanges();
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
  }

  /**
   * restore color
   * @returns 
   */
  restoreColor() {
    if (!this.tempColor) {
      return;
    }
    const grdItem = this.gradient.colors.find(item => {
      return (item.id === this.selectedColorId) ? true  :false;
    });

    if (!grdItem) {
      return;
    }

    grdItem.color = Utils.copyColor(this.tempColor);
    this.generateGradientBackground();
    this.detectChanges();
  }

  /**
   * show select color popup
   * @param targetEl 
   */
  showSetColorPopup(targetEl: HTMLElement, colorVar: IColorVar) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbColorSetComponent).create(this._injector);
    modalRef.instance.inputColor = Utils.copyColor(colorVar);
    modalRef.instance.isOnlyColor = true;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.restoreColor();
      this.tempColor = null;
    });
    modalRef.instance.onColorChanged.subscribe((overColor: IColorVar) => { 
      this.changeOverColor(overColor);
    });
    modalRef.instance.onSelectColor.subscribe((selectedColor: IColorVar) => { 
      this.changeColor(selectedColor);
      this.tempColor = null;
    });

    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(targetEl);

    this.tempColor = Utils.copyColor(colorVar);
  }
  /**
   * generate gradient background
   */
  generateGradientBackground() {
    this.background = Utils.generateGradientBackground(this.gradient);
    this.onGradientColorChanged.emit(this.gradient);
  }

  /**
   * get my gradient background
   * @param gradient 
   * @returns 
   */
  getMyGradientBackground(gradient: IGradient) {
    return Utils.generateGradientBackground(gradient);
  }

  handleMouseOutSlider() {
    this.isShowPicker = false;
    $(document).off('mousemove', this.handleSliderMousemove);
    this.detectChanges();
  }

  handleOnSelectGradientType(type: any) {
    this.gradient.type = type.id;
    if (this.gradient.type === 'line' && !this.gradient.angle) {
      this.gradient.angle = 90;
    } else if (this.gradient.type === 'center' && !this.gradient.centerPos) {
      this.gradient.centerPos = {
        left: 50,
        top: 50
      }
    }
    this.generateGradientBackground();
    this.detectChanges();
  }

  handleOnSliderMouseOut(event: MouseEvent, el: HTMLElement) {
    this.handleMouseOutSlider();
  }

  handleOnSliderMouseOver(event: MouseEvent, el: HTMLElement) {
    $(document).off('mousemove', this.handleSliderMousemove);
    $(document).on('mousemove', this.handleSliderMousemove);
  }

  handleSliderMousemove = (event: any) => {
    this.setPickerColorPosition(event);
  }

  handleOnAngleSliderInputValueChanged(value: number) {
    this.gradient.angle = value;
    this.generateGradientBackground();
    this.detectChanges();
  }

  handleOnAngleValueChanged(value: number) {
    this.gradient.angle = value;
    this.generateGradientBackground();
    this.detectChanges();
  }

  /**
   * handle on add my gradient color
   * @param event 
   */
  handleOnSaveMyColorClick(event: any) {
    const gradient: IGradient = Utils.copyObject(this.gradient);
    gradient.id = uid();
    this.myGrdColors.push(gradient);
    GLOBAL.landingPage.theme.myGradientColors = [...this.myGrdColors];
    this.detectChanges();
  }
  
  handleOnGradientItemClick(event: MouseEvent,sliderEl: HTMLElement, grdItem: IGradientItem) {
    event.stopPropagation();
    if (this.isDrag) {
      return;
    }
    this.showSetColorPopup(sliderEl, grdItem.color);
    this.detectChanges();
  }
  /**
   * handle gradient color mousedown
   * @param event 
   * @param grdItem 
   */
  handleOnColorMousedown(event: MouseEvent, grdItem: IGradientItem) {
    event.stopPropagation();
    event.preventDefault();
    this.startMove = {
      selectedGrdColor: grdItem,
      left: grdItem.left,
      clientX: event.clientX
    }
    this.selectedColorId = grdItem.id;
    this.detectChanges();
    $(document).off('mousemove', this.handleGradientColorMousemove);
    $(document).on('mousemove', this.handleGradientColorMousemove);
    $(document).off('mouseup', this.handleGradientColorMouseup);
    $(document).on('mouseup', this.handleGradientColorMouseup);
  }
  /**
   * handle gradient color mousemove
   * @param event 
   */
  handleGradientColorMousemove = (event: any) => {
    this.isDrag = true;
    event.preventDefault();
    let left = event.clientX - this.startMove.clientX +  this.startMove.left;
    left = Math.max(0, left);
    left = Math.min(left, this.sliderWidth);

    const selectedGrdColor = this.startMove.selectedGrdColor;
    selectedGrdColor.left = left;
    selectedGrdColor.percent = Math.round(100 * left / this.sliderWidth);

    this.generateGradientBackground();
    this.detectChanges();
  }
  /**
   * handle gradient color mouseup
   * @param event 
   */
  handleGradientColorMouseup = (event: any) => {
    $(document).off('mousemove', this.handleGradientColorMousemove);
    $(document).off('mouseup', this.handleGradientColorMouseup);
    setTimeout(() => {
      this.isDrag = false;
    }, 50);
  }

  /**
   * select slider color
   * @param event 
   */
  handleOnSelectSliderColorClick(event: MouseEvent, sliderEl: HTMLElement) {
    const grdColors : any[]= [];
    this.gradient.colors.forEach(grdItem => {
      // console.log('grdItem=',grdItem);
      const item = [`${grdItem.color.color}`, grdItem.left/this.sliderWidth];
      grdColors.push(item);
    });
    // get gradient color by left
    const grad = new LinearGradientHelper(grdColors);
    const percent = parseInt(`${100 * (this.pickerLeft + 9) / this.sliderWidth}`);
    const newRgb = grad.getColor(percent);
    
    const newGrdItem: IGradientItem = {
      id: uid(),
      color: {
        color: Utils.rgbToHex(newRgb),
        rgbColor: newRgb,
        cssVar: undefined,
        alpha: 1
      },
      percent: percent,
      left: this.pickerLeft + 9,
    };

    this.gradient.colors.push(newGrdItem);
    this.gradient.colors.sort((a, b) => {
      return a.left - b.left;
    });
    // off slider over
    this.handleMouseOutSlider();
    // generate gradient background
    this.generateGradientBackground();
    // set selected color Id
    this.selectedColorId = newGrdItem.id;
    // show set color popup
    this.showSetColorPopup(sliderEl, newGrdItem.color);
    
    this.detectChanges();
  }

  /**
   * handle on remove gradient color 
   * @param event 
   * @param selectedId 
   */
  handleOnRemoveGradientColorClick(event: MouseEvent, selectedId: string) {
    if (this.isDrag) {
      return;
    }
    this.gradient.colors = this.gradient.colors.filter(gradItem => {
      return (gradItem.id !== selectedId) ? true : false;
    });
    this.generateGradientBackground();
    this.detectChanges();
  }

  /**
   * handle on center point changed
   * @param centerPos 
   */
  handleOnCenterPointChanged(centerPos: any) {
    this.gradient.centerPos.top = centerPos.top;
    this.gradient.centerPos.left = centerPos.left;
    this.generateGradientBackground();
    this.detectChanges();
  }

  handleOnMyGradientColorClick(event: any, gradient: IGradient) {
    if (this.mySelectedId === gradient.id) {
      return;
    }
    this.mySelectedId = gradient.id;
    this.gradient = Utils.copyObject(gradient);
    this.generateGradientBackground();
    this.detectChanges();
  }

  handleOnRemoveGradientItem(event: any, gradient: IGradient, index: number) {
    this.myGrdColors = this.myGrdColors.filter(item => {
      return item.id === gradient.id ? false : true;
    });
    GLOBAL.landingPage.theme.myGradientColors = [...this.myGrdColors];
    this.detectChanges();
  }
  
}

export {
  IGradient,
  IGradientItem
}
