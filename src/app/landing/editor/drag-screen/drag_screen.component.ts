import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../components/detection.component';
import * as $ from 'jquery';

@Component({
  selector: 'mo-wb-landing-editor-drag_screen',
  templateUrl: './drag_screen.component.html',
  styleUrls: ['./drag_screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorDragScreenComponent extends MoWbDetectionComponent {
  isDragging: boolean = false;
  startMovePos: any = {};
  frameDoc: any; 
  
  @Input() classInclude: string = '';
  @Input() direction: 'left' | 'right' = 'left';
  @Input() editor: any;
  @Input() left: number = 0;

  @Output() onDragMoving = new EventEmitter<number>();
  @Output() onDragStarted = new EventEmitter<any>();
  @Output() onDragEnd = new EventEmitter<any>();

  @ViewChild('dragEl') dragRef : ElementRef;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.initEvents();
    }, 0);
  }

  override ngOnDestroy() { 

  }

  initEvents() {
    $(this.dragRef.nativeElement).on('mousedown', (e) => {
      this.isDragging = false;
      this.frameDoc = this.editor.Canvas.getDocument();

      $(document).off('mousemove', this.handleOnMousemove);
      $(document).on('mousemove', this.handleOnMousemove);
      $(document).off('mouseup', this.handleOnMouseup);
      $(document).on('mouseup', this.handleOnMouseup);

      $(this.frameDoc).off('mouseup', this.handleOnMouseup);
      $(this.frameDoc).on('mouseup', this.handleOnMouseup);
      $(this.frameDoc).off('mousemove', this.handleOnFrameMousemove);
      $(this.frameDoc).on('mousemove', this.handleOnFrameMousemove);

      this.onDragStarted.emit();
    });

    $(this.dragRef.nativeElement).on('click', this.handleOnMouseup);
  }

  handleOnFrameMousemove = (e: any) => {
    const frameRect = this.editor.Canvas.getFrameEl().getBoundingClientRect();
    const event: any = {};
    event.clientX = frameRect.left + e.clientX;
    // console.log('handleOnFrameMousemove clientX=', event.clientX, ' left=', frameRect.left);
    this.handleOnMousemove(event);
  }

  /**
   * handle on mousemove
   * @param e 
   */
  handleOnMousemove = (e: any) => {
    // console.log('on mouse move clientX=', e.clientX);
    if (!this.isDragging) {
      const rect = this.dragRef.nativeElement.getBoundingClientRect();
      this.startMovePos = {
        clientX: e.clientX,
        startX: rect.left
      }
      $(document).find('body').addClass('mo-drag-resize-hor');

      this.editor.Canvas.handleResizeStarted();
    } 
    this.isDragging = true;
    const offsetX = e.clientX - this.startMovePos.clientX;
    let left = this.startMovePos.startX + offsetX;
    left = Math.max(30, left);
    // console.log('left = ', left, this.startMovePos);
    this.onDragMoving.emit(offsetX);
    // $(this.dragRef.nativeElement).css({'left': left +'px'});
  }

  /**
   * handle in mouseup
   * @param e 
   */
  handleOnMouseup = (e: any) => {
    console.log('handleOnMouseup');
    this.isDragging = false;
    $(document).find('body').removeClass('mo-drag-resize-hor');
    $(document).off('mousemove', this.handleOnMousemove);
    $(document).off('mouseup', this.handleOnMouseup);

    $(this.frameDoc).off('mouseup', this.handleOnMouseup);
    $(this.frameDoc).off('mousemove', this.handleOnFrameMousemove);

    setTimeout(() => {
      this.editor.Canvas.handleResizeEnded();
      this.onDragEnd.emit();
    }, 250);
  }
}
