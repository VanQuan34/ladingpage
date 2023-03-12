import {
  Component, EventEmitter, Input,
  ChangeDetectionStrategy, Output, ElementRef
} from '@angular/core';
import { GLOBAL } from '../../../../editor-wrapper';
import { uid } from 'uid';
import { IMediaBreakPoint } from 'src/app/landing/editor/root.service';
import { BreakPointUtils } from 'src/app/utils/breakPointUtils';
import { MoWbBaseComponent } from 'src/app/components/base.component';
import { EditorConstants } from 'src/app/landing/editor/constants';

declare var require: any
var clone = require('clone');

@Component({
  selector: 'mo-wb-landing-editor-toolbar-device-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorToolbarDeviceMenuComponent extends MoWbBaseComponent  {

  top: number = 0;
  left: number = 0;
  hoverItem: IMediaBreakPoint;      
  selectedItem: IMediaBreakPoint;
  actionIconOn: boolean;
  itemOn: boolean;
  editError: boolean;
  addError: boolean;
  addEnable: boolean;
  selectedItemMediaWidth: number;
  addValue: number;
  breakPoints: any[] = [];

  @Input() width: number = 300;
  @Input() minHeight: number = 239;
  @Input() height: number = 300;
  @Input() zIndex: number = 2500;
  @Input() classInclude: string;
  @Input() isShow: boolean = false;
  @Input() selectedKey: string = '';


  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectItem = new EventEmitter<any>();
  @Output() onRemoveItem = new EventEmitter<IMediaBreakPoint>();

  override onInit(): void {
    this.breakPoints = BreakPointUtils.getBreakPoints();
    this.detectChanges();
  }

  show(target: ElementRef) {
    const targetRect = target.nativeElement.getBoundingClientRect();
    this.top = targetRect.top + 35;
    this.height = 45 * this.breakPoints.length + 52 * 2;
    this.left = targetRect.left + targetRect.width - this.width;
    this.isShow = true;
    this._changeDetection.detectChanges();
  }

  close() {
    this.isShow = false;
    //this.detectChanges();
    setTimeout(() => {
      this.onClose.emit();
    }, 50);
  }

  getIgnoreMediaWidth() {
    const breakPoints = this.breakPoints;
    const ignores: number[]= [];
    for (let i=0; i < breakPoints.length; i++) {
      const max = breakPoints[i].max;
      if (max) {
        ignores.push(max);
      }
    }
    return ignores;
  }

  /**
   * update popup height
   */
  updatePopupHeight() {
    this.height = 45 * this.breakPoints.length + 52 * 2;
  }

  /**
   * update break point list
   * @param breakPoints 
   */
  updateBreakPoints(breakPoints: IMediaBreakPoint[]) {
    for (let i=0; i < breakPoints.length; i++) {
      const breakPoint = breakPoints[i];
      const deviceInfo = BreakPointUtils.getDeviceInfo(breakPoint.max);
      breakPoint.device = deviceInfo.label;
      breakPoint.deviceIcon = deviceInfo.icon;
      breakPoint.name = deviceInfo.name;

      const next = breakPoints.length > i + 1 ? breakPoints[i + 1] : null;
      const prev = i - 1 >= 0 ? breakPoints[i - 1] : null;

      if (prev) {
        breakPoint.next = i === 1 ? 0 : prev.max;
      }

      breakPoint.min = next ? next.max + 1 : 320;
    }

    this.breakPoints = breakPoints;
    this._changeDetection.detectChanges();
  }

  /**
   * add new break point
   */
  addNewBreakPoint() {
    let breakPoints: IMediaBreakPoint[] = this.breakPoints;
    const deviceInfo = BreakPointUtils.getDeviceInfo(this.addValue);
    const newBreakPoint: IMediaBreakPoint = {
      id: uid(),
      min: 0,
      max: this.addValue,
      device: deviceInfo.label,
      deviceIcon: deviceInfo.icon,
      name: deviceInfo.name,
      isSelected: false
    };
    let insertIndex = -1;
    for (let i=0; i < breakPoints.length; i++) {
      const breakPoint = breakPoints[i];
      if (breakPoint.max && breakPoint.max < newBreakPoint.max) {
        insertIndex = i;
        break;
      }
    }
    if (insertIndex < 0) {
      breakPoints.push(newBreakPoint);
    } else {
      breakPoints.splice(insertIndex, 0, newBreakPoint);
    }
    // update breakpoints
    this.updateBreakPoints(breakPoints);
    // update popup height
    this.updatePopupHeight();

    BreakPointUtils.setBreakPoints(breakPoints);
    $(GLOBAL.canvasEl).trigger(EditorConstants.BREAK_POINTS_CHANGED_EVENT, [breakPoints]);
  }

  /**
   * remove breakpoint
   */
  removeBreakpoint() {
    let breakPoints: IMediaBreakPoint[] = this.breakPoints;
    breakPoints = breakPoints.filter((item: any) => {
      return item.id !== this.hoverItem.id ? true : false;
    });

    // remove rule media
    const media = BreakPointUtils.getMediaText(this.hoverItem);
    GLOBAL.editor.removeMedia(media);
    // update breakpoints
    this.updateBreakPoints(breakPoints);
    // update popup height
    this.updatePopupHeight();

    if (this.hoverItem.isSelected) {
      breakPoints[0].isSelected = true;
    }
    // reset hover item
    this.hoverItem = null;
    
    BreakPointUtils.setBreakPoints(breakPoints);
    $(GLOBAL.canvasEl).trigger(EditorConstants.BREAK_POINTS_CHANGED_EVENT, [breakPoints]);
    this._changeDetection.detectChanges();
  }

  /**
   * edit breakpoint
   */
  editBreakPoint() {
    let breakPoints: IMediaBreakPoint[] = this.breakPoints;
    const mainPoint: IMediaBreakPoint = breakPoints.find((item: any) => {
      if (item.id === 'all') {
        return true;
      }
      return false;
    });

    breakPoints = breakPoints.filter((item: any) => {
      if (item.id !== 'all') {
        return true;
      }
      return false;
    });

    breakPoints = breakPoints.sort((a: any, b: any) => {
      return (a.max - b.max);
    });
    const ollItem: IMediaBreakPoint = clone(this.selectedItem);
    for (let i= 0; i < breakPoints.length; i++) {
      const breakPoint = breakPoints[i];
      if (breakPoint.id === this.selectedItem.id) {
        this.selectedItem.max = this.selectedItemMediaWidth;
        if (i - 1 >= 0) {
          const prev = breakPoints[i - 1];
          prev.next = this.selectedItemMediaWidth;
        }
        if (i + 1 < breakPoints.length) {
          const next = breakPoints[i + 1];
          next.min = this.selectedItem.max + 1;
        }
        break;
      }
    }

    breakPoints = breakPoints.sort((a: any, b: any) => {
      return (b.max - a.max);
    });

    mainPoint.min = breakPoints[0].max + 1;
    breakPoints.splice(0, 0, mainPoint);

    // update media css
    const oldMedia = BreakPointUtils.getMediaText(ollItem);
    const newMedia = BreakPointUtils.getMediaText(this.selectedItem);
    GLOBAL.editor.updateMedia(oldMedia, newMedia);

    this.updateBreakPoints(breakPoints);
    this.selectedItem = null;
    
    BreakPointUtils.setBreakPoints(breakPoints);
    $(GLOBAL.canvasEl).trigger(EditorConstants.BREAK_POINTS_CHANGED_EVENT, [breakPoints]);
    this._changeDetection.detectChanges();
  }

  /**
   * handle overlay click
   * @param event 
   */
  handleOnOverlayClick(event: any) {
    this.close();
  }

  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }
  
  /**
   * handle on close button click
   * @param event 
   */
  handleOnCloseClick(event: any) {
    event.stopPropagation();
    this.close();
  }

  /**
   * handle on break point item mouseover
   * 
   * @param item 
   */
  handleOnBreakItemMouseover(item: IMediaBreakPoint) {
    this.hoverItem = item;
    this.itemOn = true;
    this._changeDetection.detectChanges();
  }

  /**
   * handle on break item mouseout
   * @param event 
   */
  handleOnBreakItemMouseout(event: any) {
    event.stopPropagation();
    this.itemOn = false;
    setTimeout(() => {
      //console.log('handleOnBreakItemMouseout actionIconOn=', this.actionIconOn);
      if (!this.actionIconOn && !this.itemOn) {
        this.hoverItem = null;
        this._changeDetection.detectChanges();
      }
    }, 150);
  }

  /**
   * handle on Icon action mouseover
   * @param event 
   */
  handleOnIconActionMouseover(event: any) {
    event.stopPropagation();
    this.actionIconOn = true;
  }

  /**
   * handle on icon action mouseout
   * @param event 
   */
  handleOnIconActionMouseout(event: any) {
    event.stopPropagation();
    this.actionIconOn = false;
  }

  /**
   * handle on edit icon click
   * @param item 
   */
  handleOnEditIconClick(item: IMediaBreakPoint) {
    this.selectedItem = item;
    this._changeDetection.detectChanges();
  }

  handleOnCancelEditClick(event: any) {
    this.selectedItem = null;
    this._changeDetection.detectChanges();
  }

  handleOnValueError() {
    this.editError = true;
  }

  handleOnValueChanged(val: number) {
    this.editError = false;
    this.selectedItemMediaWidth = val;
  }

  handleOnEditButtonClick(e: any) {
    this.editBreakPoint();
  }

  handleOnRemoveIconClick(breakpoint: IMediaBreakPoint) {
    this.removeBreakpoint();
  }

  handleOnAddValueError(event: any) {
    this.addError = true;
  }
  /**
   * handle input add breakpoint value change
   * @param val 
   */
  handleOnAddValueChanged(val: number) {
    this.addError = false;
    this.addEnable = true;
    this.addValue = val;
  }

  /**
   * handle on add breakpoint click
   * @param event 
   * @returns 
   */
  handleOnAddBreakPointClick(event: any) {
    if (this.addError || !this.addEnable) {
      return;
    }
    this.addEnable = false;
    this.addNewBreakPoint();
  }

}
