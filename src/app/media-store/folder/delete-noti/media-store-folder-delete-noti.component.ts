import { Component, OnInit, EventEmitter, ViewChild,
  Output, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { MoWbFolderApiService } from 'src/app/api/folderApiService';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'mo-wb-media_store_folder_delete_noti',
  templateUrl: './media-store-folder-delete-noti.component.html',
  styleUrls: ['./media-store-folder-delete-noti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreFolderDeleteNotiComponent implements OnInit {

  loading: boolean = false;

  @Input() hasFile: boolean;
  @Input() name: string = '';
  @Input() id: string;
  @Input() zIndex: number = 2500;
  
  @Output() onClose = new EventEmitter<any>();
  @Output() onOk = new EventEmitter<any>();

  @ViewChild('modal') modalRef: MoWbModalComponent;

  constructor( 
    private _folderApiService: MoWbFolderApiService,
    private changeDetection: ChangeDetectorRef,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() { }

  public showModal() {
    this.modalRef.open();
  }

  public hideModal() {
    this.modalRef.hide();
  }

  handlerClickButtonClose(){
    this.modalRef.hide();
    this.changeDetection.detectChanges();
    this.onClose.emit({});}
  
  handleOnCancelModal() {
    this.hideModal();
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }

  handleOnOkClick() {
    this.hideModal();
    this.deleteFolder();
  }

  async deleteFolder() {
    this.loading = true;
    const response = await this._folderApiService.deleteFolder([this.id]);
    this.loading = false;
    if (response) {
      this.onOk.emit({});
    }
  }

}
