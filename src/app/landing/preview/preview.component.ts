import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild
} from '@angular/core';
import { MoWbBaseComponent } from '../../components/base.component';
import { ILandingPage, IPage } from '../editor/root.service';
import { IPreviewDevice } from './toolbar/devices/devices.component';
import { MoLandingPreviewToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'mo-wb-landing-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingPreviewComponent extends MoWbBaseComponent {
  
  selectedPageId: string = '';
  canvasWidth: number = 900;
  selectedPage: IPage;
  selectedDevice: IPreviewDevice;
  
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 5000;
  @Input() landingPage: ILandingPage;

  @Output() onClose = new EventEmitter<any>();

  @ViewChild('toolbarRef') toolbar: MoLandingPreviewToolbarComponent;
  
  override onInit() {
  }

  override async onAfterInit() {
    const selectedPage = this.landingPage.pages.find(page => {
      return page.isHome ? true : false;
    });
    this.selectedPageId = selectedPage.id;
    this.selectedPage = selectedPage;
    this.isOpen = true;
    this.detectChanges();
  }

  override onDestroy() { 
  } 

  /**
   * close preview
   */
  close() {
    this.isOpen = false;
    this.detectChanges();
    setTimeout(() => {
      this.onClose.emit({}); 
    }, 500);
  }

  /**
   * get canvas width device
   * @param device 
   */
  getCanvasWidth(device: IPreviewDevice) {
    if (device.id === 'all') {
      return Math.max(device.width + 72, 1272);
    }
    return device.width + 72;
  }

  /**
   * handle on selected device changed
   * @param device 
   */
  handleOnSelectedDeviceChanged(device: any) {
    // console.log('handleOnSelectedDeviceChanged=', device);
    this.selectedDevice = device.device;
    if (device.isChangeWidth) {
      this.canvasWidth = this.getCanvasWidth(this.selectedDevice);
    }
    if (device.fixWidth) {
      this.canvasWidth = device.fixWidth + 72;
    }
    this.detectChanges();
  }

  /**
   * handle on back
   * @param event 
   */
  handleOnBack() {
    this.close();
  }

  /**
   * handle on drag width changed
   * @param widthValue 
   */
  handleOnDragWidthChanged(widthValue: number) {
    // console.log('handleOnDragWidthChanged widthValue=', widthValue);
    this.canvasWidth = widthValue;
    this.detectChanges();
    this.toolbar.setCanvasWidth(this.canvasWidth);
  }

  /**
   * handle on selected page changed
   * @param page 
   */
  handleOnSelectedPageChanged(page: IPage) {
    this.selectedPageId = page.id;
    this.selectedPage = page;
    this.detectChanges();
  }
}
