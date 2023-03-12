import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges
} from '@angular/core';
import { ILandingPage } from 'src/app/landing/editor/root.service';
import { MoWbBaseComponent } from '../../../../components/base.component';
// import { GLOBAL } from '../../../editor/editor-wrapper';

interface IPreviewDevice {
  id: string;
  name: string;
  breakPointName?: string;
  type: 'BreakPoint' | 'Device' | 'Title';
  width?: number;
  max?: number;
  min?: number;
  icon?: string;
  device?: 'desktop' | 'tablet' | 'mobile'
}

@Component({
  selector: 'mo-wb-landing-preview-toolbar-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingPreviewDevicesComponent extends MoWbBaseComponent {

  top: number;
  left: number;
  selectedId: string;
  selectedItem: IPreviewDevice;
  width: number = 0;
  height: number = 0;

  @Input() selectedPageId: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 5000;
  @Input() breakPoints: IPreviewDevice[] = [];
  @Input() devices: IPreviewDevice[] = [];
  @Input() canvasEl: HTMLElement;
  @Input() landingPage: ILandingPage

  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectedItemChanged = new EventEmitter<any>();

  override onInit() {
    this.initDevices();
    window.addEventListener('resize', this.handleOnWindowResize);
  }

  override async onAfterInit() {
    setTimeout(() => {
      this.height = this.canvasEl.offsetHeight;
      this.detectChanges();
    }, 150);
   
  }

  override onDestroy() { 
    window.removeEventListener('resize', this.handleOnWindowResize);
  } 

  ngOnChanges(change: SimpleChanges) {
    if (change && change['selectedPageId']) {
      this.initDevices();
      this.detectChanges();
    }
  }

  /**
   * init devices list
   * @returns 
   */
  initDevices() {
    if (!this.selectedPageId) {
      return;
    }
    this.breakPoints = [
      {
        id: 'title',
        name: 'Điểm ngắt trang',
        breakPointName: '',
        type: 'Title'
      }
    ];
    const selectedPage = this.landingPage.pages.find(page => {
      return page.id === this.selectedPageId ? true : false;
    });

    const breakPoints = selectedPage.breakPoints;
    breakPoints.forEach(breakPoint => {
      this.breakPoints.push({
        id: breakPoint.id,
        name: breakPoint.id === 'all'? `Màn hình chính` : breakPoint.name,
        breakPointName: breakPoint.name,
        type: 'BreakPoint',
        device: breakPoint.device,
        width: breakPoint.id === 'all' ? Math.max(breakPoint.min + 40, 1200) : breakPoint.min + 40,
        min: breakPoint.min,
        max: breakPoint.max,
        icon: breakPoint.deviceIcon
      });
    });

    this.devices = [
      {
        id: 'device',
        name: 'Thiết bị phổ biến',
        type: 'Title'
      }, {
        id: 'ipadMini',
        name: 'iPad Mini',
        type: 'Device',
        device: 'tablet',
        width: 768,
        icon: 'mo-icn-tablet_view'
      }, {
        id: 'ipad',
        name: 'iPad 10th gen',
        type: 'Device',
        device: 'tablet',
        width: 820,
        icon: 'mo-icn-tablet_view'
      }, {
        id: 'ipadPro12',
        name: 'iPad Pro (6th gen 12.9")',
        type: 'Device',
        device: 'tablet',
        width: 1024,
        icon: 'mo-icn-tablet_view'
      }, {
        id: 'iphone14',
        name: 'iPhone 14',
        type: 'Device',
        device: 'mobile',
        width: 390,
        icon: 'mo-icn-phone_view'
      }, {
        id: 'iphone14Plus',
        name: 'iPhone 14 Plus',
        type: 'Device',
        device: 'mobile',
        width: 428,
        icon: 'mo-icn-phone_view'
      }, {
        id: 'iphone14ProMax',
        name: 'iPhone 14 Pro Max',
        type: 'Device',
        device: 'mobile',
        width: 430,
        icon: 'mo-icn-phone_view'
      }, {
        id: 'iphone8',
        name: 'iPhone 8',
        type: 'Device',
        device: 'mobile',
        width: 375,
        icon: 'mo-icn-phone_view'
      }, {
        id: 'iphone8Plus',
        name: 'iPhone 8 Plus',
        type: 'Device',
        device: 'mobile',
        width: 414,
        icon: 'mo-icn-phone_view'
      }
    ];
    const sortBreakPoints = this.breakPoints.sort((a: IPreviewDevice, b: IPreviewDevice) => {
      return a.max - b.max ;
    });
    for (let i=0; i < this.devices.length; i++) {
      const device = this.devices[i];
      if (device.type === 'Title') {
        continue;
      }
      this.getBreakPointMax(device, sortBreakPoints);
    }
    this.selectedId = 'all';
    this.selectedItem = this.breakPoints.find(breakPoint => {
      return (breakPoint.id === this.selectedId);
    });
    // sort break points
    this.breakPoints = this.breakPoints.sort((a, b) => {
      return b.min - a.min;
    }); 
    // console.log('breakpoint=', this.breakPoints, sortBreakPoints, ' devices=', this.devices);
    
    this.width = this.selectedItem.width;
    this.onSelectedItemChanged.emit({device: this.selectedItem, isChangeWidth: true});
    this.detectChanges();
  }

  /**
   * get breakpoint max width for device
   * @param device 
   */
  getBreakPointMax(device: IPreviewDevice, sortBreakPoints: IPreviewDevice[]) {
    for (let i=0; i < sortBreakPoints.length; i++) {
      const breakPoint = sortBreakPoints[i];
      // console.log('getBreakPointMax max=', breakPoint.max);
      if (device.width < breakPoint.max) {
        device.max = breakPoint.max;
        device.breakPointName = breakPoint.name;
        break;
      }
    }
  }
  
  /**
   * set canvas width
   * @param canvasWidth 
   */
  setCanvasWidth(canvasWidth: number) {
    this.selectedItem = this.getBreakPointByWidth(canvasWidth - 72);
    this.selectedId = this.selectedItem.id;
    this.width = canvasWidth - 72;
    this.detectChanges();
    this.onSelectedItemChanged.emit({device: this.selectedItem, isChangeWidth: false});
  } 

  /**
   * get breakpoint by width
   * @param width 
   * @returns 
   */
  getBreakPointByWidth(width: number): IPreviewDevice {
    // this.breakPoints = this.breakPoints.sort((a, b) => {
    //   return b.min - a.min;
    // }); 
    let breakPoint = this.breakPoints[0];
    for (let i=0; i < this.breakPoints.length; i++) {
      const _breakPoint = this.breakPoints[i];
      if (width >= _breakPoint.min) {
        breakPoint = _breakPoint;
        break;
      }
    }
    return breakPoint;
  }

  /**
   * close page list
   */
  close() {
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * handle on toggle open page list
   * @param event 
   */
  handleOnToggleOpenDeviceList = (event: MouseEvent, deviceEl: HTMLElement) => {
    this.isOpen = !this.isOpen;
    const rect = deviceEl.getBoundingClientRect();
    this.top = rect.top + rect.height;
    this.left = rect.left;
    this.detectChanges();
  }

  /**
   * handle on device item click
   * @param e 
   * @param device 
   */
  handleOnDeviceItemClick(e: any, device: IPreviewDevice) {
    this.selectedId = device.id;
    this.selectedItem = device;
    this.width = device.width;
    this.onSelectedItemChanged.emit({device: this.selectedItem, isChangeWidth: true});
    this.close();
  }

  /**
   * handle on overlay click
   * @param e 
   */
  handleOnOverlayClick(e: any) {
    this.close();
  }

  /**
   * handle on device list click
   * @param e 
   */
  handleOnDeviceListClick(e: any) {
    e.stopPropagation();
  }

  /**
   * handle on width size changed
   * @param width 
   */
  handleOnWidthChanged(width: number) {
    this.selectedItem = this.getBreakPointByWidth(width);
    this.selectedId = this.selectedItem.id;
    this.width = width;
    this.detectChanges();
    this.onSelectedItemChanged.emit({device: this.selectedItem, isChangeWidth: false, fixWidth: width});
  }

  /**
   * handle on window resize
   */
  handleOnWindowResize = () => {
    this.height = this.canvasEl.offsetHeight;
    this.detectChanges();
  }

}

export {
  IPreviewDevice
}
