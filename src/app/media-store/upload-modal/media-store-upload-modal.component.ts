import { Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, Injector,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbModalComponent } from './../../components/modal/modal.component';
import { MoWbMediaStoreUploadComponent } from '../upload/media-store-upload.component';
import { MoWbDropdownComponent } from 'src/app/components';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { ToastTranslateService } from 'src/app/service/common/toast-translate.service';
// import { DefineConstants } from 'lib/src/app/common/define/constants.define';

@Component({
  selector: 'mo-wb-media_store_upload_modal',
  templateUrl: './media-store-upload-modal.component.html',
  styleUrls: ['./media-store-upload-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreUploadModalComponent implements OnInit {
  
  loading: boolean;
  fileExtList: string[]= ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
  imgExtList: string[]= ['gif', 'jpg', 'jpeg', 'png'];
  uploadFinished: boolean;
  modalHeight: string = '463px';
  fileListHeight: string = 'auto';

  @Input() zIndex: number = 1200;
  @Input() limitFile: number = 10;
  @Input() maxImageSize: number = 5*1024*1024;
  @Input() maxFileSize: number = 10*1024*1024;
  @Input() type: 'FILE' | 'IMAGE' | 'ALL' = 'ALL';
  @Input() folderId: string = null;
  @Input() folderListItems: any[] = [];

  @Output() onClose = new EventEmitter<any>();
  @Output() onUploadOk = new EventEmitter<any>();
  
  @ViewChild('modal') modalRef: MoWbModalComponent;
  @ViewChild('upload') uploadRef: MoWbMediaStoreUploadComponent;
  @ViewChild('folder') folderRef: MoWbDropdownComponent;
  @ViewChild('container') containerRef: ElementRef;
  @ViewChild('containerTop') containerTopRef: ElementRef;

  constructor(
    // private componentFactoryResolver: ComponentFactoryResolver,
    // private _domService: AddComponentToBodyService,
    // private injector: Injector,
    // private _fileApiService: MoFileApiService,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
  ) {}

  ngOnInit() {
    this.changeDetection.detectChanges();
  }

  setSelectedFolder(){
    let nameFolder = '';
    if(this.folderId === null){
      nameFolder = 'i18n_default'
    }

    this.folderListItems.forEach(item => {
      if(item.id === this.folderId){
        nameFolder = item.name;
      }
    });

    this.folderRef.setSelectedId(nameFolder)
    this.changeDetection.detectChanges();
    
  }

  handlerClickButtonClose(){
    this.modalRef.hide();
    this.changeDetection.detectChanges();
    this.onClose.emit({});
  }


  ngAfterViewInit() { 
    setTimeout(() => {
      this.updateModalHeight();
      // console.log('folderId ', this.folderId);
      this.setSelectedFolder();
    }, 0);
    this.showModal();
    this.changeDetection.detectChanges();
  }

  handleOnCancelModal() {
    this.hideModal();
    this.onClose.emit({});
  }

  handleOnSaveClick() {
    this.uploadFiles();
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }

  handleOnFileItemClick(e: any) {
    e.preventDefault();
		e.stopPropagation();
  }

  handleOnSelectFolder(event: any) {
    console.log(event);
    if(!event.id){
      return;
    }
    // if (!event.keys.length) {
    //   this.folderId = undefined;
    //   return;
    // }
    this.folderId = event.id;
    this.changeDetection.detectChanges();
    this.updateModalHeight();
  }

  handleOnFileUploadChanged(files: any[]) {
    this.updateModalHeight();
  }

  handleOnUploadValidationFailed(event: any) {
    this.uploadFinished = false;
    this.loading = false;
    this.updateModalHeight();
  }

  handleOnUploadSuccess(event: any) {
    this.uploadFinished = false;
    this.loading = false;
    this.updateModalHeight();
    this.onUploadOk.emit({});
    setTimeout(() => {
      this.hideModal();
    }, 100);
  }

  public showModal() {
    this.modalRef?.open();
    this.changeDetection.detectChanges();
  }

  public hideModal() {
    this.modalRef.hide();
    this.changeDetection.detectChanges();
  }

  uploadFiles() {
    if(!this.validate()){
      return;
    }
    this.uploadFinished = false;
    this.loading = true;
    this.uploadRef.uploadFiles(this.folderId);
    this.changeDetection.detectChanges();
  };

  validate() {
    let isValid = true;
    if (!this.folderRef?.validate()) {
      isValid = false;
    }

    if (!this.uploadRef?.validate()) {
      isValid = false;
    }
    // console.log(this.folderRef);
    this.updateModalHeight();
    return isValid;
  }
  

  updateModalHeight = () => {
    setTimeout(() => {
      const containerTopHeight = this.containerTopRef.nativeElement.offsetHeight;
      const containerHeight = this.uploadRef.getModalContainerHeight(containerTopHeight);
      
      this.modalHeight = `${containerHeight + 104}px`;
      this.changeDetection.detectChanges();
    }, 0);
    this.changeDetection.detectChanges();
  }

  convertFileSize(size: number, toFixed: number = 2) {
    if (size < 1024*1024) {
      return ` ${(size / 1024).toFixed(toFixed)} KB`;
    }
    return ` ${(size / (1024*1024)).toFixed(toFixed)} MB`;
  }

}
