import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChildren, QueryList
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { uid } from 'uid';
import { MoLandingEditorInspectorBaseComponent } from 'src/app/landing/editor/inspector/base.component';
import { MoLandingEditorInspectorChangeNameItemRepeater } from '../item/item.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-sub-menu-of-list',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorSubMenuOfListComponent extends MoLandingEditorInspectorBaseComponent {
  
  @Input() idSelected: string;
  @Output() eventSubmenu = new EventEmitter<any>();
  @Output() changeTitle = new EventEmitter<any>();
  @Output() newName = new EventEmitter<any>();
  @Output() hiddenSub = new EventEmitter<any>();
  
  selectorWrapper: string = '.mo-repeater-item-container';
  selectorItem: string = '.mo-comp-container';
  numberItem: number;
  listId: Array<string>;
  titleItem: string;
  @Input() top: number;
  @Input() left: number;
  @ViewChild('inputName') _inputName: ElementRef;

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
    if(!this.selectorWrapper || !this.selectorItem) return;
    this.numberItem = this.selectedComp.find(this.selectorItem).length ;
    if(this.numberItem  === 0){
      this.listId = [];
      return;
    }
    this.listId =  GLOBAL.editor.getSelected().find(this.selectorItem).map((item: any)=>{
      return item.getId();
    });
  }

  /**
   * Remove item repeater selected
   */
  handleOnClickRemoveItem(){
    if( this.selectedComp.find(this.selectorWrapper).length != 0 ){
      this.selectedComp.find(`#${this.idSelected}`)[0].view.$el.remove();
      this.updateDockingPosInfo();
    }
    this.setValue();
    if(this.numberItem === 0){
      GLOBAL.compUtil.removeComp(this.selectedComp);
      this.selectedComp.view.el.remove(); // remove html comp 
    }
    this.eventSubmenu.emit({total: this.numberItem, arr: this.listId});
    this.detectChanges();
    this.updateDockingPosInfo();
  }

  /**
   * Duplicate item repeater
   * @param event 
   */

  handleOnClickAddItemRepeater(){
    this.handleDuplicateItem(this.idSelected, this.selectorWrapper, this.selectorItem);
    this.setValue();
    this.eventSubmenu.emit({total: this.numberItem, arr: this.listId});
    this.detectChanges();
  }

  handleOnClickChangeName(){
    this.hiddenSub.emit({});
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorChangeNameItemRepeater);
    const componentRef = componentFactory.create(this._injector);
    this.setPosition(this._inputName);
    componentRef.instance.top = this.top;
    componentRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(componentRef);
    });
    componentRef.instance.changeName.subscribe((value: any) => {
      this.titleItem = value; 
      this.newName.emit(this.titleItem);
    });
    this._domService.addDomToBody(componentRef);
    this.setValue();
    this.detectChanges();
  }

  setPosition(elementRef: any) {
    const targetRect = elementRef.nativeElement.getBoundingClientRect();
    this.top = Math.min(window.innerHeight - this.height - 10, targetRect.top ) ;
  }

}
