import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { DomComponent } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-form-add-video-gallery',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorAddVideoComponent extends MoLandingEditorInspectorBaseComponent {

 @Output() urlVideo: EventEmitter<any> = new EventEmitter(); 
 @Output() onClose: EventEmitter<any> = new EventEmitter();
 @Input() index: number; 
 url: string;
 selectorWrapper: string = '.mo-gallery-item-container';
 slcItem: string = '.gallery-item';
 typeVideo: string;
 listTypeVideo: Array<object>;

  override onInit() {
    this.listTypeVideo = [
      {
        id : 'youtube',
        name: 'Youtube'
      },
      {
        id : 'other',
        name: 'Loại khác'
      },
    ]
  }

  override onAfterViewInit() {
    setTimeout(() => {
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
  }

  override setValue(): void {
    super.setValue();
    const comp: DomComponent = this.selectedComp.find(this.selectorWrapper)[0].find(this.slcItem)[this.index];
    this.url = comp.view.el.getAttribute('url');
    this.typeVideo = comp.view.el.getAttribute('type-video') || 'youtube';
    this.detectChanges();
  }

  handleOnClosePopup(e: any){
    this.onClose.emit({})
  }

  handleOnUrlChanged(e: any){
   this.url = e;
  }

  handleSettingUrlVideo(e: any){
    this.urlVideo.emit(this.url);
  }
  onInputError(e: any){
    this.url = null;
  }

  handleOnChangeSelectTypeVideo(e: any){
    this.typeVideo = e.id;
    this.selectedComp.find(this.selectorWrapper)[0].find(this.slcItem)[this.index].view.el.setAttribute('type-video', e.id);
    this.detectChanges();
  }

}
