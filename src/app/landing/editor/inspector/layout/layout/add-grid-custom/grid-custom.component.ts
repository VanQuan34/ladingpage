import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild, QueryList, ViewChildren
} from '@angular/core';
// import { DomComponent, GLOBAL } from '../../editor-wrapper';
// import { MoWbPopupWapperComponent } from '../../../../../components/popup/popup_wapper.component';
import { BASE_PATH } from 'src/app/common/define/host-domain.define';
import { MoWbDropdownComponent } from 'src/app/components';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';
import { DomComponent, GLOBAL } from 'src/app/landing/editor/editor-wrapper';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-add-grid-custom',
  templateUrl: './grid-custom.component.html',
  styleUrls: ['./grid-custom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorLayoutAddGridCustomComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;
  apiFetchList: any;
  events: any[] = [];
  col: number = 0;
  row: number = 0;
  ignoreKeys: string[] = [];
  
  




  @Output() onAddGridCustom = new EventEmitter<any>(); 
  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }



  handlerOnAgreePopup(event: any){
    this.onAddGridCustom.emit({col: this.col, row: this.row});
  }


  handleOnRowChange(event: any){
    this.row = event;
    this.detectChanges();
  }
  handleOnColChange(event: any){
    this.col = event;
    this.detectChanges();
  }


}