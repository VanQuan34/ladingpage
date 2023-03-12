import {
  Component, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsFooterComponent extends MoLandingEditorInspectorBaseComponent {
  
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
