
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, Output
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';

import { MoLandingEditorPopupButtonSettingComponent } from '../../../popup/button/setting/setting.component';
import { MoLandingEditorPopupAnimationComponent } from '../../../popup/animation/animation.component';
import { MoLandingEditorPopupLinkComponent } from '../../../popup/link/link.component';
import { MoLandingEditorPopupActionComponent } from '../../../popup/action/action.component';
import { uid } from 'uid';
import { EditorConstants } from '../../../constants';
import { MoLandingEditorInspectorBaseComponent } from '../../../inspector/base.component';

interface IDsType {
  id: string,
  type: string,
  name: string;
}
const DISPLAY = '--display';
const DS_TYPE = '--ds';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarTableComponent extends MoLandingEditorInspectorBaseComponent { 
  numberTd: number;
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.setValue();
      this.detectChanges()
    }, 0);
  }

  override ngOnDestroy() {
  }
  
  override setValue(): void {
    super.setValue();
    const tbody = this.selectedComp.find('tbody')[0];
    this.numberTd = tbody.find('tr')[0].find('td').length;
    console.log('valueId=',  this.numberTd)
    this.detectChanges();
  }

  /**
   * Duplicate item repeater
   */
  handleOnClickDuplicateItem(e: any){
    const thead = this.selectedComp.find('thead')[0];
    const tbody = this.selectedComp.find('tbody')[0];
    const html_th_new = `
    <th><div class="mo-comp mo-comp-text" resizable="false" draggable="false" removable="false"><p class="font-8 mo-text"></p></div>
    </th>`;
    const html_td_new = `
    <td><div class="mo-comp mo-comp-text" resizable="false" draggable="false" removable="false"><p class="font-8 mo-text"></p></div>
    </td>`;

    thead.find('tr')[0].view.el.insertAdjacentHTML('beforeend', html_th_new);
    tbody.find('tr').forEach(item => {
    item.view.el.insertAdjacentHTML('beforeend', html_td_new);
    });
    this.setValue();
    this.detectChanges();
    this.updateDockingPosInfo();
  }

  handleOnClickAddRowTable(e: any){
    let htmlTd: string = '';
    for(let td = 0; td < this.numberTd ; td++){
      htmlTd += `<td class="block-editor-rich-text__editable wp-block-table__cell-content rich-text" role="textbox" aria-multiline="true" aria-label="Body cell text" data-mo-type="cell" data-highlightable="1" style="white-space:pre-wrap;min-width:1px;">&#xFEFF</td>`;
    }
    const tbody = this.selectedComp.find('tbody')[0];
    const tr = `<tr>${htmlTd}</tr>`;
    // console.log('numberTd', this.numberTd);
    tbody.view.el.insertAdjacentHTML('beforeend', tr);
    // const table: any = this.selectedComp.find('table')[0].view.el;
    // const newRow = table.insertRow(2);
    // for (var i = 0; i < 3; i++) {
    //   var newCell = newRow.insertCell(i);
    //   newCell.innerHTML = '<div class="mo-comp" resizable="false" draggable="false" removable="false" moveable="" mo-type="text" data-mo-type="default" data-highlightable="1"><p class="font-8 mo-text" data-highlightable="1" data-mo-type="text">Column' + (i+1) + '</p></div>';
    // }
    this.detectChanges();
    this.updateDockingPosInfo();
  }

}


