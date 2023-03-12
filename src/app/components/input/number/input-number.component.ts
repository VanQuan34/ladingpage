import {
  Component, EventEmitter, ViewChild, SimpleChanges,
  Output, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MoWbBaseComponent } from '../../base.component';
import { IUnit, UnitKey, Units } from '../../../utils/unitUtil';
import { MoWbInputNumberUnitDropdownComponent } from './unit-dropdown/unit-dropdown.component';
import { MoWbInputNumberMinmaxComponent } from './minmax/minmax.component';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';

@Component({
  selector: 'mo-wb-components-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputNumberComponent extends MoWbBaseComponent {

  inputWidth: string;
  extendClass: string;
  error: boolean;
  isFocus: boolean;
  isShowUnit: boolean;
  unitItem: any ;
  unitList: any = Units;
  isInputEnable: boolean = true;

  @Input() classInclude: string = '';
  @Input() classIncludeLabel: string = '';
  @Input() label: string;
  @Input() min: number;
  @Input() max: number;
  @Input() value: any;
  @Input() isRequired: boolean = true;
  @Input() step: number = 1;
  @Input() enable: boolean = true;
  @Input() width: string = '100%';
  @Input() title: string;
  @Input() unit: UnitKey | any = UnitKey.px ;
  @Input() units: IUnit[] = [];
  @Input() type: 'INTEGER' | 'FLOAT' = 'FLOAT';
  @Input() labelIcon: string;
  @Input() actionKey : 'KEY-UP' | 'ENTER' = 'ENTER';
  @Input() ignoreValues: number[] = [];
  @Input() hasPlusButton: boolean = false;


  @Output() onValueChanged = new EventEmitter<number>();
  @Output() onUnitChange = new EventEmitter<IUnit>();
  @Output() onValueError = new EventEmitter<any>();
  @Output() onChangeMinUnit = new EventEmitter<any>();
  @Output() onChangeMaxUnit = new EventEmitter<any>();
  @Output() onChangeMinValue = new EventEmitter<any>();
  @Output() onChangeMaxValue = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef;
  @ViewChild('inputWrapp') inputWrapp: ElementRef;
  @ViewChild('minmaxEl') minmaxRef: ElementRef;
 
  override ngOnInit() {
    this.unitItem = this.unit && Units[this.unit];
    this.value = this.convertUnitValue(this.value, this.unit);
    this.isInputEnable = this.checkIsInputEnable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['unit']) {
      this.unitItem = Units[this.unit];
      this.isInputEnable = this.checkIsInputEnable();
      this.detectChanges();
    }

    if (changes['value']) {
      this.value = this.convertUnitValue(this.value, this.unit);
      this.detectChanges();
    }
  }

  override ngAfterViewInit() {
    this.initEvents();
  }

  initEvents() {
    if (!this.input || !this.input.nativeElement) {
      return;
    }
    this.input.nativeElement.addEventListener('focus', this.handleOnInputFocus);
    this.input.nativeElement.addEventListener('blur', this.handleOnInputBlur);
    this.input.nativeElement.addEventListener('keyup', this.handleOnInputKeyup);
    this.input.nativeElement.addEventListener('paste', this.handleOnPaste);
    this.input.nativeElement.addEventListener('click', this.handleOnInputClick)
  }

  isNumeric = (num: any) => {
    return !isNaN(num)
  }

  getValue() {
    return this.input.nativeElement.value;
  }

  getDisplayValue(val: string) {
    const valNumber = this.type === 'INTEGER' ? parseInt(val) : parseFloat(val);
    const displayVal = this.checkIfFloatValue(valNumber) ? valNumber.toFixed(1) : valNumber.toFixed();
    return displayVal;
  }

  setValue(value: number) {
    this.value = value;
    this.detectChanges();
  }

  checkIfFloatValue(value: number) {
    if (!isNaN(value) && value.toString().indexOf('.') != -1) {
      return true;
    }
    return false;
  }

  addValue(step: number = this.step) {
    if (this.error || !this.enable) {
      return;
    }
    let val =  this.type === 'FLOAT' ? parseFloat(this.input.nativeElement.value) : parseInt(this.input.nativeElement.value);
    val = val + step;
    if (this.max) {
      val = Math.min(this.max, val);
    }
    const displayVal = this.checkIfFloatValue(val) ? val.toFixed(1) : val.toFixed();
    this.input.nativeElement.value = `${displayVal}`;
    this.detectChanges();
    this.onValueChanged.emit(parseFloat(displayVal));
  }

  subtractValue(step: number = this.step) {
    if (this.error || !this.enable) {
      return;
    }
    let val =  this.type === 'FLOAT' ? parseFloat(this.input.nativeElement.value) : parseInt(this.input.nativeElement.value);
    val = Math.max(this.min, val - step);
    const displayVal = this.checkIfFloatValue(val) ? val.toFixed(1) : val.toFixed();
    this.input.nativeElement.value = `${displayVal}`;

    this.detectChanges();
    this.onValueChanged.emit(parseFloat(displayVal));
  }

  /**
   * select input value
   */
  selectInputValue() {
    try {
      const InputElement = this.input.nativeElement as HTMLInputElement
      InputElement.setSelectionRange(0, this.input.nativeElement.value.length);
    } catch(ex) {
    }
  }

  /**
   * show unit menu
   */
  showMenuUnits(targetRef: any = null) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbInputNumberUnitDropdownComponent).create(this._injector);
    //const modalRef =  this.viewContainerRef.createComponent(MoWbColorComponent); //this._componentFactoryResolver.resolveComponentFactory(MoWbColorComponent).create(this._injector);
    modalRef.instance.units = this.units;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    // handle selected unit item
    modalRef.instance.onSelectItem.subscribe((unit: IUnit) => {
      this.changeUnit(unit);
    });
    this._domService.addDomToBody(modalRef);
    
    modalRef.instance.selectedKey = this.unit;
    modalRef.instance.show(targetRef || this.inputWrapp);
  }

  showMinmax() {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbInputNumberMinmaxComponent).create(this._injector);
    modalRef.instance.min = this.value.min;
    modalRef.instance.max = this.value.max;
    modalRef.instance.units = this.units;

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });

    modalRef.instance.onChangeMinUnit.subscribe((unit: IUnit) => {
      this.onChangeMinUnit.emit(unit);
    });
    modalRef.instance.onChangeMaxUnit.subscribe((unit: IUnit) => {
      this.onChangeMaxUnit.emit(unit);
    });
    modalRef.instance.onChangeMinValue.subscribe((value: number) => {
      this.onChangeMinValue.emit(value);
    });
    modalRef.instance.onChangeMaxValue.subscribe((value: number) => {
      this.onChangeMaxValue.emit(value);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(this.minmaxRef);
  }

  /**
   * change unit
   * @param unit 
   */
  changeUnit(unit: IUnit) {
    this.onUnitChange.emit(unit);
  }

  /**
   * convert value by unit
   * @param value 
   */
  convertUnitValue(value: string, unit: string) {
    if (!unit) {
      return value;
    }
    switch(unit) {
      case UnitKey.minMax:
        return value;
      case UnitKey.auto:
      case UnitKey.maxC:
      case UnitKey.minC:
      case UnitKey.none:
        return '';
      case UnitKey.px:
        return GLOBAL.unit.convertToFloatValue(value, 0);
      default:
        return GLOBAL.unit.convertToFloatValue(value, 1);
    }
  } 

  checkIsInputEnable() {
    if (!this.unit) {
      return true;
    }
    switch(this.unit) {
      case UnitKey.auto:
      // case UnitKey.fr:
      case UnitKey.maxC:
      case UnitKey.minC:
      case UnitKey.minMax:
      case UnitKey.none:
        return false;
      default:
        return true;
    }
  }

  blur() {
    this.input.nativeElement.blur();
  }

  handleOnInputFocus = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.isFocus = true;
    this.detectChanges();
  }

  handleOnInputBlur = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.isFocus = false;
    this.detectChanges();
  }

  handleOnInputKeyup = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    var charCode = e.which || e.keyCode;
    // console.log('handleOnInputKeyup charCode=', charCode);
    if (charCode === 38) {
      this.addValue();
      this.selectInputValue();
      return;
    }
    if (charCode === 40) {
      this.subtractValue();
      this.selectInputValue();
      return;
    }
    this.handleValueChange(e);
  }

  handleOnInputClick = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.selectInputValue();
  }

  handleOnPaste = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    setTimeout(() => {
      this.handleValueChange(e);
    }, 20);
  }

  handleOnIncreaseButton = (e: any) => {
    e.stopPropagation();
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.addValue();
  }

  handleOnDecreaseButton = (e: any) => {
    e.stopPropagation();
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.subtractValue();
  }

  handleValueChange(e: any) {
    if (!this.enable) {
      return;
    }
    let val: string = this.input.nativeElement.value;
    if (this.value === val && this.actionKey !== 'ENTER') {
      return;
    }
    this.value = val;
    if (!val) {
      // this.input.nativeElement.value = '';
      // if (!this.error) {
      //   this._toast.show('error', `Vui lòng nhập số hợp lệ`);
      // }
      this.error = true;
      this.detectChanges();
      this.onValueError.emit();
      return;
    }
    if (!this.isNumeric(val) && val !== '-') {
      val = this.getDisplayValue(val);
      // this.input.nativeElement.value = '';
      // if (!this.error) {
      //   this._toast.show('error', `Vui lòng nhập số hợp lệ`);
      // }
      this.error = true;
      this.detectChanges();

      this.onValueError.emit();
      return;
    }

    let valNumber = this.type === 'FLOAT' ? parseFloat(val) : parseInt(val);
    if (isNaN(valNumber)) {
      this.input.nativeElement.value = val.includes('-') ? val.trim() : '';
      return;
    }

    if(valNumber <= this.min && this.min) {
      // if (!this.error) {
      //   this._toast.show('error', `Vui lòng nhập số lớn hơn ${this.min}${this.unit}`);
      // }
      this.error = true;
      this.detectChanges();
      this.onValueError.emit();
      return;
    }

    if (valNumber >= this.max && this.max) {
      // if (!this.error) {
      //   this._toast.show('error', `Vui lòng nhập số bé hơn ${this.max}${this.unit}`);
      // }
      this.error = true;
      this.detectChanges();
      this.onValueError.emit();
      return;
    }
    
    if (this.ignoreValues.includes(valNumber)) {
      this.error = true;
      this.detectChanges();
      this.onValueError.emit();
      return;
    }

    // if (this.type === 'INTEGER') {
    //   this.input.nativeElement.value = `${valNumber}`;
    // }

    this.error = false;
    this.detectChanges();

    const keyCode = e.keyCode;
    //console.log('handleValueChange keyCode=', keyCode, ' actionKey=', this.actionKey);
    if (this.actionKey === 'ENTER') {
      if (keyCode === 13) {
        this.onValueChanged.emit(valNumber);
        this.input.nativeElement.blur();
      }
      return;
    }
    this.onValueChanged.emit(valNumber);
  }

  handleOnUnitSelect(e: any) {
    if (!this.enable || !this.units || !this.units.length) {
      return;
    }
    this.showMenuUnits();
    this.detectChanges();
  }

  handleOnMinmaxClick(e: any) {
    this.showMenuUnits(this.minmaxRef);
  }

  handleOnEditMinMaxIconClick(e: any) {
    this.showMinmax();
  }

  override ngOnDestroy() {

  }

}
