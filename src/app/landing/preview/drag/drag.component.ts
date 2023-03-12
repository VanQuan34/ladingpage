import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter,
  ViewChild, ElementRef
} from '@angular/core';
import { MoWbBaseComponent } from '../../../components/base.component';

@Component({
  selector: 'mo-wb-landing-preview-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingPreviewDragComponent extends MoWbBaseComponent {
  isDragging: boolean = false;
  posType: 'left' | 'right' = 'left';
  startMovePos: {
    clientX: number,
    startX: number,
    startWidth: number
  }
  @Input() selectedPageId: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 50;

  @Output() onBack = new EventEmitter<any>();
  @Output() onWidthValueChanged = new EventEmitter<number>();

  @ViewChild('contentEl') contentRef: ElementRef;

  override onInit() {
  }

  override async onAfterInit() {
    this.detectChanges();
  }

  override onDestroy() {
  } 

  initEvent() {
    this.isDragging = false;

    $(document).off('mousemove', this.handleOnMousemove);
    $(document).on('mousemove', this.handleOnMousemove);
    $(document).off('mouseup', this.handleOnMouseup);
    $(document).on('mouseup', this.handleOnMouseup);
  }

  handleOnMousedown(event: MouseEvent, posType: 'left' | 'right') {
    this.posType = posType;
    this.initEvent();
  }

  /**
   * handle on mousemove
   * @param e 
   */
  handleOnMousemove = (e: any) => {
    // console.log('on mouse move clientX=', e.clientX);
    if (!this.isDragging) {
      const rect = this.contentRef.nativeElement.getBoundingClientRect();
      this.startMovePos = {
        clientX: e.clientX,
        startX: rect.left,
        startWidth: rect.width
      }
      $(document).find('body').addClass('mo-drag-resize-hor');
    } 
    this.isDragging = true;
    const offsetX = e.clientX - this.startMovePos.clientX;
    let width = this.startMovePos.startWidth - 2*offsetX;
    width = Math.max(320 + 72, width);
    width = Math.min(10000, width);

    this.onWidthValueChanged.emit(width);   
  }

  /**
   * handle in mouseup
   * @param e 
   */
  handleOnMouseup = (e: any) => {
    this.isDragging = false;
    $(document).find('body').removeClass('mo-drag-resize-hor');
    $(document).off('mousemove', this.handleOnMousemove);
    $(document).off('mouseup', this.handleOnMouseup);
  }


}
