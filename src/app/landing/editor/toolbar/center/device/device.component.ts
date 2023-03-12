import {
  Component, EventEmitter, ViewChild, 
  Output, Input, ElementRef, ChangeDetectionStrategy
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../components/base.component';
import { MoLandingEditorToolbarDeviceMenuComponent } from './menu/menu.component';
import { GLOBAL } from '../../../editor-wrapper';
import { IMediaBreakPoint, IPage } from '../../../root.service';
import { BreakPointUtils } from 'src/app/utils/breakPointUtils';
import { EditorConstants } from '../../../constants';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorToolbarDeviceComponent extends MoWbBaseComponent {
  
  selectedId: string = 'all';
  selectedItem: IMediaBreakPoint
  iframeWidth: number = 0;

  mediaBreakPoints: IMediaBreakPoint[];

  @Output() onBreakPointChanged = new EventEmitter<IMediaBreakPoint>();
  @Output() onDeviceWidthChanged = new EventEmitter<number>();

  @ViewChild('menuIcon') menuIconRef: ElementRef;

  override ngOnInit() {
    $(GLOBAL.canvasEl).on(EditorConstants.IFRAME_WIDTH_CHANGED_EVENT, this.handleOnFrameWidthChanged);
    $(GLOBAL.canvasEl).on(EditorConstants.BREAK_POINTS_CHANGED_EVENT, this.handleOnBreakPointsChanged);
    $(GLOBAL.canvasEl).on(EditorConstants.BREAK_POINTS_PAGE_CHANGED_EVENT, this.handleOnPageChanged);
    
  }

  override ngAfterViewInit() {
    setTimeout(() => {
     this.setBreakPoint();
     
    }, 0);
    
  }

  override ngOnDestroy() { 
    $(GLOBAL.canvasEl).off(EditorConstants.IFRAME_WIDTH_CHANGED_EVENT, this.handleOnFrameWidthChanged);
    $(GLOBAL.canvasEl).off(EditorConstants.BREAK_POINTS_CHANGED_EVENT, this.handleOnBreakPointsChanged);
    $(GLOBAL.canvasEl).off(EditorConstants.BREAK_POINTS_PAGE_CHANGED_EVENT, this.handleOnPageChanged);
  }
  /**
   * init media breakpoint
   */
  setBreakPoint() {
    this.mediaBreakPoints = BreakPointUtils.getBreakPoints();
    this.selectedItem = BreakPointUtils.getSelectedBreakPoint();
    this.selectedId = this.selectedItem.id;
    this.iframeWidth =  BreakPointUtils.getIframeWidth(this.selectedItem);
    this.detectChanges();
  }
  /**
   * get tooltip breakpoint
   * @param breakPoint 
   * @returns 
   */
  getTooltip(breakPoint: IMediaBreakPoint) {
    if (breakPoint.id === 'all') {
      return `<div>
        <strong class="mo-wb-font-head-4s">${breakPoint.name}</strong> 
        <span class='mo-wb-ml-2px mo-wb-font-head-5'>(Chính)</span> </div>
          <div class='mo-wb-mt-4px mo-wb-font-head-5'>
        Thay đổi ở tất cả các kích thước màn hình, trừ khi bạn tuỳ chỉnh ở các điểm ngắt thấp hơn.

      </div>`;
    }

    return `<div>
      <strong class="mo-wb-font-head-4s">${breakPoint.name}</strong> 
      <span class='mo-wb-ml-2px mo-wb-font-head-5'>(${breakPoint.max}px trở xuống)</span> </div>
        <div class='mo-wb-mt-4px mo-wb-font-head-5'>
      Thay đổi ở các màn hình có kích thước màn hình ${breakPoint.max}px trở xuống, trừ khi bạn tuỳ chỉnh ở các điểm ngắt thấp hơn.

    </div>`;
  }

  /**
   * show menu
   */
  showMenu() {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorToolbarDeviceMenuComponent).create(this._injector);
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(this.menuIconRef);
  }

  /**
   * change selected breakpoint
   * @param breakPoint 
   */
  changeSelectedBreakpoint(breakPoint: IMediaBreakPoint) {
    this.selectedId = breakPoint.id;
    this.selectedItem = breakPoint;

    this.mediaBreakPoints.forEach(item => {
      if (item.id === breakPoint.id) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    this.iframeWidth = this.selectedItem.min + 40;
    this.detectChanges();
  }
  
  /**
   * handle on click device button click
   * @param breakPoint 
   * @returns 
   */
  handleOnDeviceButtonClick = (breakPoint: IMediaBreakPoint) => {
    if (this.selectedId === breakPoint.id) {
      return;
    }
    this.changeSelectedBreakpoint(breakPoint);
    $(GLOBAL.canvasEl).trigger(EditorConstants.BREAK_POINT_SELECTED_CHANGED_EVENT, [breakPoint]);
  }

  handleInputDeviceWidthChanged = (val: number) => {
    GLOBAL.editor.getModel().trigger('deviceWidth-changed', val);
  }

  /**
   * handle on menu click
   * @param e 
   */
  handleOnMenuIconClick = (e: any) => {
    e.stopPropagation();
    this.showMenu();
  }

  /**
   * handle on iframe width changed
   * @param breakPoint 
   * @param iframeWidth 
   */
  handleOnFrameWidthChanged = (event: any, breakPoint: IMediaBreakPoint, iframeWidth: number) => {
    this.selectedId = breakPoint.id;
    this.selectedItem = breakPoint;
    this.iframeWidth = iframeWidth;
    this.detectChanges();
  }

  /**
   * handle on breakpoints changed
   * @param breakPoints 
   */
  handleOnBreakPointsChanged = (event: any, breakPoints: IMediaBreakPoint[]) => {
    this.setBreakPoint();
  }

  /**
   * handle on page changed
   */
  handleOnPageChanged = () => {
    console.log('handleOnPageChanged');
    this.setBreakPoint();
  }
  
}
