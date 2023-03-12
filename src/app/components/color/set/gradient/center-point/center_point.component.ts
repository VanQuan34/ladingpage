import {
  Component, EventEmitter, Input,
  ChangeDetectionStrategy,
  Output
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../base.component';

@Component({
  selector: 'mo-wb-components-color-set-gradient-center_point',
  templateUrl: './center_point.component.html',
  styleUrls: ['./center_point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorSetGradientCenterPointComponent extends MoWbBaseComponent {

  isShowCenter: boolean
  top: number;
  left: number;

  startMove: {
    top: number,
    left: number,
    clientX: number,
    clientY: number,
    rect: DOMRect
  }
  
  @Input() parentEl: HTMLElement;
  @Input() centerLeft: number;
  @Input() centerTop: number;
  @Input() zIndex: number = 3500;
  @Input() classInclude: string;

  @Output() onCenterPointChanged = new EventEmitter<any>();

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.parentEl.addEventListener('mouseover', this.handleOnBackgroundMouseover);
    this.parentEl.addEventListener('mouseout', this.handleOnBackgroundMouseout);
    this.detectChanges();
  }

  override ngOnDestroy() {
    this.parentEl.removeEventListener('mouseover', this.handleOnBackgroundMouseover);
    this.parentEl.removeEventListener('mouseout', this.handleOnBackgroundMouseout);
  }

  /**
   * handle on background mouseover
   * @param event
   */
  handleOnBackgroundMouseover = (event: any) => {
    this.isShowCenter = true;
    const rect = this.parentEl.getBoundingClientRect();
    this.left = rect.left + this.centerLeft * rect.width / 100 - 10;
    this.top = rect.top + this.centerTop * rect.height / 100 - 10;
    this.detectChanges();
  }

  /**
   * handle on background mouseout
   * @param event 
   * @returns 
   */
  handleOnBackgroundMouseout = (event: any) => {
    let e = event.toElement || event.relatedTarget;
    //check for all children levels (checking from bottom up)
    while (e && e.parentNode && e.parentNode != window) {
      if (e.parentNode == this.parentEl || e == this.parentEl) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      e = e.parentNode;
    }

    this.isShowCenter = false;
    this.detectChanges();
    return true;
  }

  /**
   * handle on center point mousedown
   * @param event 
   */
  handleOnCenterPointMousedown(event: any) {
    this.startMove = {
      top: this.top,
      left: this.left,
      clientX: event.clientX,
      clientY: event.clientY,
      rect: this.parentEl.getBoundingClientRect()
    };

    window.addEventListener('mousemove', this.handleOnMousemove);
    window.addEventListener('mouseup', this.handleOnMouseup);
  }

  /**
   * handle on mousemove
   * @param event 
   */
  handleOnMousemove = (event: any) => {
    const left = event.clientX - this.startMove.clientX + this.startMove.left;
    const top = event.clientY - this.startMove.clientY + this.startMove.top;

    this.top = Math.min(top, this.startMove.rect.top + this.startMove.rect.height - 10);
    this.top = Math.max(this.top , this.startMove.rect.top - 10);

    this.left = Math.min(left, this.startMove.rect.left + this.startMove.rect.width - 10);
    this.left = Math.max(this.left , this.startMove.rect.left - 10);
 
    this.centerTop = 100 * (this.top - this.startMove.rect.top + 10) / this.startMove.rect.height;
    this.centerLeft = 100 * (this.left - this.startMove.rect.left + 10) / this.startMove.rect.width;

    this.onCenterPointChanged.emit({
      top: parseInt(`${this.centerTop}`),
      left: parseInt(`${this.centerLeft}`),
    })

    this.detectChanges();
  }

  /**
   * handle on mouseup
   * @param event 
   */
  handleOnMouseup = (event: any) => {
    window.removeEventListener('mousemove', this.handleOnMousemove);
    
    this.startMove = null;
  }
  
}


