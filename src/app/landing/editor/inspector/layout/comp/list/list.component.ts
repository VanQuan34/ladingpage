import { style } from '@angular/animations';
import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { MoLandingEditorInspectorMenuOfListControlComponent } from './menu/menu.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-list-controller',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorListControllerComponent extends MoLandingEditorInspectorBaseComponent {

  @Input() totalItem : number;
  selectorWrapper: string = '.mo-repeater-item-container';
  selectorItem: string = '.mo-comp-container';
  @Input() onShow: boolean = false;
  toggleList : boolean = false;
  listId: Array<any> ;
  topList: number;
  leftList: number;
  receivedData: string;
  @ViewChild('list') _list: ElementRef;

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
    if(this.selectedComp.find(this.selectorWrapper).length == 0) return;
    if (GLOBAL.editor.getSelected().find(this.selectorItem).length === 0) {
      this.listId = [];
      return;
    }
    this.listId  =  GLOBAL.editor.getSelected().find(this.selectorItem).map((item: any)=>{
      return item.getId();
    });
    this.totalItem = this.selectedComp.find(this.selectorItem).length ;
  }

  handleOnClickListController(){
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorMenuOfListControlComponent);
    const componentRef = componentFactory.create(this._injector);
    this.setPosition(this._list);
    componentRef.instance.topList = this.topList + 30;
    componentRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(componentRef);
    });
    componentRef.instance.totalItemRepeat.subscribe((value: any) => { 
      this.totalItem = value;
      if(this.totalItem === 0){
        this._domService.removeComponentFromBody(componentRef);
      }
      this.detectChanges();
    });
    this._domService.addDomToBody(componentRef);
    this.setValue();
    this.detectChanges();
  }
  

  setPosition(elementRef: any) {
    const targetRect = elementRef.buttonEl.nativeElement.getBoundingClientRect();
    this.topList = Math.min(window.innerHeight - this.height - 10, targetRect.top ) ;
  }

}
