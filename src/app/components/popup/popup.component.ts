import {
  Component, OnInit, EventEmitter, ViewChild, 
  Output, Input, ElementRef, ChangeDetectorRef, SimpleChanges, ChangeDetectionStrategy,
} from '@angular/core';
import { MoWbBaseComponent } from '../base.component';
import { IColorVar } from '../../common/common-types';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';


@Component({
  selector: 'mo-wb-components-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbPopupComponent extends MoWbBaseComponent {
  
  
  top: number = 0;
  left: number = 0;

  @Input() width: number = 200;
  @Input() zIndex: number = 2500;
  @Input() title: string;
  @Input() classInclude: string;
  @Input() height: string = '';
  @Input() minHeight: string = '';
  @Input() maxHeight: string = '';
  @Input() targetEl: HTMLElement;
  @Input() selectedEl: HTMLElement;
  @Input() clickOutOverlay: boolean;
  @Input() hasHeader: boolean = true;
  @Input() hasFooter: boolean = true;
  @Input() isShow: boolean = false;
  @Input() padHorClassInclude: string = 'mo-wb-px-20px'; 
  @Input() position: 'center' | 'followSelected' | 'followTarget' = 'center';
  @Input() error: boolean= false;
  @Input() typeFooter: 'BUTTON'| 'ADD-ITEM' = 'BUTTON';
  @Input() labelBtnFooter: string = 'Thêm item'

  @Output() onClose = new EventEmitter<any>();
  @Output() onOk = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<ElementRef>();

  @ViewChild('popup') popupRef: ElementRef;
  @ViewChild('btnAddItem') btnAddRef: ElementRef;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isShow'] && changes['isShow'].currentValue) {
      this.setPosition();
    }
    if (changes['selectedEl'] && changes['selectedEl'].currentValue) {
      this.setPosition();
    }
  }

  setPosition() {
    if (!this.isShow) {
      return;
    }
    switch(this.position) {
      case 'center':
        this.setCenterPosition();
        break;
      case 'followSelected':
        this.setPositionFollowSelected();
        break;
      case 'followTarget':
        this.setPositionFollowTarget();
        break;
      default:
        this.setPositionFollowSelected();
        break;
    }
  }

  /**
   * set center position
   */
  setCenterPosition() {
    const headerHeight = this.hasHeader ? 52 : 0;
    const footerHeight = this.hasFooter ? 52 : 0;
    const rect = this.popupRef && this.popupRef.nativeElement.getBoundingClientRect();
    let height = (rect && rect.height) || ( parseFloat(this.height || this.minHeight || '0') + headerHeight + footerHeight);

    this.top = (window.innerHeight - height)/ 2;
    this.left = (window.innerWidth - this.width) / 2;
    this.detectChanges();
  }

  /**
   * set position follow selected el
   */
  setPositionFollowSelected() {
    if (!this.selectedEl) {
      return;
    }
    const selectedRect =  this.selectedEl.getBoundingClientRect();
    const canvasRect =  GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.popupRef && this.popupRef.nativeElement.getBoundingClientRect();
    const headerHeight = this.hasHeader ? 52 : 0;
    const footerHeight = this.hasFooter ? 52 : 0;
    let height = (rect && rect.height) || ( parseFloat(this.height || this.minHeight || '0') + headerHeight + footerHeight);

    const top = selectedRect.top + canvasRect.top - 100 ;
    this.top = Math.max(top, 100);
    this.top = Math.min(this.top, window.innerHeight - height - 50);
    this.left = canvasRect.left + selectedRect.left + selectedRect.width + 20;
    
    this.detectChanges();
  }

  /**
   * set position follow target
   */
  setPositionFollowTarget() {
    if (!this.targetEl) {
      return;
    }
    const targetRect =  this.targetEl.getBoundingClientRect();
    const rect = this.popupRef && this.popupRef.nativeElement.getBoundingClientRect();
    const headerHeight = this.hasHeader ? 52 : 0;
    const footerHeight = this.hasFooter ? 52 : 0;
    let height = (rect && rect.height) || ( parseFloat(this.height || this.minHeight || '0') + headerHeight + footerHeight);

    const top = targetRect.top + targetRect.height + 10;
    this.top = Math.max(top, 100);
    this.top = Math.min(this.top, window.innerHeight - height - 20);
    this.left = targetRect.left + 10;
    this.left = Math.min(this.left, window.innerWidth - this.width - 50);

    this.detectChanges();
  }

  /**
   * close popup
   */
  close() {
    this.isShow = false;
    this.detectChanges();
    this.onClose.emit({});
  }

  /**
   * click out overlay
   * @param e 
   */
  handleOnOverlayClick(e: any) {
    if (this.clickOutOverlay) {
      this.close();
    }
  }

  handleOnPopupClick(e: any) {
    e.stopPropagation();
  }

  handleOnClosePopupClick(e: any) {
    this.close();
  }
  handleOnAddItemClick(e: any){
    this.onAdd.emit(this.btnAddRef);

  }

  handleOnButtonAgreeClick(e: any) {
    this.onOk.emit({e});
    if(this.error){
      return;
    }
    this.close();
  }

  handleOnCancelButtonClick(e: any) {
    this.close();
  }

}
