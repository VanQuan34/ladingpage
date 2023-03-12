import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsContainerComponent extends MoLandingEditorInspectorBaseComponent {
  
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
