import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { MoLandingEditorInspectorListOfCarouselComponent } from './list/list.component';

@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-comps-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorCarouselComponent extends MoLandingEditorInspectorBaseComponent {
  
  override onInit() {
  }

  override onAfterViewInit() {
    setTimeout(() => {
      this.detectChanges();
    }, 0);
  }

  override onDestroy() { 
  }

  override setValue(): void {
    super.setValue();
      this.detectChanges();
  }

  handleOnClickSettingMedia(e: any){
   this.showSettingsMediaCarousel();
  }
  
  showSettingsMediaCarousel(){
    const popup =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorListOfCarouselComponent).create(this._injector);
    popup.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(popup);
    });
    popup.instance.files.subscribe((value: string) => {
    });
    this._domService.addDomToBody(popup);
    this.detectChanges();
  }

}
