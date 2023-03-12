
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
// import { MoLandingEditorCompPopupLinkWebComponent } from './web/web.component';
// import { MoLandingEditorCompPopupLinkEmailComponent } from './email/email.component';
// import { MoLandingEditorCompPopupLinkPhoneComponent } from './phone/phone.component';
// import { MoLandingEditorCompPopupLinkFileComponent } from './file/file.component';
// import { MoLandingEditorCompPopupLinkJumpTopBotComponent } from './jump-top-bot/jump-top-bot.component';
// import { MoLandingEditorCompBaseLinkComponent } from './base-link.component';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from './base-link.component';
// import { DomComponent, GLOBAL } from '../../editor-wrapper';
// import { MoWbPopupWrapperComponent } from '../../../../components/popup/popup_wrap.component';
@Component({
  selector: 'mo-wb-landing-editor-popup-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPopupLinkComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;
  error: boolean = false;
  isFirstSetData: boolean = true;
  type: string = '';
  listItem: any[] =[];
  @Input() listRadioLink: any[] = [
    {
      id: 1,
      title: 'Không có',
      key: 'NONE',
    },
    {
      id: 2,
      title: 'Trang',
      key: 'PAGE',
    },
    {
      id: 3,
      title: 'Địa chỉ web',
      key: 'WEB',
    },
    {
      id: 4,
      title: 'Neo',
      key: 'ANCHOR',
      
    },
    {
      id: 5,
      title: 'Đầu trang/Cuối trang',
      key: 'TOP/BOT',
    },
    {
      id: 6,
      title: 'Tải File',
      key: 'FILE',
    },
    {
      id: 7,
      title: 'Email',
      key: 'EMAIL',
    },
    {
      id: 8,
      title: 'Số điện thoại',
      key: 'PHONE',
    },
    {
      id: 9,
      title: 'Hộp bật lên',
      key: 'LIGHTBOX',
     },
  ]


  @Input() rule: string = '';
  @Output() getDataLink = new EventEmitter<any>();  
  @ViewChild('content') contentRef!: MoLandingEditorCompBaseLinkComponent;
  

  override ngOnInit() {
    this.initData();
  }
  
  override ngAfterViewInit() {
    this.contentRef.setData();
  }

  override ngOnDestroy() {
  }

  

  initData(){
    const selectedModal = GLOBAL.editor.getSelected();
    const attrs = selectedModal.getAttributes();
    const currentType = attrs['link-type'];
    if(currentType === 'NONE'){
      this.type = 'PHONE';
      return;
    }
    this.type = currentType ? currentType : 'PHONE';
    this.detectChanges();
  }

  handlerSelectOption(event: any) {
    console.log(event);
    this.type = event.key;
    this.detectChanges();
  }


  addAttrsType(){
    const selectedModal = GLOBAL.editor.getSelected();
    const attrs = selectedModal.getAttributes();

    attrs['link-type'] = this.type;
    selectedModal.setAttributes(attrs, {});
    this.detectChanges();
  }


  handlerOnAgreePopup(event: any) {
    this.error = this.contentRef.checkError();
    this.detectChanges();
    this.addAttrsType();
    this.contentRef.agree();
    this.getDataLink.emit(this.contentRef.getData());
  }
}
