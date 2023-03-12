import { Component, OnInit, EventEmitter, ViewChild,Output, Input,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component';
import { MoWbMediaStoreFileComponent } from '../file/media-store-file.component';
import { MoWbMediaStoreFolderComponent } from '../folder/media-store-folder.component';
// import { MoWbFileApiService } from 'src/app/service/fileApiService';

@Component({
  selector: 'mo-wb-media_store_modal',
  templateUrl: './media-store-modal.component.html',
  styleUrls: ['./media-store-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreModalComponent implements OnInit {
  
  @Input() zIndex: number = 1210;
  @Input() maxTotalFileSize: number = 0; // MB unit
  @Input() maxSelected: number = 10;
  @Input() multiple: boolean = true;
  @Input() mode: 'FILE' | 'IMAGE' | 'ALL' = 'ALL';
  @Input() maxImageSize: number = 5000000;
  @Input() maxFileSize: number = 10000000; 
  @Input() selectedFileUrls: string[] = [];

  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectedFiles = new EventEmitter<any[]>();

  @ViewChild('modal') modalRef: MoWbModalComponent;
  @ViewChild('fileStore') fileStoreRef: MoWbMediaStoreFileComponent;
  @ViewChild('folder') folderRef: MoWbMediaStoreFolderComponent;

  constructor(private _changeDetection: ChangeDetectorRef,) {}

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit(): void {
    this.showModal();
    
  }
  async initData() {
  }

  handleOnFolderSelect(groupId: string) {
    this.fileStoreRef.maxTotalFileSize = this.maxTotalFileSize;
    this.fileStoreRef.selectedFileUrls = this.selectedFileUrls;
    this.fileStoreRef.folderList = this.folderRef.getFolderListItems();
    this.fileStoreRef.maxFileSize = this.maxFileSize;
    this.fileStoreRef.maxImageSize = this.maxImageSize ;
    this.fileStoreRef.multiple = this.multiple;
    this.fileStoreRef.mode = this.mode;
    this.fileStoreRef.loadFileList(groupId);
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }

  handlerClickButtonClose(){
    this.modalRef.hide();
    this._changeDetection.detectChanges();
    this.onClose.emit({});
  }

  handleOnCancel() {
    this.modalRef.hide();
    this.onClose.emit({});
  }

  handleOnSelectedFiles(files: any[]) {
    this.hideModal();
    this.onSelectedFiles.emit(files);
  }

  handleOnSelectFilesClick(event: any) {
    event.stopPropagation();
    const selectedFiles = this.fileStoreRef.getSelectedFiles();
    if (selectedFiles.length) {
      this.hideModal();
      this.onSelectedFiles.emit(selectedFiles);
    }
  }

  public showModal() {
    this.modalRef?.open();
  }

  public hideModal() {
    this.modalRef.hide();
    this.onClose.emit({});
  }

}
