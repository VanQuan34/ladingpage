import {
  Component, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignCompsMenuComponent extends MoLandingEditorInspectorBaseComponent {
  
  menuTypes: any[] = [];
  menuType: string = 'container';
  override onInit() {
    this.menuTypes = [
      {
        id: 'container',
        name: 'Vùng chứa menu',
        html: `<span>Vùng chứa menu</span>`
      },
      {
        id: 'menuItem',
        name: 'Mục menu',
        html: `<span class="mo-wb-pl-20px">Mục menu</span>`
      },
    ];
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

  handleOnSelectMenuType(menuTypeItem: any) {
    this.menuType = menuTypeItem.id;
    this.detectChanges();
  }
}
