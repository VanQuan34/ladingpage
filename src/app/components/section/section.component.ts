import {
    Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
    Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
  } from '@angular/core';
  import { MoWbDetectionComponent } from '../detection.component';
  import * as $ from 'jquery';
  
  @Component({
    selector: 'mo-wb-components-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MoWbSectionComponent extends MoWbDetectionComponent {
    
    @Input() isOpen: boolean = true;
    @Input() classInclude: string = '';
    @Input() title: string = '';
    @Input() hasContentPadding: boolean = true;
  
    override ngOnInit() {
    }
  
    override ngAfterViewInit() {
      setTimeout(() => {
      }, 0);
    }
  
    override ngOnDestroy() { 
  
    }

    handleOnToggleClick(event: any) {
      this.isOpen = !this.isOpen;
    }
  
    
  }
  