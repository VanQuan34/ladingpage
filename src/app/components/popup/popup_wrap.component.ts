
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { MoWbBaseComponent } from '../base.component';
import { MoWbPopupComponent } from './popup.component';
@Component({
  template: "<div></div>",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbPopupWrapperComponent extends MoWbBaseComponent {
  
  @Input() classInclude: string = '';
  @Input() height: string = '350px' ;
  @Input() width: number = 600;
  @Input() isShow: boolean = false;
  @Input() targetEl: HTMLElement;
  @Input() selectedEl: HTMLElement;
  @Input() clickOutOverlay: boolean;
  @Input() hasHeader: boolean = true;
  @Input() hasFooter: boolean = true;
  @Input() padHorClassInclude: string = 'mo-wb-px-20px';
  @Input() position: 'center' | 'followSelected' | 'followTarget' = 'center';

  @Output() onClose = new EventEmitter<any>();

  @ViewChild('popup') popupRef: MoWbPopupComponent;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }
  
  
  show() {
    this.isShow = true;
    this.detectChanges();
  }

  handleOnClosePopup(event: any) {
    this.onClose.emit({});
  }

}
