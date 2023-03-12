import { GLOBAL } from "../landing/editor/editor-wrapper";
import { IMediaBreakPoint } from "../landing/editor/root.service";


interface IDeviceInfo {
  name: string;
  icon: string;
  label: 'mobile' | 'desktop' | 'tablet';
}

class BreakPointUtils {

  /**
   * return breakpoint list of selected page
   * @returns 
   */
  static getBreakPoints() {
    const selectedPage = GLOBAL.landingPage.pages.find(page => {
      return page.isSelected ? true : false;
    });

    return selectedPage.breakPoints;
  }

  /**
   * return selected breakpoint
   */
  static getSelectedBreakPoint(): IMediaBreakPoint {
    const selectedBreakPoint = this.getBreakPoints().find(breakPoint => {
      return breakPoint.isSelected ? true : false;
    });

    return selectedBreakPoint;
  }

  /**
   * return media text of breakpoint
   * @param breakPoint 
   * @returns 
   */
  static getMediaText = (breakPoint: IMediaBreakPoint) => {
    // const breakPoint: IMediaBreakPoint = this.editor.breakPoint;
    if (breakPoint.id === 'all') {
      return '';
    }
    return `(min-width: 320px) and (max-width: ${breakPoint.max}px)`;
  }

  /**
   * return the above breakpoints list from selected breakpoint
   * @returns 
   */
  static getAboveBreakPoints = () => {
    const selectedBreakpoint = this.getSelectedBreakPoint();
    const breakPoints = this.getBreakPoints();
    const aboveBreakPoint = [];
    for (let i = 0; i < breakPoints.length; i++) {
      aboveBreakPoint.push(breakPoints[i]);
      if (selectedBreakpoint.id === breakPoints[i].id) {
        break;
      }
    }
    return aboveBreakPoint;
  }

  /**
   * get device info from breakpoint width
   * @param breakpointWidth 
   * @returns 
   */
  static getDeviceInfo = (breakpointWidth: number): IDeviceInfo => {
    if (breakpointWidth > 1000 || !breakpointWidth) {
      return {
        label: 'desktop',
        icon: 'mo-icn-desktop_view',
        name: 'Máy tính để bàn'
      }
    }

    if (breakpointWidth > 768) {
      return {
        label: 'tablet',
        icon: 'mo-icn-tablet_view',
        name: 'Máy tính bảng'
      }
    }

    return {
      label: 'mobile',
      icon: 'mo-icn-phone_view',
      name: 'Điện thoại'
    }
  }

  /**
   * get breakpoint by iframe width
   * @param width 
   * @returns 
   */
  static getBreakPointByIFrameWidth(width: number): IMediaBreakPoint {
    let allBreakPoints = this.getBreakPoints();
    let breakPoints = allBreakPoints.filter((item: IMediaBreakPoint) => {
      return item.id === 'all' ? false : true;
    });
    breakPoints = breakPoints.sort((a: any, b: any) => {
      return a.max - b.max;
    });

    let breakPoint = allBreakPoints.find((item: IMediaBreakPoint) => {
      return item.id === 'all' ? true : false;
    });

    for (let i = 0; i < breakPoints.length; i++) {
      if (width < breakPoints[i].max) {
        breakPoint = breakPoints[i];
        break;
      }
    }
    return breakPoint;
  }

  /**
   * update selected breakpoint
   * @param breakPoint 
   */
  static updateSelectedBreakPoint(breakPoint: IMediaBreakPoint) {
    this.getBreakPoints().forEach(item => {
      item.isSelected =  (item.id === breakPoint.id) ? true : false;
    });
  }

  /**
   * reset selected breakpoint
   * @returns 
   */
  static resetSelectedBreakPoint(): IMediaBreakPoint {
    this.getBreakPoints().forEach(item => {
      item.isSelected =  (item.id === 'all') ? true : false;
    });

    const breakPoint = this.getSelectedBreakPoint();
    return breakPoint;
  }

  /**
   * get iframe width from breakpoint 
   * @param breakPoint 
   * @returns 
   */
  static getIframeWidth(breakPoint: IMediaBreakPoint): number {
    let iframeWidth = breakPoint.min + 40;
    if (breakPoint.id == 'all') {
      iframeWidth = Math.max(1200, iframeWidth);
    }
    return iframeWidth;
  }

  /**
   * get style iframe width
   * @param breakPoint 
   * @param canvasWidth 
   */
  static getIframeStyleWidth(breakPoint: IMediaBreakPoint, canvasWidth: number) {
    const iframeWidth: string = breakPoint.id === 'all' ? '100%' :  `${(canvasWidth - 72)}px`;
    return iframeWidth;
  }

  /**
   * set beak points
   * @param breakPoints 
   */
  static setBreakPoints(breakPoints: IMediaBreakPoint[]) {
    const selectedPage = GLOBAL.landingPage.pages.find(page => {
      return page.isSelected ? true : false;
    });
    selectedPage.breakPoints = breakPoints;
  }

}

export {
  BreakPointUtils,
  IDeviceInfo
}