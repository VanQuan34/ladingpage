import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { DomComponent } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-form-edit-accordion',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorEditAccordionComponent extends MoLandingEditorInspectorBaseComponent {

 @Input() headTitle: string; 
 @Output() onClose: EventEmitter<any> = new EventEmitter();
 @Output() showContent: EventEmitter<any> = new EventEmitter();
 @Output() newTitle: EventEmitter<any> = new EventEmitter();
 url: string;
 selectorWrapper: string = '.mo-accordion-container';
 selectorTitle: string = '.head-title';
 titleAcc: string;
 onShow: boolean;

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
    if(this.selectedComp.find(this.selectorTitle).length === 0 ) return;
    const comp: DomComponent = this.selectedComp.find(this.selectorTitle)[0];
    this.titleAcc = comp.view.$el[0].innerText;
    this.onShow = this.selectedComp.find('input').length !== 0 && this.selectedComp.find('input')[0].view.el.hasAttribute('checked') ? true : false;
    this.detectChanges();
  }

  handleOnClosePopup(e: any){
    this.onClose.emit({})
  }

  handleOnChangeTabTitle(value: string){
    this.titleAcc = value;
  }

  handleSettingTabTitle(e: any){
    this.showContent.emit(this.onShow);
    this.newTitle.emit(this.titleAcc);
  }

  onInputError(e: any){
    this.titleAcc = null;
  }

  handleOnChangeTabActive(e: any){
    this.onShow = e.active;
  }

}
