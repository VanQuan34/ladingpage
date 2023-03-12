import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../components/detection.component';
import { GLOBAL } from '../../editor-wrapper';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignComponent extends MoWbDetectionComponent {
  
  moType: string;

  @Input() classInclude: string = '';

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    GLOBAL.editor.getEditor().on('component:toggled', this.handleOnCompToggled);
    this.setValue();
  }

  override ngOnDestroy() { 
    GLOBAL.editor.getEditor().off('component:toggled', this.handleOnCompToggled);
  }

  setValue() {
    const selectedModel = GLOBAL.editor.getSelected();
    if (!selectedModel) {
      return;
    }
    const attrs = selectedModel.getAttributes();
    this.moType = attrs['mo-type'];

    console.log('setValue motype=', this.moType);
    this.detectChanges();
  }

  handleOnCompToggled = (comp: any) => {
    if (!comp) {
      return;
    }
    this.setValue();
  }
  
}
