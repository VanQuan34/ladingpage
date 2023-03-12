import { Subject } from 'rxjs';

import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { MoWbInputComponent } from 'src/app/components';
// import { MoWbPopupWapperComponent } from 'src/app/components/popup/popup_wapper.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from '../base-link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLinkEmailComponent extends MoLandingEditorCompBaseLinkComponent {
  
  // selectedComp: DomComponent;
  // moType: string;
  error: boolean = false;
  content: any = {
    mailto: '',
    subject: ''
  }

  @ViewChild('input') inputRef: MoWbInputComponent;
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    // this.setData()
  }

  override ngOnDestroy() {
  }

  override getData(){
    return {
      href: this.buildAttrHref(),
      target: '_self'
    };
  }

  override setData(){
    
      const comps = GLOBAL.editor.getSelected().find('.mo-content-inner');
      const comp = comps.length && comps[0];

      const attrs = comp.getAttributes();

      this.content.mailto = attrs['href'] && attrs['href'].split('?')[0]?.split(':')[1];
      this.content.subject = attrs['href'] && attrs['href'].split('?')[1]?.split('=')[1];
      this.detectChanges();
    

  }


  handlerChangeMailTo(event: string){
    this.content.mailto = event;
    this.detectChanges();
  }

  handlerChangeSubject(event: any){
    this.content.subject = event;
    this.detectChanges();
  }


  buildAttrHref(){
    if(!this.content.mailto){
      return '';
    }

    if(!this.content.subject){
      return `mailto:${this.content.mailto}`;
    }

    return `mailto:${this.content.mailto}?subject=${this.content.subject}`;
  }

  onLinkEmail(selector: string) {
    if(!this.content.mailto){
      return;
    }
    const comps = GLOBAL.editor.getSelected().find(`${selector}`);
    const comp = comps.length && comps[0];
    const attrs = comp && comp.getAttributes();

    const innerHtml = comp.view.el.innerHTML;
    const html = `<a class="${attrs['class']}" href="${this.buildAttrHref()}" target="_self">${innerHtml}</a>`;
    comp.replaceWith(html);
  }


  handleOnInputError(event: any){
    this.error = event;
    console.log('error:', this.error);
  }

  override agree(): void {
    this.onLinkEmail('.mo-content-inner');
    this.detectChanges();
  }

  override checkError():boolean {
    this.inputRef.validate()
    return this.error;
  }

  



  

}
