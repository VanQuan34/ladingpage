
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../../base.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { EditorConstants } from '../../../constants';
import { MoCompLabel } from '../../../../../common/common-types';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarBreadcrumbComponent extends MoLandingEditorLayerBaseComponent {

  containerComps: any[] = [];
  breadcrumbOver: boolean = false;

  @Input() posTop: number = 0;
  @Input() posLeft: number = 0;
  @ViewChild('breadcrumbEl') breadcrumbEl: ElementRef;

  override onAfterViewInit() {
    setTimeout(() => {
      this.setValue();
    }, 0);
  } 

  override onDestroy() {
  }

  /**
   * set value
   * @returns 
   */
  override setValue(): void {
    super.setValue();

    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      return;
    }
    this.breadcrumbOver = false;
    // get breadcrumb
    this.getBreadcrumb();

    setTimeout(() => {
      this.setBreadcrumbEvents();
    }, 50);
    this.detectChanges();
  }

  /**
   * get breadcrumb
   */
  getBreadcrumb() {
    const containerComps =  GLOBAL.compUtil.getListMoContainers(this.selectedComp);
    this.containerComps = [];
    for (let i=0; i < containerComps.length; i++) {
      const comp = containerComps[i];
      const moType = comp.getAttributes()['mo-type'];
      const label = MoCompLabel[moType] || moType;
      this.containerComps.splice(0,0,{
        model: comp,
        label: label
      });
    }
    const moType = this.selectedComp.getAttributes()['mo-type'];
    const currentComp = {
      model: this.selectedComp,
      label: MoCompLabel[moType] || moType
    }
    this.containerComps.push(currentComp);
  }

  setBreadcrumbEvents() {
    if (!this.breadcrumbEl) {
      return;
    }
    $(this.breadcrumbEl.nativeElement).find('*').on('mouseover', this.handleOnChildBreadcrumbOver);
  }
  
  handleOnChildBreadcrumbOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.breadcrumbOver) {
      return;
    }

    this.breadcrumbOver = true;
    this.detectChanges();
  }

  handleOnBreadcrumbOver = (event: any) => {
    this.breadcrumbOver = true;
    this.detectChanges();
  }

  handleOnBreadcrumbOut = (event: any): boolean => {
    var e = event.toElement || event.relatedTarget;
    //check for all children levels (checking from bottom up)
    while(e && e.parentNode && e.parentNode != window) {
        if (e.parentNode == this.breadcrumbEl.nativeElement ||  e == this.breadcrumbEl.nativeElement) {
            if(e.preventDefault) e.preventDefault();
            return false;
        }
        e = e.parentNode;
    }
    this.breadcrumbOver = false;
    this.detectChanges();
    return true;
  }

  handleOnCompClick(event: any, item: any) {
    const comp: DomComponent = item.model;
    GLOBAL.editor.select(comp);
  }
}
