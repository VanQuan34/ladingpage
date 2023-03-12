import {
  Component, ChangeDetectionStrategy, Input
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-menu-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsMenuItemComponent extends MoLandingEditorInspectorBaseComponent {
  
  @Input() override selectorAdd: string = ' .menuItem-wrapper > .menuItem';
  @Input() override selectorAddHover: string = '  .menuItem-wrapper[data-preview="hover"] > .menuItem';
  @Input() override selectorAddClicked: string = ' .menuItem-wrapper[data-preview="clicked"] > .menuItem';
  @Input() override selectorAddState: string = ' .menuItem-wrapper';
  @Input() selectorAddText: string = ' .menuItem-label';
  @Input() selectorAddTextHover: string = ' .menuItem-wrapper[data-preview="hover"] .menuItem-label';
  @Input() selectorAddTextClicked: string = ' .menuItem-wrapper[data-preview="clicked"] .menuItem-label';
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
