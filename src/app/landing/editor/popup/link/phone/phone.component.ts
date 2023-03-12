
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { MoWbInputComponent } from 'src/app/components';
// import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wap.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from '../base-link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLinkPhoneComponent extends MoLandingEditorCompBaseLinkComponent {
  
  // selectedComp: DomComponent;
  // moType: string;
  tel: string = '';
  error: boolean = false;

  @ViewChild('input') inputRef: MoWbInputComponent;
  override ngOnInit() {
  }

  override ngAfterViewInit() {
    // this.setData();
  }

  override ngOnDestroy() {
  }


  handlerChangeInput(event: any){
    this.tel = event;
    this.detectChanges();
  }

  override setData(){
   
    const comps = GLOBAL.editor.getSelected().find('.mo-content-inner');
    const comp = comps.length && comps[0];

    const attrs = comp.getAttributes();
    this.tel = attrs['href'] ? attrs['href'].split(':')[1] : "";
    this.detectChanges();
   

  }

  getTel(){
    return this.tel;
  }

  override getData(){
    return {
      href: `tel:${this.tel}`,
    };
  }

  handleOnInputError(event: any){
    this.error = event;
    this.detectChanges();
  }

  onLinkTel(selector: string) {
    if(!this.tel){
      return;
    }
    const comps = GLOBAL.editor.getSelected().find(`${selector}`);
    const comp = comps.length && comps[0];

    const attrs = comp && comp.getAttributes();
    const innerHtml = comp.view.el.innerHTML;

    const html = `<a class="${attrs['class']}" href="${`tel:${this.tel}`}" target="_self">${innerHtml}</a>`

    comp.replaceWith(html);
  }

  override agree(): void {
    this.onLinkTel('.mo-content-inner');
  }

  override checkError(): boolean {
    this.inputRef.validate()
    return this.error;
  }



  

}
