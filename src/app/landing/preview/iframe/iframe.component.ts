import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter,
  ViewChild, ElementRef, SimpleChanges
} from '@angular/core';
import { BuilderContentPreview } from 'src/app/utils/builder/previewBuilder';
import { MoWbBaseComponent } from '../../../components/base.component';
import { ILandingPage, IPage, ITheme } from '../../editor/root.service';

@Component({
  selector: 'mo-wb-landing-preview-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingPreviewIframeComponent extends MoWbBaseComponent {
  
  @Input() selectedPageId: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 5000;
  @Input() page: IPage;
  @Input() landingPage: ILandingPage;

  @ViewChild('iframe') iframeRef: ElementRef;

  @Output() onBack = new EventEmitter<any>();
  
  override onInit() {
  }

  override async onAfterInit() {
    this.initIframeSrc();
    this.detectChanges();
  }

  ngOnChanges(change: SimpleChanges) {
    if (change && change['page']) {
      this.initIframeSrc();
      this.detectChanges();
    }
  }

  override onDestroy() {
  } 

  /**
   * init iframe
   */
  initIframeSrc() {
    if (!this.page || !this.iframeRef.nativeElement) {
      return;
    }
    const pageHtml = this.buildContent();
    this.iframeRef.nativeElement.setAttribute('srcdoc', `${pageHtml}`);
  }

  /**
   * build content
   */
  buildContent() {
    const builderPreview = new BuilderContentPreview();
    const pageHtml = builderPreview.buildPageContent(this.page, this.landingPage.theme);
    return pageHtml;
  }

  /**
   * handle on iframe load
   * @param event 
   */
  handleOnIframeLoad(event: any) {
    console.log('handleOnIframeLoad');
  }

}
