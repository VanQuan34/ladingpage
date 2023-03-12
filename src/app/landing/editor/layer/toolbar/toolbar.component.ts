
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../base.component';
import { GLOBAL } from '../../editor-wrapper';

@Component({
  selector: 'mo-wb-landing-editor-layer-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerToolbarComponent extends MoLandingEditorLayerBaseComponent {

  isSection: boolean = false;
  isPosTop: boolean = true;
  isPage: boolean = false;

  @ViewChild('breadcrumbEl') breadcrumbEl: ElementRef;

  override onAfterViewInit() {
  } 

  override onDestroy() {
  }

  /**
   * set value
   * @returns 
   */
  override setValue(): void {
    super.setValue();
    console.log('MOTYPE:', this.moType);
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      return;
    }
    const moType = this.selectedComp.getAttributes()['mo-type'];
    this.isSection = moType === 'section' || moType === 'header' || moType === 'footer' ? true : false;
    this.isPage =  moType === 'page' ? true : false;
    // set position
    this.setPosition();
    this.detectChanges();
  }

  /**
   * set position
   * @returns 
   */
  override setPosition(): void {
    if (!this.isOpen) {
      return;
    }
    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.selectedComp.view.el.getBoundingClientRect();

    // console.log('setPosition rect top=', (rect.top + editorRect.top));
    if (editorRect.top + rect.top < 80 + 70) {
      this.isPosTop = false;
    } else {
      this.isPosTop = true;
    }

    this.top = this.isPosTop ? editorRect.top + rect.top - 25 - 42 : editorRect.top + rect.top + rect.height + 10;
    this.left = this.isSection ? editorRect.left + rect.left + 30 : editorRect.left + rect.left ;
    
    this.detectChanges();
  }
  
}
