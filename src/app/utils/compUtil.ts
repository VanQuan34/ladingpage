import { uid } from "uid";
import { IBlock } from "../landing/editor/blocks/blocks.service";
import { MoButtonBlock } from "../landing/editor/blocks/button/button-block";
import { MoFieldInputBlock } from "../landing/editor/blocks/form/field-input";
import { MoTextBlock } from "../landing/editor/blocks/text/text-bock";
import { DomComponent, GLOBAL, CssRule } from "../landing/editor/editor-wrapper";
import { IDockingPos } from "./dockUtil";
import { IGridArea } from "./gridLayoutUtil";
import {Utils} from './utils';

interface HTMLComp {
  html: string;
  ids: string[];
  style: string;
}

class CompUtil {

  constructor() {

  }

  /**
   * find the mo component
   * @param comp 
   * @returns 
   */
  findMoComp(comp: DomComponent) {
    let moType = comp && comp.getAttributes()['mo-type'];
    let moComp = null;
    // console.log('getMoElement moType=',moType, model);
    if (moType) {
      return comp;
    }
  
    const maxLoop = 30;
    let number = 0;
    let tempComp = comp;
    while (number < maxLoop) {
      const parent = tempComp && tempComp.parent();
      const _moType = parent && parent.getAttributes()['mo-type'];
      tempComp = parent;
      if (_moType) {
        moComp = tempComp;
        break;
      }
      number++;
    }
  
    return moComp;
  };

  /**
   * get list Mo container from a component
   * @param comp 
   * @returns 
   */
  getListMoContainers(comp: DomComponent): DomComponent[] {
    let containers: DomComponent[] = [];
    const moType = comp && comp.getAttributes()['mo-type'];
    if (moType === 'section' || moType === 'footer' || moType === 'header') {
      return containers;
    }
  
    const maxLoop = 30;
    let number = 0;
    let tempComp = comp;
    while (number < maxLoop) {
      const parent = tempComp && tempComp.parent();
      const _moType = parent && parent.getAttributes()['mo-type'];
      if (_moType === 'container' || _moType === 'section' || _moType === 'footer' || _moType === 'header'
          || (parent && parent.hasClass('mo-comp-container'))) {
        containers.push(parent);
      }
      if (_moType === 'section' || _moType === 'footer' || _moType === 'header') {
        break;
      }
  
      tempComp = parent;
      number++;
    }
    return containers;
  };

  /**
   * find a selectedComp by level
   * @param comp 
   * @param nextLevel 
   * @param fromComp 
   * @returns 
   */
  findSelectedCompByLevel(comp: DomComponent, nextLevel: number=1, fromComp: DomComponent = null): DomComponent {
    const selectedComp = fromComp || GLOBAL.editor.getSelected();
    let selectedLevel = (selectedComp && selectedComp.getLevel()) || 1;
    let currentLevel = selectedLevel === 1 ? 2 : selectedLevel;
    const level = comp.getLevel();
    // console.log('findSelectedModel model level=', level, ' currentLevel=', currentLevel);
    if (level <= currentLevel) {
      return comp;
    }
    
    // if selected comp is container selected
    const containers = this.getListMoContainers(comp);
    if (selectedComp && this.checkIfContainsComp(containers, comp)) {
      currentLevel = currentLevel + nextLevel;
      // console.log('currentLevel 2=', currentLevel, ' selected el=', selectedModel.view.el, ' model el =', model.view.el);
    }
  
    if (level === currentLevel) {
      return comp;
    }
    
    for (let i=0; i < containers.length; i++) {
      const _level = containers[i].getLevel();
      if (_level === currentLevel) {
        return containers[i];
      }
    }

    return null;
  };

  /**
   * check if the comps contains a component
   * @param comps 
   * @param comp 
   * @returns 
   */
  checkIfContainsComp(comps: DomComponent[], comp: DomComponent) {
    const foundComp = comps.find(element => {
      if (element.getId() === element.getId()) {
        return true;
      }
      return false;
    });

    if (foundComp) {
      return true;
    }
    return false;
  }

  /**
   * get mo component
   * @param comp 
   * @param ignoreSelf 
   * @returns 
   */
  getContainer(comp: DomComponent, ignoreSelf: boolean = true): DomComponent {
    if (!comp) {
      return null;
    }
    if (ignoreSelf) {
      comp = comp.parent();
    }
    let container: DomComponent = null;
    let moType = comp && comp.getAttributes()['mo-type'];
    let limitCount = 0;
    while(limitCount < 20) {
      if (moType === 'container' || moType === 'header' || moType === 'footer' || moType === 'section'
          || (comp && comp.hasClass('mo-comp-container'))) {
        container = comp;
        break;
      }
      comp = comp && comp.parent();
      if (!comp) {
        break;
      }
      moType = comp.getAttributes()['mo-type'];
      limitCount += 1;
    }
    return container;
  }

  /**
   * return css rule list of comp
   * @param comp 
   * @returns 
   */
  getCssRulesOfComp(comp: DomComponent): CssRule[] {
    const cc = GLOBAL.editor.getCssComposer();
    const ids = [];
    const id = GLOBAL.compUtil.getStyleCompId(comp);
    ids.push(id);
    const moComps = comp.find('[id]');
    for (let i = 0; i < moComps.length; i++) {
      const moId = GLOBAL.compUtil.getStyleCompId(moComps[i]);
      if (moId) {
        ids.push(moId);
      }
    }
    let rules: CssRule[] = [];
    for (let i = 0; i < ids.length; i++) {
      const _id = ids[i];
      rules = [...rules, ...cc.findByStartsWith(_id, {})];
      // console.log('css id=', _id, ' rules=', rules);
    }
  
    return rules;
  }

  /**
   * Return object html of comp
   * @param comp 
   * @returns 
   */
  toHtml(comp: DomComponent): HTMLComp {
    const cc = GLOBAL.editor.getCssComposer();
    const ids = [];
    ids.push(comp.getAttributes()['id']);
    const comps = comp.find('[id]');
    for (let i = 0; i < comps.length; i++) {
      const id = comps[i].getAttributes()['id'];
      if (id) {
        ids.push(id);
      }
    }
  
    const allRules = this.getCssRulesOfComp(comp); 
    let cloneModelHtml = ``;
    let styles = ``;
    for (let i = allRules.length - 1; i >= 0; i--) {
      const cssRule: CssRule = allRules[i];
      styles = `${styles} ${cssRule.toCSS({})}`;
    }
  
    styles = `${styles}`;
    cloneModelHtml = `${comp.toHTML()}`;
    cloneModelHtml = this.filterHtmlAttributes(cloneModelHtml);
    return { ids: ids, html: cloneModelHtml, style: styles };
  }

  /**
   * remove data-preview attributes
   * @param html 
   * @returns 
   */
  filterHtmlAttributes(html: string) {
    const container = document.createElement('div');
    container.innerHTML = html;
    $(container).find('[data-preview]').removeAttr('data-preview');

    return $(container).html();
  }

  /**
   * return string clone html of component
   * @param comp 
   * @returns 
   */
  cloneCompHtml(comp: DomComponent, container: DomComponent) {
    const compHtml = this.toHtml(comp);
    return this.convertCompHtml(compHtml, container);
  }

  /**
   * return the comp html string
   * @param compHml 
   * @param container 
   * @returns 
   */
  convertCompHtml(compHml: HTMLComp, container: DomComponent): string {
    const containerId = container.getId();
    let isNormal = containerId.includes('__') ? false : true;
    let newHtml = '';
    let newStyle = '';
    let oldIds: string[] = [];
    let newIds: string[] = [];
    let newStyleIds: string[] = [];
    let oldStyleIds: string[] = [];

    let ids = compHml.ids;
    // for (let i=0; i < ids.length ; i++) {
    //   const objId = this.getStyleRuleIdFromCompId(ids[i], isNormal);
    //   // console.log('convertCompHtml compHml=',compHml, ' objId=', objId);
    //   oldIds.push(objId.oldId);
    //   oldStyleIds.push(objId.oldStyleId);
    //   newIds.push(objId.newId);
    //   newStyleIds.push(objId.newStyleId);
    // }

    const objId = this.getStyleRuleIdFromCompId(ids[0], isNormal);
    oldIds.push(objId.oldId);
    oldStyleIds.push(objId.oldStyleId);
    newIds.push(objId.newId);
    newStyleIds.push(objId.newStyleId);

    ids = ids.slice(0, 1);

    const objIds = this.getReplaceIdsFromCompId(ids);
    // console.log('objIds=', objIds);
    oldIds = [...oldIds, ...objIds.oldIds];
    newIds = [...newIds, ...objIds.newIds];
    newStyleIds = [...newStyleIds, ...objIds.newStyleIds];
    oldStyleIds = [...oldStyleIds, ...objIds.oldStyleIds];
    
    newHtml = compHml.html;
    for (let i=0; i < oldIds.length; i++) {
      const id = oldIds[i];
      // newHtml = newHtml.replace(re, newIds[i]);
      newHtml = Utils.replaceAll(newHtml, id, newIds[i]);
    }
    // console.log('style=', compHml.style);
    newStyle = compHml.style;
    for (let i=0; i < oldStyleIds.length; i++) {
      const id = oldStyleIds[i];
      newStyle = Utils.replaceAll(newStyle, id, newStyleIds[i]);//newStyle.replace(id, newStyleIds[i]);
      // console.log('newStyle=',newStyle, 'newStyleIds=',newStyleIds[i], id);
    }

    for (let i=0; i < oldIds.length; i++) {
      const id = oldIds[i];
      // newHtml = newHtml.replace(re, newIds[i]);
      newStyle = Utils.replaceAll(newStyle, id, newIds[i]);
    }

    // console.log('newStyle=', newStyle, ' newHtml=', newHtml);
    return `<style>${newStyle}</style>${newHtml}`;
  }

  /**
   * return object old ids list, new ids list 
   * @param compId 
   * @param isNormal 
   * @returns 
   */
  getStyleRuleIdFromCompId(compId: string, isNormal: boolean = true):  {
    oldId: string,
    oldStyleId: string,
    newId: string,
    newStyleId: string
  } {
    let oldStyleId = '';
    let newStyleId = '';
    let oldId = compId;
    let newId = '';

    if (compId.includes('__')) {
      const arr = compId.split('__');
      const newUid = uid();
      newId = isNormal ? `comp-${newUid}` : `comp-${newUid}__${uid()}`; 
      oldStyleId = `[id^="${arr[0]}__"]`;
      newStyleId = isNormal ? `#comp-${newUid}` : `[id^="comp-${newUid}__"]`;

      return {
        oldId: oldId,
        oldStyleId: oldStyleId,
        newId: newId,
        newStyleId: newStyleId
      }
    }

    const newUid = uid();
    newId = isNormal ? `comp-${newUid}` : `comp-${newUid}__${uid()}`;
    oldStyleId = `#${oldId}`;
    newStyleId = isNormal ? `#comp-${newUid}` : `[id^="comp-${newUid}__"]`;

    return {
      oldId: oldId,
      oldStyleId: oldStyleId,
      newId: newId,
      newStyleId: newStyleId
    }
  }

  /**
   * return object replace ids
   * @param ids 
   * @returns 
   */
  getReplaceIdsFromCompId(ids: string[]):  {
    oldIds: string[],
    oldStyleIds: string[],
    newIds: string[],
    newStyleIds: string[]
  } {
    let oldStyleIds: string[] = [];
    let newStyleIds: string[] = [];
    let oldIds: string[] = [];
    let newIds: string[] = [];

    ids.forEach(id => {
      const newUid = uid();
      if (id.includes('__')) {
        const startId = id.split('__')[0];
        const startIds: string[] = ids.filter(_id => {
          if (_id.includes(startId)) {
            return true;
          }
          return false;
        });
        
        startIds.forEach(_id => {
          const ojbId = this.getReplaceIdFromCompId(_id, newUid, startId);
          oldStyleIds.push(ojbId.oldStyleId);
          oldIds.push(ojbId.oldId);
          newIds.push(ojbId.newId);
          newStyleIds.push(ojbId.newStyleId);
        });

        ids = ids.filter(_id => {
          if (startIds.includes(_id)) {
            return false;
          }
          return true;
        })
      } else {
        const ojbId = this.getReplaceIdFromCompId(id, newUid);
        oldStyleIds.push(ojbId.oldStyleId);
        oldIds.push(ojbId.oldId);
        newIds.push(ojbId.newId);
        newStyleIds.push(ojbId.newStyleId);
      }
    });

    return {
      oldIds: oldIds,
      oldStyleIds: oldStyleIds,
      newIds: newIds,
      newStyleIds: newStyleIds
    }
  }

  /**
   * return object replace id
   * @param compId 
   * @param newUid 
   * @param startId 
   * @returns 
   */
  getReplaceIdFromCompId(compId: string, newUid: string = '', startId: string = ''): {
    oldId: string,
    oldStyleId: string,
    newId: string,
    newStyleId: string
  } {
    let oldStyleId = '';
    let newStyleId = '';
    let oldId = compId;
    let newId = '';

    if (startId && newUid) {
      const arr = compId.split('__');
      newId = `${startId}__${uid()}`; 
      oldStyleId = `[id^="${arr[0]}__"]`;
      newStyleId = `[id^="comp-${newUid}__"]`;
    } else {
      newId = `comp-_${newUid}`; 
      oldStyleId = `#${oldId}`;
      newStyleId = `#comp-${newUid}`
    }

    return {
      oldId: oldId,
      oldStyleId: oldStyleId,
      newId: newId,
      newStyleId: newStyleId
    }
  }

  /**
   * remove css rule of comp
   * @param comp 
   */
  removeRuleCssOfComp(comp: DomComponent) {
    const cc = GLOBAL.editor.getCssComposer();
    let cssRules = this.getCssRulesOfComp(comp);
    for (let i = 0; i < cssRules.length; i++) {
      cc.removeRule(cssRules[i]);
    }
  }
  
  /**
   * remove component
   * @param comp 
   */
  removeComp(comp: DomComponent) {
    // remove css rule
    this.removeRuleCssOfComp(comp);
    // remove selected comp
    GLOBAL.editor.removeSelect();
    // remove comp
    comp.remove();
  }

  /**
   * attach component to new container
   * @param comp 
   * @param toContainer 
   * @returns 
   */
  attachCompToNewContainer(comp: DomComponent, toContainer: DomComponent): boolean {
    const dockingPos: IDockingPos = GLOBAL.dock.getDockingPos(toContainer, comp);
    comp.removeClass('mo-comp-moving');
    comp.deleteInlineStyle();

    const oldId = comp.getId(); 
    
    // clone comp html
    const cloneCompHtml = this.cloneCompHtml(comp, toContainer);
    
    // remove comp
    this.removeComp(comp);
    this.removeFromOtherRepeaterItems(oldId);

    const cloneComps = this.appendToContainer(cloneCompHtml, toContainer);
    if (!cloneComps || !cloneComps.length) {
      return false;
    }
    const cloneComp = cloneComps[cloneComps.length - 1];
    const marginUnit = dockingPos.mUnit;
   // console.log('attachCompToNewContainer cloneCompHtml= ', cloneCompHtml);

    const styleId = GLOBAL.compUtil.getStyleCompId(cloneComp);
    const styles = GLOBAL.editor.getStyles(styleId) // cloneModel.getStyle1();
    // set new docking position
    styles['margin-left'] = dockingPos.ml + marginUnit.ml;
    styles['margin-top'] = dockingPos.mt + marginUnit.mt;
    styles['margin-bottom'] = dockingPos.mb + marginUnit.mb;
    styles['margin-right'] = dockingPos.mr + marginUnit.mr;
    styles['align-self'] = dockingPos.alignSelf;
    styles['justify-self'] = dockingPos.justifySelf;
    styles['grid-row-start'] = dockingPos.area.startRow;
    styles['grid-row-end'] = dockingPos.area.endRow;
    styles['grid-column-start'] = dockingPos.area.startCol;
    styles['grid-column-end'] = dockingPos.area.endCol;
    
    // update size
    this.updateCompSizeStyle(cloneComp, dockingPos.area, styles);

    GLOBAL.editor.setStyles(styleId, styles);
    // remove moving class
    cloneComp.removeClass('mo-comp-moving');
    // select new component
    GLOBAL.editor.select(cloneComp);

    this.appendToOtherRepeaterItems(cloneComp, toContainer);
    return true;
  }
  /**
   * append to other repeater item
   * @param comp 
   * @param container 
   * @returns 
   */
  appendToOtherRepeaterItems(comp: DomComponent, container: DomComponent) {
    const contId = container && container.getId();
    const ids: string[] = [];
    
    if (!contId || !contId.includes('__')) {
      return;
    }
    
    const startContId = contId.split('__')[0];
    const containers: DomComponent[] = GLOBAL.editor.getWrapper().find(`[id^="${startContId}__"]`);
    // console.log('addToOtherRepeaterItems containers=', containers);

    ids.push(comp.getId());
    const childComp = comp.find('[id]');
    childComp.forEach(child => {
      ids.push(child.getId());
    });

    const compHtml = comp.view.el.outerHTML;

    containers.forEach(item => {
      if (item.getId() !== container.getId()) {
        let newHtml: string = compHtml;
        const newIds: string[] = [];
        ids.forEach(id => {
          let newId;
          if (id.includes('__')) {
            const startId = id.split('__')[0];
            newId = `${startId}__${uid()}`;
          } else {
            newId = `comp-${uid()}`;
          }
          newIds.push(newId);
        });

        for (let i=0; i < ids.length; i++) {
          const id = ids[i];
          newHtml = Utils.replaceAll(newHtml, id, newIds[i]);
        }
        // console.log('newHtml=', newHtml);
        this.appendToContainer(newHtml, item);
      }
    });
  }
  /**
   * remove comp from repeater item
   * @param id 
   * @returns 
   */
  removeFromOtherRepeaterItems(id: string) {
    if (!id || !id.includes('__')) {
      return;
    }
    
    const startContId = id.split('__')[0];
    const comps: DomComponent[] = GLOBAL.editor.getWrapper().find(`[id^="${startContId}__"]`);
    // console.log('removeFromOtherRepeaterItems comps=', comps);
    comps.forEach(comp => {
      if (comp.getId() !== id) {
        comp.remove();
      }
    });
  }

  /**
   * append comp to container
   * @param comp 
   * @param container 
   */
  appendToContainer(comp: DomComponent | string, container: DomComponent, opts: any= {}) {
    const gridContainer = this.getGridContainer(container);
    return gridContainer.append(comp, opts);
  }

  /**
   * update comp size style
   * @param comp 
   * @param gridArea 
   * @param styles 
   * @returns 
   */
  updateCompSizeStyle = (comp: DomComponent, gridArea: IGridArea, styles: any): any => {
    const width = styles['width'];
    const unitKey = GLOBAL.unit.parseUnit(width);
    const rect = comp.view.el.getBoundingClientRect();
    styles['width'] = `${GLOBAL.unit.convertPixelValueToUnitValue(rect.width, gridArea.width, unitKey)}${unitKey}`;
    return styles;
  }

  /**
   * update position for comp when move ended
   * @param container 
   * @param comp 
   * @returns 
   */
  updateCompPosMoveEnded(comp: DomComponent, container: DomComponent) {
    //console.log('updateMovedModelPos container= ', container);
    if (!container) {
      return;
    }
    const dockingPos = GLOBAL.dock.getDockingPos(container, comp);
    const unit = dockingPos.mUnit;
    const area = dockingPos.area;
    const styleId = GLOBAL.compUtil.getStyleCompId(comp);
    const styles = GLOBAL.editor.getStyles(styleId, {onlyMedia: true});

    styles['margin-left'] = dockingPos.ml + unit.ml;
    styles['margin-top'] = dockingPos.mt + unit.mt;
    styles['margin-bottom'] = dockingPos.mb + unit.mb;
    styles['margin-right'] = dockingPos.mr + unit.mr;
    styles['align-self'] = dockingPos.alignSelf;
    styles['justify-self'] = dockingPos.justifySelf;
    styles['grid-row-start'] = area.startRow;
    styles['grid-row-end'] = area.endRow;
    styles['grid-column-start'] = area.startCol;
    styles['grid-column-end'] = area.endCol;
  
    // update size
    this.updateCompSizeStyle(comp, dockingPos.area, styles);
    GLOBAL.editor.setStyles(styleId, styles);

    // remove moving class
    comp.removeClass('mo-comp-moving');
    comp.deleteInlineStyle();  
  }

  /**
   * return rule style id of component
   * @param comp 
   * @returns 
   */
  getStyleCompId(comp: DomComponent): string {
    let id: string = comp && comp.getId();
    if (id && id.includes('__')) {
      let idArr = id.split('__');
      id = `[id^="${idArr[0]}__"]`;
    } else if (id && id.includes('_')) {
      let idArr = id.split('_');
      id = `[id^="${idArr[0]}_"]`;
    } else {
      id = `#${id}`;
    }
    return id;
  }

  /**
   * append temp comp when moving or resizing 
   * @param comp 
   */
  appendTempComp(comp: DomComponent) {
    const container = this.getContainer(comp);
    const gridContainer = this.getGridContainer(container);
    if (!gridContainer || !comp) {
      return;
    }
    const styles = GLOBAL.editor.getCompStyles(comp);
    const rect = comp.view.el.getBoundingClientRect();
    const tempDiv = document.createElement("div");
    $(tempDiv).attr('id', `comp-temp__${comp.getId()}`);
    $(tempDiv).css({
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      'margin-top': styles['margin-top'],
      'margin-left': styles['margin-left'],
      'margin-bottom': styles['margin-bottom'],
      'margin-right': styles['margin-right'],
      'algin-self': styles['align-self'],
      'justify-self': styles['justify-self'],
      'grid-row-start': styles['grid-row-start'],
      'grid-column-start': styles['grid-column-start'],
      'grid-row-end': styles['grid-row-end'],
      'grid-column-end': styles['grid-column-end'],
      'position': 'relative'
    });

    gridContainer.view.$el.append(tempDiv);
  }

  /**
   * get grid container
   * @param comp 
   * @returns 
   */
  getGridContainer(container: DomComponent) {
    if (!container) {
      return null;
    }
    // const id = container.getId();
    //let gridId = this.getGridContainerId(id);
    // console.log('getGridContainer gridId=', gridId);
    //let gridContainer = (container.find(`.${gridId}`).length && container.find(`.${gridId}`)[0]) || container;

    return container;
  }

  /**
   * return grid container id
   * @param id 
   * @returns 
   */
  getGridContainerId(id: string) {
    if (!id) {
      return '';
    }
    let gridId = `${id}-container`;
    if (id.includes('__')) {
      gridId = `${id.split('__')[0]}-container`;
    }
    return gridId;
  }

  /**
   * return styles of grid container
   * @param comp 
   */
  getGridContainerStyles(comp: DomComponent) {
    if (!comp) {
      return {};
    }
    const compId = GLOBAL.compUtil.getStyleCompId(comp);
    const id = comp && comp.getId();
    const gridId = this.getGridContainerId(id);

    if (comp && comp.find(`.${gridId}`).length) {
      return GLOBAL.editor.getStyles(`${compId} .${gridId}`, {});
    }
    return GLOBAL.editor.getStyles(`${compId}`, {});
  }

  /**
   * remove temp element
   */
  removeTempElement() {
    GLOBAL.editor.getWrapper().view.$el.find(`[id^="comp-temp__"]`).remove();
  }

  /**
   * check if the component is container
   * @param comp 
   * @returns 
   */
  isContainer(comp: DomComponent) {
    let isContainer: boolean;
    const attrs = comp.getAttributes();
    const moType = attrs['mo-type'];
    isContainer = moType === 'section' || moType === 'header' || moType === 'footer' 
      || moType === 'container' || (comp.hasClass('mo-comp-container') &&  moType !== 'repeater') ? true : false;
    return isContainer;
  }

  /**
   * check if comp is empty
   * @param comp 
   */
  checkCompIsEmpty(comp: DomComponent) {
    return comp && comp.find(`[mo-type]`).length ? false : true;
  }

  appendChildToForm(formComp: DomComponent){
    const attrs = formComp.getAttributes();
    if(attrs['mo-type'] !== 'form'){
      return;
    }

    
    MoTextBlock.appendToForm(formComp, {
      width: '100',
      classTheme: 'font-5',
      content: 'Liên hệ với chúng tôi',
      gridRowStart: 1,
      gridRowEnd: 2,
      gridColStart: 1,
      gridColEnd: 3,
    });
    MoFieldInputBlock.appendToForm(formComp, {
      width: '100',
      classTheme: '',
      content: '',
      multipleLine: false,
      gridRowStart: 2,
      gridRowEnd: 3,
      gridColStart: 1,
      gridColEnd: 2,
      label: 'Email',
      index: 0,
      placeHolder: 'vd: vidu.mobio.io'
    });
    MoFieldInputBlock.appendToForm(formComp, {
      width: '100',
      classTheme: '',
      content: '',
      multipleLine: false,
      gridRowStart: 3,
      gridRowEnd: 4,
      gridColStart: 2,
      gridColEnd: 3,
      label: 'Tên',
      index: 1,
      placeHolder: 'vd: Văn'
    });
    MoFieldInputBlock.appendToForm(formComp, {
      width: '100',
      classTheme: '',
      multipleLine: false,
      content: '',
      gridRowStart: 2,
      gridRowEnd: 3,
      gridColStart: 2,
      gridColEnd: 3,
      label: 'Họ',
      index: 2,
      placeHolder: 'vd: Nguyễn'
    });
    MoFieldInputBlock.appendToForm(formComp, {
      width: '100',
      classTheme: '',
      multipleLine: false,
      content: '',
      gridRowStart: 3,
      gridRowEnd: 4,
      gridColStart: 1,
      gridColEnd: 2,
      label: 'Điện thoại',
      index: 3,
      placeHolder: 'vd: 123-456-789'
    });
    MoFieldInputBlock.appendToForm(formComp, {
      width: '100',
      multipleLine: true,
      classTheme: '',
      content: '',
      gridRowStart: 4,
      gridRowEnd: 5,
      gridColStart: 1,
      gridColEnd: 3,
      label: 'Tin nhắn',
      index: 4,
      placeHolder: 'vd: Đây là tin nhắn'
    });
    MoButtonBlock.appendToForm(formComp, {
      width: '100',
      type: 'long-text',
      classTheme: '',
      content: 'Gửi',
      gridRowStart: 5,
      gridRowEnd: 6,
      gridColStart: 1,
      unit: '%',
      gridColEnd: 3,
      label: 'Tin nhắn',
      index: 4,
      placeHolder: 'vd: Đây là tin nhắn',
      borderRadius: 0
    });


  }

}

export {
  CompUtil,
  HTMLComp
}