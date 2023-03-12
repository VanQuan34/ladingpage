import { Component, OnInit, EventEmitter, ViewChild,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component';
// import { MoLibValidComponent } from 'lib/src/app/components/input/valid/valid.component';
// import { MoWbFolderApiService } from 'src/app/service/folderApiService';
// import { ToastTranslateService } from 'src/app/service/common/toast-translate.service';
import { DefineConstants } from 'src/app/common/define/constants.define';
import { MoWbInputComponent } from 'src/app/components';
import { MoWbFolderApiService } from 'src/app/api/folderApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';


@Component({
  selector: 'mo-wb-media_store_folder_add_edit',
  templateUrl: './media-store-folder-add-edit.component.html',
  styleUrls: ['./media-store-folder-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreFolderAddEditComponent implements OnInit {
  
  loading: boolean;
  data: {
    name: string;
  } = {
    name: ''
  };
  remainNumber: number = 20;
  modalHeight: string = '179px';

  @Input() name: string = '';
  @Input() folderId: string;
  @Input() zIndex: number = 1200;

  @Output() onClose = new EventEmitter<any>();
  @Output() onOk = new EventEmitter<any>();
  @ViewChild('modal') modalRef: MoWbModalComponent;
  // @ViewChild('input') inputRef: MoLibValidComponent;
  @ViewChild('input') inputRef: MoWbInputComponent;

  constructor(
    private _folderApiService: MoWbFolderApiService,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.initData();
    }, 0);
    this.changeDetection.detectChanges();
  }

  ngAfterViewInit() { 
    this.showModal();
    this.changeDetection.detectChanges();
   }

  initData() {
    this.data = {
      name: this.name || ''
    };
    if (this.name) {
      this.remainNumber =  Math.max(20 - this.data.name.length, 0);
    }
    this.changeDetection.detectChanges();
  }

  public showModal() {
    this.modalRef?.open();
  }

  public hideModal() {
    this.modalRef.hide();
  }

  handlerClickButtonClose(){
    this.modalRef.hide();
    this.changeDetection.detectChanges();
    this.onClose.emit({});
  }

  validate() {
    const isValid = this.inputRef.getValue;
    if (!isValid) {
      this.modalHeight = '190px';
      return false;
    }

    if (this.data.name.length > 20) {
      this._toast.show(
        'error',
        'i18n_name_folder_exceed_note'
      );
      return false;
    }
    return true;
  }

  async addNewFolder() { 
    this.loading = true;
    this.changeDetection.detectChanges();
    const name = this.data.name.trim();
    const response = await this._folderApiService.addNewFolder(name);
    this.loading = false;
    this.changeDetection.detectChanges();
    if (response) {
      this.onOk.emit(response.data);
      this.modalRef.hide();
      this._toast.show(
        'success','i18n_notification_manipulation_success'
        //`Thêm thư mục ${name} thành công!`
      );
    }
  }

  async editFolder() {
    this.loading = true;
    this.changeDetection.detectChanges();
    const name = this.data.name.trim();
    const response = await this._folderApiService.editFolder(name, this.folderId);
    this.loading = false;
    this.changeDetection.detectChanges();
    if (response) {
      this.onOk.emit(name);
      this.modalRef.hide();
      this._toast.show(
        'success','i18n_notification_manipulation_success'
        //`Sửa tên thư mục ${name} thành công!`
      );
    }
  }

  handleOnNameChanged(val : string) {
    this.data.name = val ;
    this.remainNumber = Math.max(0, 20 - this.data.name.trim().length);
    if (this.data.name) {
      this.modalHeight = '179px';
    } else {
      this.modalHeight = '190px';
    }
    this.changeDetection.detectChanges();
  }

  handleOnEventChange(event: any) {
    // console.log('handleOnEventChange event=', event);
  }
  
  handleOnCancelModal() {
    this.hideModal();
    this.onClose.emit({});
  }

  handleOnSaveClick() {
    if (this.validate()) {
      if (!this.folderId) {
        this.addNewFolder();
      } else {
        this.editFolder();
      }
    }
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }
}
