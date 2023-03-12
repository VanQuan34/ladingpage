import {
  Component, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../base.component';

import { GLOBAL } from '../../editor-wrapper';
import { MoCompLabel } from 'src/app/common/common-types';

@Component({
  selector: 'mo-wb-landing-editor-inspector-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorBreadcrumbComponent extends MoLandingEditorInspectorBaseComponent {
  compName: string = '';
  containerComps: any[] = [];
  pageComp: any;  
  
  override onInit() {
    const pageModel = GLOBAL.editor.getWrapper().find('.mo-page')[0];
    this.pageComp = {
      model: pageModel,
      label: MoCompLabel[pageModel.getAttributes()['mo-type']]
    };
  }

  override setValue() {
    const selectedComp = GLOBAL.editor.getSelected();
    if (!selectedComp) {
      return;
    }
    const attrs = selectedComp.getAttributes();
    this.moType = attrs['mo-type'];
    // set component name
    this.compName = MoCompLabel[this.moType] || this.moType;
    // get container components list
    const containerComps = selectedComp.getMoContainers();
    this.containerComps = [];
    for (let i=0; i < containerComps.models.length; i++) {
      const model = containerComps.models[i];
      const moType = model.getAttributes()['mo-type'];
      const label = MoCompLabel[moType] || '';
      this.containerComps.splice(0,0,{
        model: model,
        label: label
      });
    }
    if (this.moType !== 'page') {
      this.containerComps.splice(0,0, this.pageComp);
    }
    // console.log('containerComps=', this.containerComps);
    this.detectChanges();
  }

  /**
   * handle breadcrumb item click
   * @param e 
   * @param index 
   */
  handleOnBreadCrumbClick(e: any, index: number) {
    // console.log('handleOnBreadCrumbClick index=', index);
    if (this.containerComps.length <= index || !this.containerComps[index].model) {
      return;
    }
    GLOBAL.editor.select(this.containerComps[index].model);
  }
  
}
