import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChildren, QueryList
} from '@angular/core';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { uid } from 'uid';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-change-name-item-repeater',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorChangeNameItemRepeater extends MoLandingEditorInspectorBaseComponent {
  
  @Output() changeName = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @Input() top: number;
  @Input() left: number;
  titleItem: string;

  override onInit() {
   
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
    this.titleItem = this.selectedComp.view.el.getAttribute('data-title') || 'Mục';
  }

  handleOverlayClick(){
    this.onClose.emit({})
  }
  

  handleOnContentChange(e: any){
    this.titleItem = e;
    this.detectChanges();
  }

  handleOnSubmitContentChange(e: any){
    this.selectedComp.view.el.setAttribute('data-title', this.titleItem);
    this.changeName.emit(this.titleItem);
    this.onClose.emit({});
    this.detectChanges();
  }

  handleOnInputContentError(e: any){
   console.log('error');
  }

}
