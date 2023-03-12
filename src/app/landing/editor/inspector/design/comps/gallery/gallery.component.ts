import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

const GAP_GALLERY = '--gap-gallery';
const HEIGHT_THUMB = '--height-thumb';
const HEIGHT_GLR = '--height-gallery';

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-comps-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorLayoutCompsGalleryComponent extends MoLandingEditorInspectorBaseComponent {
  
  override onInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnUpdateHeightGallery);
  }
 
  override onAfterViewInit() {
    setTimeout(() => {
    }, 0);
  }
 
  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnUpdateHeightGallery);
  }
 
  override setValue(): void {
    super.setValue();
  }

  handleOnUpdateHeightGallery = () => {
    const gap = parseInt( this.getStyle()[GAP_GALLERY].replace('px', '') ) || 10;
    const heightThumb = parseInt( this.getStyle()[HEIGHT_THUMB].replace('px', '') ) || 90;
    const heightUpdate = parseInt( this.getStyle()['height'].replace('px', '') ) - gap - heightThumb;
    this.setStyle(`${heightUpdate}px`, HEIGHT_GLR);
    this.detectChanges();
  }
}