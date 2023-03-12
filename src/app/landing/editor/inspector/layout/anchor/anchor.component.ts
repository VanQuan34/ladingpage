import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../components/detection.component';
import * as $ from 'jquery';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-anchor',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorAnchorComponent extends MoWbDetectionComponent {
  
  @Input() classInclude: string = '';

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    setTimeout(() => {
    }, 0);
  }

  override ngOnDestroy() { 

  }

  
}
