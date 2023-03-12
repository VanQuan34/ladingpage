
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
// import { MoWbPopupWapperComponent } from 'src/app/components/popup/popup_wapper.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from '../base-link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-jump-top-bot',
  templateUrl: './jump-top-bot.component.html',
  styleUrls: ['./jump-top-bot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLinkJumpTopBotComponent extends MoLandingEditorCompBaseLinkComponent {
  
  // selectedComp: DomComponent;
  // moType: string;

  linkType: string = 'BACK_TO_TOP';

  
  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  onLinkJumpTopBot(selector: string){
    const comps = GLOBAL.editor.getSelected().find(`${selector}`);
    const comp = comps.length && comps[0];
    const attrs = comp&& comp.getAttributes();
    attrs['data-anchor']= this.getDataAnchor();

    comp.setAttributes(attrs, {});
  }

  getDataAnchor(){
    if(!this.linkType){
      return '';
    }
    return this.linkType;
  }

  handlerButtonClick(e: any, option: 'BACK_TO_TOP' | 'BACK_TO_BOTTOM'){
    this.linkType = option;
    this.detectChanges();
  }

  override agree(): void {
    this.onLinkJumpTopBot('.mo-content-inner');
  }
  

}
