
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
// import { MoWbPopupWapperComponent } from 'src/app/components/popup/popup_wapper.component';
import { MoWbMediaStoreModalComponent } from 'src/app/media-store/store-modal/media-store-modal.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from '../base-link.component';

interface IActionItem {
  actionKey: 'CLOSE' | 'DOWNLOAD' | 'REDIRECT' | 'NONE';
  actionName?: string;
  downloadUrl?: string;
  downloadType?: 'LINK' | 'MEDIA' | 'UPLOAD';
  redirectUrl?: string;
  isOpenTap?: boolean;
}
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class MoLandingEditorCompPopupLinkFileComponent extends MoLandingEditorCompBaseLinkComponent {
  
  // selectedComp: DomComponent;
  // moType: string;
  error: boolean = false;
  loading: boolean = false;
  zIndex: number = 10000;
  actions: IActionItem[] = [
    {
      actionKey: 'DOWNLOAD',
      downloadType: 'LINK'
    }
  ];

  
   
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.initActionData();
  }

  override ngOnDestroy() {
  }

  override agree(): void {
    this.onLinkFile();
    this.detectChanges();
  }

  override checkError(): boolean {
    return this.error;
  }

  initActionData() {
    const selectedModel = GLOBAL.editor.getSelected();
    if (!selectedModel) {
      return;
    }
    const attrs = selectedModel.getAttributes();
    this.actions = attrs['actions'] ? JSON.parse(attrs['actions']) :[
      {
        actionKey: 'DOWNLOAD',
        downloadType: 'LINK'
      }
    ];
    this.detectChanges();
  }


  async uploadFile(file: any){
    const response = await this._buttonService.uploadFile(file.file, '', file.name);
    this.loading = false;
    if (response && response.code === 200) {
      this.actions[0].downloadUrl = response.data.url;
    }
    this.detectChanges();
  }

  copyFileUrl() {
    var textArea = document.createElement("textarea");
    textArea.value = this.actions[0].downloadUrl || '';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
  }

  getDataAction(){
    return this.actions;
  }

  onLinkFile(){
    const data = this.getDataAction();
    if(!data){
      return;
    }
    const modal = GLOBAL.editor.getSelected();
    if(!modal){
      return;
    }
    const attrs = modal.getAttributes();
    console.log('data:', data);
    attrs['actions'] = JSON.stringify(data);

    modal.setAttributes(attrs, {});
    this.detectChanges();
  }

  handleOnInputError(error: boolean){
    this.error = error;
    this.detectChanges();
  }

  handleOnDownloadUrlChanged(val: string){
    this.actions[0].downloadUrl = val;
  }


  handleOnActionFileChanged(actionFileType: 'LINK' | 'MEDIA' | 'UPLOAD') {
    this.actions[0].downloadType = actionFileType;
    this.actions[0].downloadUrl = '';
    this.error = false;
    this.detectChanges();
  }

  handleOnFileUploadChanged(event: any){
    if (!event || !event.length) {
      return;
    }
    this.loading = true;
    this.detectChanges();
    console.log('file:', event);
    
    this.uploadFile(event[0]);
  }

  handleOnUploadSuccess(event: any){

  }

  handleOnCopyUrl(event: any){
    this.copyFileUrl();
  }
  showMediaLibrary() {
    const modalRef: any = this._componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreModalComponent).create(this._injector);
    modalRef.instance.mode = 'FILE';
    modalRef.instance.multiple = false;
    modalRef.instance.zIndex = this.zIndex;
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onSelectedFiles.subscribe((files: any[]) => {
      if (files.length) {
        this.actions[0].downloadUrl = files[0].origin_url;
        this.detectChanges();
      }
    });

    this._domService.addDomToBody(modalRef);
    modalRef.instance.showModal();
  }

  handleOnSelectMediaClick(event: any){
    this.showMediaLibrary();
  }




}
