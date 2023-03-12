import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef  } from '@angular/core';
import * as AColorPicker from 'a-color-picker';
import { MoWbBaseComponent } from '../base.component';

@Component({
  selector: 'mo-wb-components-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorComponent extends MoWbBaseComponent {
  static readonly CACHE_15_DAY = 15 * 24 * 60 * 60;
  COLOR_KEY: string = 'WEB_BUILDER_COLOR_KEY';
  colorPicker: any;
  pickerColorId: string = `${Math.floor(Math.random() * 100000) + 1}`;
  listColors: string[] = [];
  paletteColor: string = ''
  maxSize: number = 14;

  left: number = 0;
  top: number = 32;
  isShow: boolean = false;
  isColorPicker: boolean = true;
  isColorSelected: boolean = false;
  colorSelected: string = '';

  @Input() pos: {top: number, left: number} = { top: 0, left: 0};
  @Input() color: string = '#000';
  @Input() zIndex: number = 2500;
  @Input() classInclude!: string;

  @Output() onColorChanged = new EventEmitter<string>();
  @Output() onColorSubmit = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<any>();

  @ViewChild('container') container: ElementRef;


  override ngOnInit() {
    super.ngOnInit();
    this.listColors = this._cacheService.get(this.COLOR_KEY) || [];
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.initColorPicker();
  }

  initColorPicker() {
    this.colorPicker = AColorPicker.from(`#picker-color-${this.pickerColorId}`);
    this.colorPicker.off('change');
    this.colorPicker.on('change', this.handleColorPickerChange);
  }

  setColor(color: string) {
    this.color = color;
    this.colorPicker[0].setColor(color, true);
    this.detectChanges();
  }

  updatePos() {
    const width = this.container.nativeElement.offsetWidth;
    const height = this.container.nativeElement.offsetHeight;
    this.top =  this.pos.top + height + 35 > window.innerHeight ? window.innerHeight - height - 35 :  this.pos.top;
    this.left = this.pos.left + width + 10 > window.innerWidth ? window.innerWidth - width - 10 : this.pos.left;
    this.detectChanges();
  }

  addColor() {
    if (this.listColors.length >= this.maxSize) {
      this.listColors.splice(0, 1);
    }
    this.listColors.push(this.color);
    this.colorSelected = this.color;
    this.isColorPicker = false;
    this.isColorSelected = true;

    this._cacheService.set(this.COLOR_KEY, this.listColors, MoWbColorComponent.CACHE_15_DAY);
    this.detectChanges();
  }

  removeColor() {
    this.listColors = this.listColors.filter(color => {
      if (color === this.colorSelected) {
        return false;
      }
      return true;
    });

    this.isColorPicker = true;
    this.colorSelected = '';
    this.isColorSelected = false;
    this.detectChanges();
    this._cacheService.set(this.COLOR_KEY, this.listColors, MoWbColorComponent.CACHE_15_DAY)
  }

  selectColor(color: string) {
    this.colorSelected = color;
    this.isColorPicker = false;
    this.isColorSelected = true;
    this.setColor(color);
    this.onColorChanged.emit(color);
    this.detectChanges();
  }

  hide() {
    this.isShow = false;
    this.detectChanges();
  }

  show() {
    this.isShow = true;
    this.isColorPicker = true;
    this.isColorSelected = false;
    this.colorSelected = '';
    this.updatePos();
    setTimeout(() => {
      this.updatePos();
    },0);
  }

  close() {
    this.hide();
    this.onClose.emit({});
  }

  handleColorPickerChange = (picker: any, color: string) => {
    this.color = AColorPicker.parseColor(color, 'hex');
    this.onColorChanged.emit(this.color);
    this.isColorPicker = true;
    this.isColorSelected = false;
    this.detectChanges();
  }

  handleOnOverlayClick(event: any) {
    this.close();
  }

  handleOnCloseColorClick(event: any) {
    this.close();
  }

  handleOnSubmitButtonClick(event: any) {    
    this.onColorSubmit.emit(this.color);
    this.close();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
