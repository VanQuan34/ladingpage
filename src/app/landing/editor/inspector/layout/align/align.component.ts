import {
    Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
    Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
  } from '@angular/core';
  import { MoWbDetectionComponent } from '../../../../../components/detection.component';
  import * as $ from 'jquery';
  
  @Component({
    selector: 'mo-wb-landing-editor-inspector-layout-align',
    templateUrl: './align.component.html',
    styleUrls: ['./align.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MoLandingEditorInspectorAlignComponent extends MoWbDetectionComponent {
    
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
  