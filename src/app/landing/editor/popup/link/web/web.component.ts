
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { MoWbInputComponent } from 'src/app/components';
// import { MoWbPopupWapperComponent } from 'src/app/components/popup/popup_wapper.component';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoLandingEditorCompBaseLinkComponent } from '../../../popup/link/base-link.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-link-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLinkWebComponent extends MoLandingEditorCompBaseLinkComponent {

  // selectedComp: DomComponent;
  // moType: string;
  tagLink: any = {
    href: '',
    target: '_self',
  }
  error: boolean = false;
  @ViewChild('inputUrl') inputRef: MoWbInputComponent;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    // this.setData();
  }

  override ngOnDestroy() {
  }

  override getData() {
    return this.tagLink;
  }

  override setData() {
      const comps = GLOBAL.editor.getSelected().find('.mo-content-inner');
      const comp = comps.length && comps[0];
      
      const attrs = comp.getAttributes();
      this.tagLink.href = attrs['href'];
      this.tagLink.target = attrs['target'];
      this.detectChanges();

  }

  handlerOnChangeInput(event: any) {
    this.tagLink.href = event;
    this.detectChanges();

  }

  handleOnOpenNewTap(event: any) {
    this.tagLink.target = event.checked ? '_blank' : '_self';
    this.detectChanges();
  }


  handleOnInputError(event: any) {
    this.error = event;
    this.detectChanges();
  }


  override agree(): void {
    this.onLinkWebAddress('.mo-content-inner');
    this.detectChanges();
  }


  onLinkWebAddress(selector: string) {
    if (!this.tagLink.href) {
      return;
    }
    const comps = GLOBAL.editor.getSelected().find(`${selector}`);
    const comp = comps.length && comps[0];
    const attrs = comp && comp.getAttributes();

    const innerHtml = comp.view.el.innerHTML;
    const html = `<a class="${attrs['class']}" href="${this.tagLink.href}" target="${this.tagLink.target}">${innerHtml}</a>`;
    comp.replaceWith(html);
  }

  override checkError(): boolean {
    this.inputRef.validate();
    return this.error;
  }

}
