import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { DomComponent } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-form-edit-tabs',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorEditTabsComponent extends MoLandingEditorInspectorBaseComponent {

 @Output() titleTab: EventEmitter<any> = new EventEmitter(); 
 @Output() onClose: EventEmitter<any> = new EventEmitter();
 @Output() activeTab: EventEmitter<any> = new EventEmitter();
 @Input() index: number; 
 url: string;
 selectorWrapper: string = '.mo-tabs-container';
 slcItem: string = 'li';
 tabTitle: string;
 tabActive: boolean;

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
    const comp: DomComponent = this.selectedComp.find(this.selectorWrapper)[0].find(this.slcItem)[this.index];
    this.tabTitle = comp.find('label')[0].view.$el[0].innerText;
    this.tabActive = comp.find('input')[0].view.el.hasAttribute('checked') ? true : false;
    this.detectChanges();
  }

  handleOnClosePopup(e: any){
    this.onClose.emit({})
  }

  handleOnChangeTabTitle(value: string){
    this.tabTitle = value;
  }

  handleSettingTabTitle(e: any){
    this.activeTab.emit(this.tabActive);
    this.titleTab.emit(this.tabTitle);
  }

  onInputError(e: any){
    this.tabTitle = null;
  }

  handleOnChangeTabActive(e: any){
    this.tabActive = e.active;
  }

}
