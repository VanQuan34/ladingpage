
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLinkPageComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;

  target:string ='_self';
  pages: any[] = [];
  override ngOnInit() {
    this.pages = GLOBAL.landingPage.pages;
    this.detectChanges();
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  handleOnOpenNewTap(event: any){

  }

}
