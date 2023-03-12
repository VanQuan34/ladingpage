import {
  Component, OnInit, EventEmitter,
  Output, Input, ChangeDetectionStrategy, Injector, ViewRef, ViewChildren, QueryList, ElementRef
} from '@angular/core';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MoLandingEditorInspectorEditTabsComponent } from '../edit/edit.component';
import { uid } from 'uid';
import { MoLandingEditorInspectorRemoveTabsComponent } from '../remove/remove.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-list-of-tabs',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorListOfTabsComponent extends MoLandingEditorInspectorBaseComponent {

  totalItem : number;
  notify: boolean = false;
  selectorWrapper: string = '.mo-tabs-container';
  selectorItem: string = 'li';
  selectorTitle: string = '.label-title';
  listId: Array<string> ;
  classActive: any;
  onActive: any;
  isDragged: boolean = false;
  index: number;
  tabTitle: string;
  listTitle: Array<string>;
  @Input() topList: number;
  @Input() leftList: number;
  @Output() onClose = new EventEmitter<any>();

  override onInit() {
  }
  
  override onAfterViewInit() {
    setTimeout(() => {
      this.setValue();
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
  }

  override setValue(): void {
    super.setValue();
    if(!this.selectedComp || !this.selectorWrapper || !this.selectorItem) return;
      this.totalItem = this.selectedComp.find(this.selectorItem).length ;
    if(this.totalItem  === 0) {
      this.onActive = null;
      this.listId = [];
      this.listTitle = [];
      return;
    }
    this.listId =  GLOBAL.editor.getSelected().find(this.selectorItem).map((item: any)=>{
      return item.getId();
    });
    this.onActive = this.selectedComp.find(this.selectorItem).findIndex((item) => item.find('input')[0].view.$el[0].checked);
    this.listTitle = GLOBAL.editor.getSelected().find(this.selectorItem).map((item: any) =>{
      return item.find(this.selectorTitle)[0].view.el.innerText;
    });
  }

  handleOnClickIdSelected(idItem: any, idx: any){
    this.onActive = idx;
    this.classActive === idx;
    this.selectedComp.find(this.selectorItem).forEach((item:any) => {
    item.view.$el.removeAttr('style');
    });
    this.selectedComp.find(this.selectorItem).forEach((item: any) =>{
      item.find('input')[0].view.el.checked = false;
    });
    this.selectedComp.find(this.selectorItem)[idx].find('input')[0].view.$el[0].checked = true;
    this.setValue();
  }

  handleDropItemTabs(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.handleSortHtml(event.container.data, this.selectorWrapper, this.selectorItem);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.setValue();
    this.detectChanges();
  }

  handleOnClickEditTabs(id: string, idx: number){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorEditTabsComponent).create(this._injector);
    popup.instance.index = idx;
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });

    popup.instance.titleTab.subscribe((value: string) => {
      if(value === null || value.trim() === '') return;
      this.tabTitle = value;
      const compSelected = this.selectedComp.find(this.selectorItem)[idx].find('label')[0];
      compSelected.view.el.innerText = value;
      this.setValue();
      this.detectChanges();
    });
    popup.instance.activeTab.subscribe((value: boolean) => {
      if(value === false) return;
      const compSelected = this.selectedComp.find(this.selectorItem)[idx].find('input')[0];
      this.selectedComp.find(this.selectorItem).forEach((item: any) =>{
        item.find('input')[0].view.el.removeAttribute('checked');
      });
      compSelected.view.el.setAttribute('checked', '');
      this.setValue();
      this.detectChanges();
    });
    this._domService.addDomToBody(popup);
  }
  
  /**
   * Duplicate tab or add newTab
   */
  handleOnClickDuplicateTabs(idSelected: any){
    if(this.totalItem === 10){
      this.notify = true;
      return;
    }
    const idTab = `item_${uid()}`;
    const firstComp = this.selectedComp.find(this.selectorItem+':first-child')[0];
    const firstIdContent = firstComp.find('.mo-tab-content')[0].getId().split('_')[0];
    const idContent = firstComp.find('.mo-tab-content')[0].getId().split('_')[1];
    const id = (typeof idSelected !== 'object') ? idSelected : idTab;
    const oldId = id.includes('-') && `${id.split('-')[1]}`;
    const newId = `item_${uid()}`;
    let newHtml: string;
    if(typeof idSelected !== 'object'){
      const html = this.selectedComp.find(`#${id}`)[0].view.el.outerHTML;
      newHtml = html.replaceAll(oldId, newId).replaceAll('checked', '').replace(idContent, uid());
    }
    else{
      newHtml = `<li id="tab-${id}">
      <input type="radio" id="${id}" name="tab">
      <label class="label-title" for="${id}">Tab# </label> 
      <div id="${firstIdContent}_${uid()}" class="mo-tab-content mo-comp-container mo-comp-not-move" mo-type="tab-content" data-mo-type="default"> 
      </div>
    </li>`;
    }

    this.selectedComp.find(this.selectorWrapper)[0].append(newHtml, {});
    this.setValue();
    this.detectChanges();
    this.updateDockingPosInfo();
  }

  handleOnClickRemoveTabs(id: string, index: number){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorRemoveTabsComponent).create(this._injector);
    popup.instance.tabTitle = this.listTitle[index];
    popup.instance.idx = index;
    popup.instance.onClose.subscribe(() => { 
      this._domService.removeComponentFromBody(popup);
    });

    popup.instance.removeTab.subscribe(() => {
    this.notify = false;
    const compTab = this.selectedComp.find(this.selectorItem);
    const compSelected = compTab[index];
    if( compTab.length === 0 ) return;
    compSelected.view.el.remove();
    this.setValue();
    if(this.totalItem === 0){
      GLOBAL.compUtil.removeComp(this.selectedComp);
      return;
    }
    if(compSelected.find('input')[0].view.$el[0].hasAttribute('checked') ){
      if(index === 0){
      compTab[1].find('input')[0].view.el.setAttribute('checked','');
      } else{
        compTab[0].find('input')[0].view.el.setAttribute('checked','');
      }
    }
    if(compSelected.find('input')[0].view.$el[0].checked === true){
      if(index === 0){
      compTab[1].find('input')[0].view.$el[0].checked = true;
      } else{
        compTab[0].find('input')[0].view.$el[0].checked = true;
      }
    }
    this.onActive = this.selectedComp.find(this.selectorItem).findIndex((item) => item.find('input')[0].view.$el[0].checked);
    this.detectChanges();
  });
  this._domService.addDomToBody(popup);
}

}
