import { GLOBAL } from "../landing/editor/editor-wrapper";

const CLOSEST_OFFSET = 2;

interface IAllNearestPos {
  vertPos: any;
  horzPos: any;
  centHorzPos: any;
  centVertPos: any;

  vertPosKeys: string[];
  horzPosKeys: string[];
  centVertPosKeys: string[];
  centHorzPosKeys: string[];
}

interface INearestHozPos {
  left: number,
  posObjs: {id: string, rect: DOMRect}[],
  posType: 'center' | 'start' | 'end'
}

interface INearestVertPos {
  top: number,
  posObjs: {id: string, rect: DOMRect}[],
  posType: 'center' | 'start' | 'end'
}

class NearestUtil {

  constructor() {
  }

  /**
   * get all nearest position 
   * @returns 
   */
  getAllNearestPos = (): IAllNearestPos => {
    let nearestPos: IAllNearestPos = {
      vertPos: {},
      horzPos: {},
      centHorzPos: {},
      centVertPos: {},

      vertPosKeys: [],
      horzPosKeys: [],
      centVertPosKeys: [],
      centHorzPosKeys: []
    }

    // const canvas = editor.Canvas;
    // const scrollTop = canvas.getBody().scrollTop;
    const allMoModels = GLOBAL.editor.getWrapper().find('[mo-type]');
    for (let i=0; i < allMoModels.length; i++) {
      const model = allMoModels[i];
      const moType = model.getAttributes()['mo-type'];
      if (moType === 'page') {
        continue;
      }
      const rect = allMoModels[i].view.el.getBoundingClientRect();
      const id = allMoModels[i].getId();
      const posObj = {
        id: id,
        rect: rect
      }
      //rect.y += ;
      // const height = parseFloat(rect.height);
      // const width = parseFloat(rect.width);
      // const y = parseFloat(rect.y);
      // const x = parseFloat(rect.x);
      const yc = rect.y + rect.height / 2 ;
      const xc = rect.x + rect.width / 2 ;
      const ye = rect.y + rect.height;
      const xe = rect.x + rect.width;
  
      // set horizontal pos
      if (!nearestPos.horzPos[rect.y]) {
        nearestPos.horzPos[rect.y] = [posObj];
      } else {
        nearestPos.horzPos[rect.y].push(posObj);
      }
      if (!nearestPos.horzPos[yc]) {
        nearestPos.horzPos[yc] = [posObj];
      } else {
        nearestPos.horzPos[yc].push(posObj);
      }
      if (!nearestPos.horzPos[ye]) {
        nearestPos.horzPos[ye] = [posObj];
      } else {
        nearestPos.horzPos[ye].push(posObj);
      }
  
      // set vertical pos 
      if (!nearestPos.vertPos[rect.x]) {
        nearestPos.vertPos[rect.x] = [posObj];
      } else {
        nearestPos.vertPos[rect.x].push(posObj);
      }
      if (!nearestPos.vertPos[xc]) {
        nearestPos.vertPos[xc] = [posObj];
      } else {
        nearestPos.vertPos[xc].push(posObj);
      }
      if (!nearestPos.vertPos[xe]) {
        nearestPos.vertPos[xe] = [posObj];
      } else {
        nearestPos.vertPos[xe].push(posObj);
      }
  
      // set horizontal center pos 
      if (!nearestPos.centHorzPos[yc]) {
        nearestPos.centHorzPos[yc] = [posObj];
      } else {
        nearestPos.centHorzPos[yc].push(posObj);
      }
  
      // set vertical center pos 
      if (!nearestPos.centVertPos[xc]) {
        nearestPos.centVertPos[xc] = [posObj];
      } else {
        nearestPos.centVertPos[xc].push(posObj);
      }
    }
    
    nearestPos.vertPosKeys = Object.keys(nearestPos.vertPos);
    nearestPos.vertPosKeys.sort((a, b) => {
      return (parseFloat(a) - parseFloat(b));
    });
  
    nearestPos.horzPosKeys = Object.keys(nearestPos.horzPos);
    nearestPos.horzPosKeys.sort((a, b) => {return parseFloat(a) - parseFloat(b)});
  
    nearestPos.centHorzPosKeys = Object.keys(nearestPos.centHorzPos);
    nearestPos.centHorzPosKeys.sort((a, b) => {return parseFloat(a) - parseFloat(b)});
  
    nearestPos.centVertPosKeys = Object.keys(nearestPos.centVertPos);
    nearestPos.centVertPosKeys.sort((a, b) => {return parseFloat(a) - parseFloat(b)});
    // console.log('getAllNearestPos nearestPos=', nearestPos);
    return nearestPos;
  }

  /**
   * get nearest horizontal position
   * @param ignoreIds 
   * @param rect 
   * @returns 
   */
  getNearestHozPos(ignoreIds: string[], rect: DOMRect): INearestHozPos {
    const x = rect.x;
    const width = rect.width;
    const closest = CLOSEST_OFFSET;
    const center = x + width / 2;
    const end = x + width;
    const nearestHoz: INearestHozPos = {
      left: 0,
      posObjs: [],
      posType: 'center'
    }
    // check center closest
    const centVertPos = GLOBAL.allNearestPos.centVertPos;
    for (let i=0; i < GLOBAL.allNearestPos.centVertPosKeys.length; i++) {
      let key = parseFloat(GLOBAL.allNearestPos.centVertPosKeys[i]);
      let posObjs: any[] = centVertPos[key];
      // console.log('getNearestLeftPos key=', key, ' center=', center);
      if ( key >= center - closest && key <=  center + closest) {
        posObjs = this.filterIgnoreComps(ignoreIds, posObjs);
        if (!posObjs.length) {
          continue;
        }
        rect.x = key - width / 2;
        nearestHoz.left = rect.x;
        nearestHoz.posObjs = posObjs;
        nearestHoz.posType = 'center';
        //showNearestVerticalLine(editor, posObjs, 'center', rect);
        // return {
        //   left: rect.x,
        //   posObjs: posObjs,
        //   posType: 'center'
        // };
        return nearestHoz;
      }
  
      if (key > center + closest) {
        break;
      }
    }
  
    // check left or right closet
    const vertPos = GLOBAL.allNearestPos.vertPos;
    for (let i=0; i < GLOBAL.allNearestPos.vertPosKeys.length; i++) {
      let key = parseFloat(GLOBAL.allNearestPos.vertPosKeys[i]);
      let posObjs = vertPos[key];
      if (key >= x - closest && key < x + closest) {
        posObjs = this.filterIgnoreComps(ignoreIds, posObjs);
        if (!posObjs.length) {
          continue;
        }
        rect.x = key;
        nearestHoz.left = rect.x;
        nearestHoz.posObjs = posObjs;
        nearestHoz.posType = 'start';
        return nearestHoz;
        // return {
        //   left: rect.x,
        //   posObjs: posObjs,
        //   posType: 'start'
        // };
      }
      if (key <= end + closest && key >= end - closest ) {
        posObjs = this.filterIgnoreComps(ignoreIds, posObjs);
        if (!posObjs.length) {
          continue;
        }
        rect.x = key - width;
        // showNearestVerticalLine(editor, posObjs, 'end', rect);
        // return {
        //   left: rect.x,
        //   posObjs: posObjs,
        //   posType: 'end'
        // };
        nearestHoz.left = rect.x;
        nearestHoz.posObjs = posObjs;
        nearestHoz.posType = 'end';
        return nearestHoz;
      }
      if (key > end + closest) {
        break;
      }
    }

    return null;
  }

  /**
   * get nearest vertical position
   * @param ignoreIds 
   * @param rect 
   * @returns 
   */
  getNearestVertPos(ignoreIds: string[], rect: DOMRect): INearestVertPos { 
    const y = rect.y;
    const height = rect.height;
    const closest = CLOSEST_OFFSET;
    const center = y + height / 2;
    const end = y + height;
    // const scrollTop = editor.Canvas.getBody().scrollTop;
    const nearestVert: INearestVertPos = {
      top: 0,
      posObjs: [],
      posType: 'center'
    }
    // console.log('getNearestTopPos end=', end, ' y=',y, ' height=',height);
    const centHorzPos = GLOBAL.allNearestPos.centHorzPos;
    for (let i=0; i < GLOBAL.allNearestPos.centHorzPosKeys.length; i++) {
      let key = parseFloat(GLOBAL.allNearestPos.centHorzPosKeys[i]);
      let posObjs = centHorzPos[key];
     // key -= scrollTop;
      // console.log('getNearestLeftPos key=', key, ' center=', center);
      if ( key >= center - closest && key <=  center + closest) {
        posObjs = this.filterIgnoreComps(ignoreIds, posObjs);
        if (!posObjs.length) {
          continue;
        }
        rect.y = key - height / 2;
        //showNearestVerticalLine(editor, posObjs, 'center', rect);
        // return {
        //   top: rect.y,
        //   posObjs: posObjs,
        //   posType: 'center'
        // };
        nearestVert.top = rect.y;
        nearestVert.posObjs = posObjs;
        nearestVert.posType = 'center';
        return nearestVert;
      }
  
      if (key > center + closest) {
        break;
      }
    }
  
    // check left or right closet
    const horzPos = GLOBAL.allNearestPos.horzPos;
    for (let i=0; i < GLOBAL.allNearestPos.horzPosKeys.length; i++) {
      let key = parseFloat(GLOBAL.allNearestPos.horzPosKeys[i]);
      let posObjs = horzPos[key];
      // key -= scrollTop;
      //console.log('getNearestTopPos key=', key, ' y=', y, ' end= ', end, ' posObjs=', posObjs);
      if (key >= y - closest && key < y + closest) {
        posObjs = this.filterIgnoreComps(ignoreIds, posObjs);
        if (!posObjs.length) {
          continue;
        }
        rect.y = key;
        // showNearestVerticalLine(editor, posObjs, 'start', rect);
        // return {
        //   top: rect.y,
        //   posObjs: posObjs,
        //   posType: 'start'
        // };
        nearestVert.top = rect.y;
        nearestVert.posObjs = posObjs;
        nearestVert.posType = 'start';
        return nearestVert;
      }
      
      if (key <= end + closest && key >= end - closest ) {
        posObjs = this.filterIgnoreComps(ignoreIds, posObjs);
        //console.log('find top botton key=', key, ' y=', y, ' end= ', end, ' posObjs=', posObjs);
        if (!posObjs.length) {
          continue;
        }
        rect.y = key - height;
        // return {
        //   top: rect.y,
        //   posObjs: posObjs,
        //   posType: 'end'
        // };
        nearestVert.top = rect.y;
        nearestVert.posObjs = posObjs;
        nearestVert.posType = 'end';
        return nearestVert;
      }
      if (key > end + closest) {
        break;
      }
    }
    // hide nearest horz line
    // hideNearestHorzLine(editor);
  
    return null;
  }

  /**
   * filter ignore Ids
   * @param ignoreIds 
   * @param posObjs 
   * @returns 
   */
  filterIgnoreComps(ignoreIds: string[], posObjs: any[]) {
    return posObjs.filter(obj => {
      if (ignoreIds.includes(obj.id)) {
        return false;
      }
      return true;
    });
  }

}

export {
  NearestUtil,
  IAllNearestPos,
  INearestHozPos,
  INearestVertPos
}