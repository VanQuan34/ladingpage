import { DomComponent, GLOBAL } from "../landing/editor/editor-wrapper";
import { IGridArea } from "./gridLayoutUtil";


interface IMarginUnit {
  ml: string,
  mr: string,
  mt: string,
  mb: string
}

interface IDockingPos {
  alignSelf: 'start' | 'end' | 'stretch' | 'center',
  justifySelf: 'start' | 'end' | 'stretch' | 'center',
  ml: number,
  mr: number,
  mt: number,  
  mb: number,
  mlpx: number,
  mrpx: number,
  mtpx: number,
  mbpx: number,
  mUnit: IMarginUnit,
  area: IGridArea
}

class DockUtil {
  constructor() {
  }

  /**
   * get fix docking
   * @param container 
   * @param comp 
   */
  getFixDockingPos(comp: DomComponent): IDockingPos {
    const container = GLOBAL.compUtil.getContainer(comp);
    const id = GLOBAL.compUtil.getStyleCompId(comp);
    const styles = GLOBAL.editor.getStyles(id);
    const alignSelf = styles['align-self'];
    const justifySelf = styles['justify-self'];

    return this.getDockingPos(container, comp, alignSelf, justifySelf, true);
  }

  /**
   * get auto docking pos
   * @param comp 
   * @returns DockingPos
   */
  getAutoDockingPos(comp: DomComponent): IDockingPos {
    const container = GLOBAL.compUtil.getContainer(comp);
    return this.getDockingPos(container, comp);
  }
  
  /**
   * get docking position
   * @param container 
   * @param comp 
   * @param fixAlignSelf 
   * @param fixJustifySelf 
   * @param isOriginMarin 
   * @returns 
   */
  getDockingPos(container: DomComponent, comp: DomComponent, fixAlignSelf: any = null, fixJustifySelf: any = null, isOriginMarin: boolean = false): IDockingPos {
    //console.log('getAnchorPosModel container=', container, ' model=', model);
    const compRect = comp.view.el.getBoundingClientRect();
    const gridArea = GLOBAL.grid.getGridArea(compRect, container);
    if (!container || !gridArea) {
      return null;
    }
    const dockingPos = this.calcDockingPosInfo(comp, gridArea, fixAlignSelf, fixJustifySelf, isOriginMarin);
    // console.log('getDockingPos dockingPos=', dockingPos, ' gridArea=', gridArea, ' compRect=', compRect);
    return dockingPos;
  }
  
  /** 
   * calculate the docking position info
   * @param comp 
   * @param gridArea 
   * @param fixAlignSelf 
   * @param fixJustifySelf 
   * @param isOriginMarin 
   * @returns 
   */
  calcDockingPosInfo(comp: DomComponent, gridArea: IGridArea, fixAlignSelf: any = '', fixJustifySelf: any = '', isOriginMarin: boolean = false): IDockingPos {
    if (!gridArea || !gridArea.container) {
      return null;
    }
    
    const modelRect = comp.view.el.getBoundingClientRect();
    const containerRect = gridArea.container.view.el.getBoundingClientRect();
    const left =  modelRect.left - gridArea.left - containerRect.left;
    const right = gridArea.width + gridArea.left - (modelRect.left + modelRect.width - containerRect.left);
    const top = modelRect.top - gridArea.top - containerRect.top;
    const bottom =  gridArea.height + gridArea.top - (modelRect.top + modelRect.height - containerRect.top);
  
    const centerLeft = Math.abs(gridArea.width / 2 - (left + modelRect.width / 2));
    const centerTop = Math.abs(gridArea.height / 2 - (top + modelRect.height / 2));
  
    const marginUnit = this.getMarginUnit(comp);
    let dockingPos;
  
    if (isOriginMarin) {
      return this.getDockingPosFromOriginMargin(comp, gridArea, marginUnit);
    }
  
    // get auto size anchor
    if (!fixAlignSelf && !fixJustifySelf) {
      const styles = GLOBAL.editor.getCompStyles(comp);
      const justifySelf = styles['justify-self'];
      const alignSelf = styles['align-self'];
      dockingPos = this.calcDockingPosAuto(gridArea, top, left, bottom, right, centerLeft, centerTop, justifySelf, alignSelf);
    } else {
      dockingPos = this.getDockingPosFixAlign(top, left, bottom, right, centerLeft, centerTop, fixAlignSelf, fixJustifySelf);
    }
  
    dockingPos.mUnit = marginUnit;
    dockingPos.mlpx = dockingPos.ml;
    dockingPos.ml = GLOBAL.unit.convertPixelValueToUnitValue(dockingPos.ml, gridArea.width, marginUnit.ml);
    dockingPos.mrpx = dockingPos.mr;
    dockingPos.mr = GLOBAL.unit.convertPixelValueToUnitValue(dockingPos.mr, gridArea.width, marginUnit.mr);
    dockingPos.mtpx = dockingPos.mt;
    dockingPos.mt = GLOBAL.unit.convertPixelValueToUnitValue(dockingPos.mt, gridArea.width, marginUnit.mt);
    dockingPos.mbpx = dockingPos.mb;
    dockingPos.mb = GLOBAL.unit.convertPixelValueToUnitValue(dockingPos.mb, gridArea.width, marginUnit.mb);
    dockingPos.area = gridArea;

    return dockingPos;
  }

  /**
   * get margin unit of component
   * @param comp 
   * @returns 
   */
  getMarginUnit(comp: DomComponent) : IMarginUnit {
    const styles = GLOBAL.editor.getCompStyles(comp);
  
    const ml = styles['margin-left'];
    const mr = styles['margin-right'];
    const mt = styles['margin-top'];
    const mb = styles['margin-bottom'];
  
    return {
      ml: GLOBAL.unit.parseUnit(ml),
      mr: GLOBAL.unit.parseUnit(mr),
      mt: GLOBAL.unit.parseUnit(mt),
      mb: GLOBAL.unit.parseUnit(mb)
    }
  }
  
  
  /**
   * get docking pos from origin margin
   * @param comp 
   * @param gridArea 
   * @param marginUnit 
   * @returns DockingPos
   */
  getDockingPosFromOriginMargin(comp: DomComponent, gridArea: IGridArea, marginUnit: IMarginUnit): IDockingPos {
    const ret: IDockingPos = {
      alignSelf: 'start',
      justifySelf: 'start',
      ml: 0,
      mr: 0,
      mt: 0,  
      mb: 0,
      mbpx:0,
      mlpx: 0,
      mtpx: 0,
      mrpx: 0,
      mUnit: marginUnit,
      area: gridArea
    };
  
    const styles = GLOBAL.editor.getCompStyles(comp);
    ret.ml =  parseFloat(styles['margin-left'] || '0');
    ret.mr =  parseFloat(styles['margin-right'] || '0');
    ret.mt =  parseFloat(styles['margin-top'] || '0');
    ret.mb =  parseFloat(styles['margin-bottom'] || '0');
  
    ret.alignSelf = styles['align-self'];
    ret.justifySelf = styles['justify-self'];
  
    ret.mUnit = marginUnit;
    
    ret.mlpx = GLOBAL.unit.convertUnitValueToPixel(ret.ml, gridArea.width, marginUnit.ml);
    ret.mrpx = GLOBAL.unit.convertUnitValueToPixel(ret.mr, gridArea.width, marginUnit.mr);
    ret.mtpx = GLOBAL.unit.convertUnitValueToPixel(ret.mt, gridArea.width, marginUnit.mt);
    ret.mbpx = GLOBAL.unit.convertUnitValueToPixel(ret.mb, gridArea.width, marginUnit.mb);
  
    return ret;
  }
  
  /**
   * calculate auto docking pos
   * @param gridArea 
   * @param top 
   * @param left 
   * @param bottom 
   * @param right 
   * @param centerLeft 
   * @param centerTop 
   * @param justifySelf 
   * @param alignSelf 
   * @returns 
   */
  calcDockingPosAuto(gridArea: IGridArea, top: number, left: number, bottom: number, right: number,
    centerLeft: number, centerTop: number, 
    justifySelf: 'start' | 'end' | 'stretch' | 'center'  = 'start',
    alignSelf: 'start' | 'end' | 'stretch' | 'center' = 'start'): IDockingPos {

    const ret: IDockingPos = {
      alignSelf: 'start',
      justifySelf: 'start',
      ml: 0,
      mr: 0,
      mt: 0,  
      mb: 0,
      mbpx:0,
      mlpx: 0,
      mtpx: 0,
      mrpx: 0,
      mUnit: null,
      area: gridArea
    };
    
    if (left <= right) {
      if (centerLeft > 0.2*(gridArea.width / 2)) {
        ret.justifySelf = 'start';
        ret.ml = left;
        ret.mr = 0;
      } else {
        ret.justifySelf = 'center';
        ret.mr = centerLeft * 2;
        ret.ml = 0;
        // console.log('centerLeft=', centerLeft);
      }
    }
  
    if (left > right) {
      if (centerLeft > 0.2*(gridArea.width / 2)) {
        ret.justifySelf = 'end';
        ret.mr = right;
        ret.ml = 0;
        // console.log('right=', right);
      } else {
        ret.justifySelf = 'center';
        ret.ml = centerLeft * 2;
        ret.mr = 0;
      }
    }
    // console.log('getAutoAnchorSize justifySelf=', justifySelf);
    if (justifySelf === 'stretch') {
      ret.justifySelf = 'stretch';
      ret.ml = left;
      ret.mr = right;
    }
  
    if (top <= bottom) {
      if (centerTop > 0.2*(gridArea.height / 2)) {
        ret.alignSelf = 'start';
        ret.mt = top;
        ret.mb = 0;
      } else {
        ret.alignSelf = 'center';
        ret.mb = centerTop * 2;
        ret.mt = 0;
      }
    }
  
    if (top > bottom) {
      if (centerTop > 0.2*(gridArea.height / 2)) {
        ret.alignSelf = 'end';
        ret.mb = bottom;
        ret.mt = 0;
      } else {
        ret.alignSelf = 'center';
        ret.mt = centerTop * 2;
        ret.mb = 0;
      }
    }
  
    if (alignSelf === 'stretch') {
      ret.alignSelf = 'stretch';
      ret.mt = top;
      ret.mb = bottom;
    }
    // console.log('gridArea=', gridArea);
    // console.log('top=', top, ' bottom= ', bottom, ' alignSelf=', ret.alignSelf);
    return ret;
  }
  
  /**
   * get fix anchor size
   * @param {*} top 
   * @param {*} left 
   * @param {*} bottom 
   * @param {*} right 
   * @param {*} centerLeft 
   * @param {*} centerTop 
   * @param {*} alignSelf 
   * @param {*} justifySelf 
   */
  getDockingPosFixAlign(top: number, left:number, bottom: number, right: number, centerLeft: number, centerTop: number, 
    alignSelf: 'start' | 'end' | 'stretch' | 'center', 
    justifySelf: 'start' | 'end' | 'stretch' | 'center'): IDockingPos {
    
    const ret: IDockingPos = {
      alignSelf: alignSelf,
      justifySelf: justifySelf,
      ml: 0,
      mr: 0,
      mt: 0,  
      mb: 0,
      mbpx:0,
      mlpx: 0,
      mtpx: 0,
      mrpx: 0,
      mUnit: null,
      area: null
    };
  
    if (justifySelf === 'start' || justifySelf === 'stretch') {
      ret.ml = left;
    }
  
    if (justifySelf === 'end' || justifySelf === 'stretch') {
      ret.mr = right;
    }
  
    if (alignSelf === 'start' || alignSelf === 'stretch') {
      ret.mt = top;
    }
  
    if (alignSelf === 'end' || alignSelf === 'stretch') {
      ret.mb = bottom;
    }
  
    // center justify
    if (justifySelf === 'center' && left > right) {
      ret.ml = centerLeft * 2;
    }
  
    if (justifySelf === 'center' && left <= right) {
      ret.mr = centerLeft * 2;
    }
  
    // center align
    if (alignSelf === 'center' && top < bottom) {
      ret.mb = centerTop * 2;
    }
  
    if (alignSelf === 'center' && top >= bottom) {
      ret.mt = centerTop * 2;
    }
  
    return ret;
  }

  calcDockingPosForCompRect(compRect: DOMRect, gridArea: IGridArea){
    const containerRect = gridArea.container.view.el.getBoundingClientRect();
    const left =  compRect.left - gridArea.left - containerRect.left;
    const right = gridArea.width + gridArea.left - (compRect.left + compRect.width - containerRect.left);
    const top = compRect.top - gridArea.top - containerRect.top;
    const bottom =  gridArea.height + gridArea.top - (compRect.top + compRect.height - containerRect.top);
  
    const centerLeft = Math.abs(gridArea.width / 2 - (left + compRect.width / 2));
    const centerTop = Math.abs(gridArea.height / 2 - (top + compRect.height / 2));
    // get auto size docking
    let dockingPos = this.calcDockingPosAuto(gridArea, top, left, bottom, right, centerLeft, centerTop, 'start', 'start'); //getAutoAnchorSize(gridArea, top, left, bottom, right, centerLeft, centerTop, 'start');
    return dockingPos;
  }
}



export {
  DockUtil,
  IDockingPos,
  IMarginUnit
}