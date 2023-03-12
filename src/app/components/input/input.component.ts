import {
  Component, EventEmitter, ViewChild,
  Output, Input, ElementRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbBaseComponent } from '../base.component';

@Component({
  selector: 'mo-wb-components-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputComponent extends MoWbBaseComponent {

  inputWidth: string;
  extendClass: string;
  isFocus: boolean;
  invalidError: boolean;
  emptyError: boolean;

  @Input() error: boolean;
  @Input() classInclude: string = '';
  @Input() maxLength: number;
  @Input() value: string;
  @Input() isRequired: boolean = true;
  @Input() enable: boolean = true;
  @Input() readOnly: boolean = false;
  @Input() width: string = '100%';
  @Input() title: string;
  @Input() label: string;
  @Input() showIconSearch: boolean;
  @Input() placeholder: string = 'i18n_import_content';
  @Input() note: string = '';
  @Input() inputType: string = 'text';
  @Input() requireNote: string = '';
  @Input() toolTip: string;
  @Input() require: string;
  @Input() emptyErrorMsg: string = 'i18n_valid_empty_message';
  @Input() invalidMsg: string = 'i18n_message_error_is_not_valid';
  @Input() otherErrorMsg: string;
  @Input() validType: 'URL' | 'EMAIL' | 'PHONE' | 'YOUTUBE' | 'OTHER' | 'NONE' = 'NONE';
  @Input() isMultiple: boolean = false;
  @Input() inputHeight: number = 80;
  @Input() tooltipWidth: number = 200;
  @Input() hideTextRequire: boolean = false;
  @Input() showAsterisk: boolean = false;
  @Input() actionKey: 'KEY-UP' | 'ENTER' = 'ENTER';
  @Input() classTitle: string = '';
  @Input() defaultFocus: boolean = false;

  @Output() onValueChanged = new EventEmitter<string>();
  @Output() onInputError = new EventEmitter<any>();
  @Output() onBlurInput = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  override ngOnInit() {
    this.inputWidth = this.label ? `calc(100% - ${33}px)` : `calc(100% - ${0}px)`;
  }

  override ngAfterViewInit() {
    this.initEvents();
    if (this.defaultFocus){
      this.input.nativeElement.focus();
    }
  }

  initEvents() {
    if (!this.input || !this.input.nativeElement) {
      return;
    }
    this.input.nativeElement.addEventListener('focus', this.handleOnInputFocus);
    this.input.nativeElement.addEventListener('blur', this.handleOnInputBlur);
    this.input.nativeElement.addEventListener('keyup', this.handleOnInputKeyup);
    this.input.nativeElement.addEventListener('paste', this.handleOnPaste);
  }

  isNumeric = (num: number) => {
    return !isNaN(num)
  }

  setValue(value: string) {
    this.value = value;
    this.input.nativeElement.value = value;
    this.reset();
    this.detectChanges();
  }

  getValue() {
    return this.input.nativeElement.value;
  }

  validate() {
    if(this.validType === 'NONE'){
      return true;
    }
    let val = this.input ? this.input.nativeElement.value : this.value;
    if (this.isRequired && (!val || !val.trim())) {
      this.otherErrorMsg = null;
      this.error = true;
      this.invalidError = false;
      this.emptyError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }
    this.emptyError = false;
    if (this.validType === 'URL' && ((!val.trim().includes('https://') && !val.trim().includes('http://')) || !this.urlPatternValidation(val.trim()))) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'YOUTUBE' && !this.validateYouTubeUrl(val.trim())) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'PHONE' && !this.validatePhoneNumber(val.trim())) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'EMAIL' && !this.validateEmail(val.trim())) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.maxLength && val.length > this.maxLength) {
      val = val.substring(0, this.maxLength);
      this.input.nativeElement.value = val;
    }

    this.invalidError = false;
    this.error = false;
    this.onInputError.emit(false);
    return true;
  }

  validatePhoneNumber(tel: string){
    if(!tel || tel.length >= 12){
      return false;
    }
    const regExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return regExp.test(tel);
  }

  validateEmail(email: string){
    if(!email){
      return false;
    }
    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regExp.test(email);
  }

  validateYouTubeUrl(url: string) {
    if (url != undefined || url != '') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length == 11) {
        return true;
      }
    }
    return false;
  }

  urlPatternValidation = (URL: string) => {
    const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
    return regex.test(URL);
  };

  reset() {
    this.error = false;
    this.emptyError = false;
    this.invalidError = false;
    this.detectChanges();
  }

  focus(){
    this.input.nativeElement.focus();
    this.detectChanges();
  }

  handleOnInputFocus = (e: any) => {
    this.isFocus = true;
    this.detectChanges();
  }

  handleOnInputBlur = (e: any) => {
    this.isFocus = false;
    this.onBlurInput.emit({});
    this.detectChanges();
  }
  

  handleOnInputKeyup = (e: any) => {
    this.handleValueChange(e);
  }

  handleOnPaste = (e: any) => {
    setTimeout(() => {
      this.handleValueChange(e);
    }, 20);
  }

  handleValueChange(e: any) {
    if (!this.enable) {
      return;
    }
    if (!this.validate()) {
      this.detectChanges();
      return;
    }

    let val = this.input.nativeElement.value;
    this.value = val;
    this.detectChanges();

    const keyCode = e.keyCode;
    if (this.actionKey === 'ENTER') {
      if (keyCode === 13) {
        this.onValueChanged.emit(val);
      }
      return;
    }
    this.onValueChanged.emit(val);
  }

  handleOnClick(event: MouseEvent) {
    event.stopPropagation();
  }

  override ngOnDestroy() {

  }
}
