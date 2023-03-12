import {
  Component, OnInit, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import { MoWbModalComponent } from '../../../components/modal/modal.component';
import { ToastTranslateService } from '../../../api/common/toast-translate.service';
import { MoFontApiService } from '../../../api/fontApi';


@Component({
  selector: 'mo-wb-font-management-modal-delete',
  templateUrl: './modal-delete-font.component.html',
  styleUrls: ['./modal-delete-font.component.scss'],
  providers: [MoFontApiService]
})
export class MoWbFontManagementModalDeleteComponent implements OnInit {

  width:number = 598
  height:number = 209
  zIndex:number = 6000
  label: string = 'i18n_push_notification_popup_message'
  loading: boolean = false;
  
  @Input() selectedId: Array<any> =[]
  @Input() deleteDetailItem: boolean = false;
  @Input() nameFont: string = '';

  @Output() onClose = new EventEmitter<any>();
  @Output() onRefreshFont = new EventEmitter<any>();

  @ViewChild('modal') modal!: MoWbModalComponent;


  constructor(
    private changeDetection: ChangeDetectorRef,
    private _fontService: MoFontApiService,
    private _toast: ToastTranslateService
  ){}

  ngOnInit(): void {
  }

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
  
  async handlerDeleteFont(ids: any){
    const response = await this._fontService.deleteListFont(ids)
    if(!response || response.code!==200){
      this._toast.show('error', response.message);
      return;
    }
    
    this.onRefreshFont.emit({});
    this._toast.show('success', 'i18n_notification_manipulation_success');
  }

  HandlerOnDeleteFont(){
    this.handlerDeleteFont(this.selectedId)
    this.close()
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
