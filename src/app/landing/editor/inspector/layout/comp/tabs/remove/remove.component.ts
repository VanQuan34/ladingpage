import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { DomComponent } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-form-remove-tabs',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorRemoveTabsComponent extends MoLandingEditorInspectorBaseComponent {

 @Output() onClose: EventEmitter<any> = new EventEmitter();
 @Output() removeTab: EventEmitter<any> = new EventEmitter();
 @Input() tabTitle: string;
 @Input() idx: number;  

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
    this.detectChanges();
  }

  handleOnClosePopup(e: any){
    this.onClose.emit({})
  }

  handleRemoveTabTitle(e: any){
    this.removeTab.emit({});
  }

}
