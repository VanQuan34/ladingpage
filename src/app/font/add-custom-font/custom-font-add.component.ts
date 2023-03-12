import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MoWbModalComponent } from '../../components/modal/modal.component';
import { MoFontApiService } from '../../api/fontApi';
import { ToastTranslateService } from '../../api/common/toast-translate.service';
import { DefineConstants } from '../../common/define/constants.define';
import { MoWbInputComponent } from '../../components/input/input.component';

@Component({
  selector: 'mo-wb-font-modal-add-custom',
  templateUrl: './custom-font-add.component.html',
  styleUrls: ['./custom-font-add.component.scss'],
  providers: [MoFontApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class MoWbFontAddCustomComponent implements OnInit {
  label: string = 'i18n_add_my_font'
  titleInput: string = 'i18n_name_font'
  buttonTriggerClick: string = ''
  width: number = 598;
  height: number = 313;
  fileLight: any;
  fileRegular: any;
  fileBold: any;
  titleCreateFont: string = ''
  error: boolean = false;
  emptyFiles: boolean= false;
  loading: boolean = false;
  
  @Input() zIndex!: number;
  
  @Output() onClose = new EventEmitter<any>();
  @Output() refreshFontList = new EventEmitter<any>();

  @ViewChild('modal') modal!: MoWbModalComponent;
  @ViewChild('input') inputRef!: MoWbInputComponent;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private _fontService: MoFontApiService,
    private _toast: ToastTranslateService,
  ) { }
  ngOnInit(): void { }

  ngAfterViewInit() {
    this.show();
    this.changeDetection.detectChanges();
  }
  public show() {
    this.modal.open();
  }

  public hideModal() {
    this.modal.hide();
  }

  close() {
    this.hideModal();
    this.onClose.emit({});
  }


  async createMyFont() {
    const response = await this._fontService.createFont('custom_font', '', this.titleCreateFont, '3', this.fileLight, this.fileRegular, this.fileBold)
    if (!response || response.code !== 200) {
      this._toast.show('error', response.message);
      return false;
    }
    this.refreshFontList.emit({});
    this._toast.show('success', 'i18n_notification_manipulation_success');
    return true;
  }

  onReadFileSuccess(e: any) {
    if (e.styleFont === 'Light') {
      this.fileLight = e.file;
    } else if (e.styleFont === 'Regular') {
      this.fileRegular = e.file;
    } else {
      this.fileBold = e.file;
    }
    this.checkEmptyFile();
  }

  handlerInputText(inputVal: any) {
    this.titleCreateFont = inputVal.trim();
  }
  checkInputError(check: boolean){
    this.error = check;
  }


  checkEmptyFile(){
    if(!this.fileLight && !this.fileRegular && !this.fileBold){
      this.emptyFiles = true;
    }else{
      this.emptyFiles = false;
    }
  }

  async onCreateFont(){
    const result = await this.createMyFont()
    
    if(result){
      this.hideModal();
      this.onClose.emit({});
    }
    this.changeDetection.detectChanges();
  }
  
  handlerCreateFont(event: any) {
    this.inputRef.validate();
    this.checkEmptyFile();
    if (this.error===false && this.emptyFiles===false) {
      this.onCreateFont();
      return;
    }
    this.error = false;
  }
  handleOnCloseModal() {
    this.hideModal();
    this.onClose.emit({});
  }

  handleOnCancelModal() {
    this.close();
  }


  ngOnDestroy(): void {
  }

}
