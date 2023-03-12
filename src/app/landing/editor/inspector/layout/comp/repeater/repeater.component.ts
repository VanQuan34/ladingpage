import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
interface IDsType {
  id: string,
  type: string,
  name: string;
}
const DISPLAY = '--display';
const DS_TYPE = '--ds';
@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-comps-repeater',
  templateUrl: './repeater.component.html',
  styleUrls: ['./repeater.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorRepeaterComponent extends MoLandingEditorInspectorBaseComponent {

  dsTypes: IDsType[] = [];
  dsType: string;
  selectorContainer = '.mo-repeater-item-container';
  override onInit() {
    this.dsTypes = [
    {
      id: 'card',
      type: 'flex',
      name: 'Thẻ'
    },
    {
      id: 'list',
      type: 'flex',
      name: 'Danh sách'
    },
    {
      id: 'slide',
      type: 'flex',
      name: 'Thanh Trượt'
    },
    {
      id: 'cell',
      type: 'grid',
      name: 'Ô lưới'
    },
    ];
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
    if(this.selectedComp.getAttributes()['mo-type'] === 'repeater'){
      const selected = this.selectedComp.find(this.selectorContainer).length && this.selectedComp.find(this.selectorContainer)[0];
      if(selected){
        this.dsType =this.getStyle()[DS_TYPE] && this.getStyle()[DS_TYPE].trim();
      }
      this.detectChanges();
    }
  }
  
/**
 * Change display type
 * @param event  
 */
  handleOnSelectDisplayType(event: any){  
    if (this.selectedComp.find(this.selectorContainer).length === 0) return; 
    this.dsType = event.id;
    this.setStyle(event.type, DISPLAY);
    this.setStyle(event.id, DS_TYPE);
  }

}
