import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsButtonComponent extends MoLandingEditorInspectorBaseComponent {
  // @Input() override selectorAddHover: string = '[data-preview="hover"]';
  @Input() selectorAddTextHover: string = '[data-preview="hover"] .mo-button-text';
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
    this.state = 'REGULAR';
  }

  /**
   * change tab
   * @param state 
   */
  changeTab(state: 'REGULAR' | 'HOVER') {
    this.state = state;

    const attrs = this.selectedComp.getAttributes();
    if (this.state === 'HOVER') {
      attrs['data-preview'] = "hover";
    } else {
      attrs['data-preview'] = "regular";
    }
    this.selectedComp.setAttributes(attrs, {});
    this.detectChanges();
  }

  handleOnTabClick(state: 'REGULAR' | 'HOVER') {
    this.changeTab(state);
  }
}
