import { Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, Injector,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component';
// import { AddComponentToBodyService } from 'lib/src/app/service/common/add-component-to-body.service';
// import { MoWbFolderApiService } from 'src/app/service/folderApiService';
// import { MoLibValidComponent } from 'lib/src/app/components/input/valid/valid.component';
import { MoWbDropdownComponent } from 'src/app/components';
// import { ToastTranslateService } from 'src/app/service/common/toast-translate.service';
import { MoWbFolderApiService } from 'src/app/api/folderApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { DefineConstants } from 'lib/src/app/common/define/constants.define';

@Component({
  selector: 'mo-wb-media_edit_add_new',
  templateUrl: './media-store-edit-add-new.component.html',
  styleUrls: ['./media-store-edit-add-new.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreEditAddNewFileComponent implements OnInit {
  
  loading: boolean;
  zIndex: number = 3000;
  data: {
    name: string
  }
  remainNumber: number = 20;
  modalHeight: string = '180px';

  @Input() folderId: string = null;
  @Input() folderListItems: any[] = [];

  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectFolder = new EventEmitter<any>();
  
  @ViewChild('modal') modalRef: MoWbModalComponent;
  @ViewChild('folder') folderRef: MoWbDropdownComponent;
  // @ViewChild('name') inputNameRef: MoLibValidComponent;
  @ViewChild('container') containerRef: ElementRef;


  constructor(
    private _folderApiService: MoWbFolderApiService,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
  ) {}

  ngOnInit() {
    this.data = {
      name: ''
    }
  }

  ngAfterViewInit() { 
    this.showModal();
    setTimeout(() => {
      this.fetchFolderList();
    }, 0);
  }

  async fetchFolderList() {
    this.loading = true;
    this.changeDetection.detectChanges();
    const response = await this._folderApiService.getFolderList();
    this.folderListItems = [];
    this.folderListItems.splice(0,0, {
      id : null,
      name: 'i18n_default',
      count: response.count_default
    });

    for (let i = 0; i < response.list.length; i++) {
      this.folderListItems.push(response.list[i]);
    }
    this.loading = false;
    this.changeDetection.detectChanges();
  }

  handlerClickButtonClose(){
    this.modalRef.hide();
    this.changeDetection.detectChanges();
    this.onClose.emit({});
  }

  handleOnCancelModal(event: any) {
    event.stopPropagation();
    this.hideModal();
  }

  showModal() {
    this.modalRef.open();
  }

  handleOnSelectFolder(event: any) {
    
    // if (!event.keys.length) {
    //   this.folderId = undefined;
    //   return;
    // }
    // this.folderId = event.keys[0];
    this.folderId = event.id;
    // console.log('handleOnSelectFolder folderId=', this.folderId);
    this.updateModalHeight();
  }

  handleOnSaveClick(event: any) {
    
    event.stopPropagation();
    if (!this.validate()) {
      this.updateModalHeight();
      return;
    }
    this.updateModalHeight();
    if (this.folderId === null || this.folderId) {
      this.hideModal();
      this.onSelectFolder.emit(this.folderId);
      return;
    }
  }

  hideModal() {
    this.modalRef.hide();
    this.onClose.emit({});
  }

  handleOnNameChanged() {
    this.remainNumber = Math.max(0, 20 - this.data.name.trim().length);
    this.updateModalHeight();
  }

  validate() {
    let result: boolean = true;
    // if (this.inputNameRef.CheckValid) {
    //   result = false;
    // }
    if (!this.folderRef.validate()) {
      result = false;
    }

    return result;
  }

  updateModalHeight() {
    setTimeout(() => {
      const containerHeight = this.containerRef.nativeElement.offsetHeight;
      this.modalHeight = `${containerHeight + 104 + 24}px`;
    }, 0);
  }
}
