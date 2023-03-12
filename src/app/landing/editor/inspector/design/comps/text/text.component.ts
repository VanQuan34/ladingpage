import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../../components/detection.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsTextComponent extends MoWbDetectionComponent {
  
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
