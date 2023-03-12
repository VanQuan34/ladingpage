import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';


@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-form-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsFormInputComponent extends MoLandingEditorInspectorBaseComponent {
  stateInput: 'NORMAL' | 'HOVER' | 'FOCUS' | 'ERROR' = 'NORMAL';
  dataPreviewList: any[] = [
    {
      id: 'NORMAL',
      name: 'Bình thường',
    },
    {
      id: 'HOVER',
      name: 'Di chuột',
    },
    {
      id: 'FOCUS',
      name: 'Tiêu điểm',
    },
    {
      id: 'ERROR',
      name: 'Lỗi',
    }
  ];

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

  handlerSelectedItem(event: any){
    this.stateInput = event.id;
    this.detectChanges();
  }


}