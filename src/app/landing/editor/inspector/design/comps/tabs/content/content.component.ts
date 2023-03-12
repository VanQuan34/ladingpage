import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';
 
@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-tabs-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorLayoutCompsTabsContentComponent extends MoLandingEditorInspectorBaseComponent {
  
  override onInit() {
  }
 
  override onAfterViewInit() {
    setTimeout(() => {
    }, 0);
  }
 
  override onDestroy() { 
  }
 
  override setValue(): void {
    super.setValue();
  }
}