
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
// import { MoWbPopupWapperComponent } from 'src/app/components/popup/popup_wapper.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from '../base-link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-none',
  templateUrl: './none.component.html',
  styleUrls: ['./none.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLinkCancelLinkComponent extends MoLandingEditorCompBaseLinkComponent {
  

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }



  
  disconnectLink(selector: any){
    const comps = GLOBAL.editor.getSelected().find(`${selector}`);
    const comp = comps.length && comps[0];
    const attrs = comp && comp.getAttributes();

    const innerHtml = comp.view.el.innerHTML;
    const html = `<div class="${attrs['class']}">${innerHtml}</div>`;
    comp.replaceWith(html);
  }


  override agree(): void {
    this.disconnectLink('.mo-content-inner');
    this.detectChanges();
  }






  

}
