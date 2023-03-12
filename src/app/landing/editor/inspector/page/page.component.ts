import {
  Component,  Input, ChangeDetectionStrategy, 
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../components/detection.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorPageComponent extends MoWbDetectionComponent {
  
  @Input() classInclude: string = 'mo-wb-mt-20px';
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    setTimeout(() => {
    }, 0);
  }

  override ngOnDestroy() { 

  }

  
}
