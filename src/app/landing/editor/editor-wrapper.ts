import { BreakPointUtils } from 'src/app/utils/breakPointUtils';
import { ContentBuilderEditor } from 'src/app/utils/builder/contentBuilder';
import { CompUtil } from 'src/app/utils/compUtil';
import { DockUtil } from 'src/app/utils/dockUtil';
import { GridLayoutUtil } from 'src/app/utils/gridLayoutUtil';
import { IAllNearestPos, INearestHozPos, NearestUtil, INearestVertPos } from 'src/app/utils/nearestUtil';
import { UnitUtil } from 'src/app/utils/unitUtil';
import { Utils } from 'src/app/utils/utils';
import { ILandingPage, IMediaBreakPoint } from './root.service';
import { IThemeFontItem } from './toolbar/left/site-styles/text/text.component';

interface IGLOBAL {
  editor: MoWbEditorWrapper;
  unit: UnitUtil;
  grid: GridLayoutUtil;
  dock: DockUtil;
  nearestUtil: NearestUtil;
  compUtil: CompUtil;
  builder: ContentBuilderEditor;
  rootStyles: any;
  canvasEl: HTMLElement;
  allNearestPos: IAllNearestPos;
  landingPage: ILandingPage;
  fonts: IThemeFontItem[];
}

const GLOBAL: IGLOBAL = {
  editor: null,
  rootStyles: {},
  unit: null,
  grid: null,
  dock: null,
  canvasEl: null,
  nearestUtil: null,
  allNearestPos: null,
  compUtil: null,
  landingPage: null,
  fonts: [],
  builder: null
}

interface SelectorType {
  TYPE_CLASS: 1,
  TYPE_ID: 2,
  TYPE_ELEMENT: 3
}

interface RuleOptions {
  id?: string,
  fixMedia?: boolean; // fix specific media 
  state?: string;
  mediaText?: string; // media text 
  selectorsAdd?: string;
  onlyMedia?: boolean; // only get style in current media
  type?: 1 | 2 | 3; // 2 - type id, 1: type class, 3: type other
}

interface ICss {
  selectors: string[],
  selectorsAdd: string,
  state: string,
  style: any,
  mediaText?: string,
  atRuleType?: string;
}

class MoWbEditorWrapper {
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
    // get nearest horizontal position
    this.editor.getNearestHozPos = (ignoreIds: string[], rect: DOMRect) : INearestHozPos => {
      return GLOBAL.nearestUtil.getNearestHozPos(ignoreIds, rect);
    }
    // get nearest vertical position
    this.editor.getNearestVertPos = (ignoreIds: string[], rect: DOMRect) : INearestVertPos => {
      return GLOBAL.nearestUtil.getNearestVertPos(ignoreIds, rect);
    }
    // attach component to new container
    this.editor.attachCompToNewContainer = (comp: DomComponent, toContainer: DomComponent): boolean => {
      return GLOBAL.compUtil.attachCompToNewContainer(comp, toContainer);
    }
    // update position of comp when move ended
    this.editor.updateCompPosMoveEnded = (comp: DomComponent, container: DomComponent): void => {
      GLOBAL.compUtil.updateCompPosMoveEnded(comp, container);
    }
  }

  /**
   * get Editor
   * @returns Editor Module
   */
  public getEditor() {
    return this.editor;
  }

  /**
   * get editor's model
   * @returns Editor Model
   */
  public getModel(): any {
    return this.editor.getModel();
  }

  /**
   * get Css Composer
   * @returns 
   */
  public getCssComposer(): CssComposer {
    return this.editor.CssComposer;
  }

  /**
   * get Canvas
   * @returns {Object} canvas object
   */
  public getCanvas(): any {
    return this.editor.Canvas;
  }

  /**
   * get iframe element
   * @returns 
   */
  public getFrameEl(): any {
    return this.getCanvas().getFrameEl();
  }

  /**
   * get iframe body
   * @returns 
   */
  public getIFrameBody(): HTMLElement {
    return this.getCanvas().getBody();
  }

  /**
   * get iframe window
   * @returns 
   */
  public getIframeWin(): any {
    const iframeEl = this.getFrameEl();
    return iframeEl.contentWindow;
  }
  
  /**
   * return styles of component
   * @param comp 
   * @param opts 
   */
  getCompStyles(comp: DomComponent, opts: RuleOptions={}) {
    const id = GLOBAL.compUtil.getStyleCompId(comp);
    const styles = this.getStyles(id, opts);
    return styles;
  }

  /**
   * Get the styles of selector
   * @param {string} name name of selector
   * @param {RuleOptions} opts RuleOption
   * @returns 
   */
  public getStyles(name: string, opts: RuleOptions={}) {
    const cc = this.getCssComposer();
    const ruleType = this.convertRuleStyleName(name, opts.type);
    // console.log('ruleType=', ruleType);
    opts.type = ruleType.type;
    let styles: any = {};
    if (opts.fixMedia) {
      const rule = cc.getRule(ruleType.name, opts);
      if (rule) {
        return rule.getStyle() || {};
      }
      return {};
    }
    // case only media
    if (opts.onlyMedia) {  
      const breakPoint = BreakPointUtils.getSelectedBreakPoint();
      styles = this.getStyleAtMedia(ruleType.name, breakPoint, opts);
      return styles || {};
    }
    // all media
    const mediaList = BreakPointUtils.getAboveBreakPoints();
    for (let i = 0; i < mediaList.length; i++) {
      const _styles = this.getStyleAtMedia(ruleType.name, mediaList[i], opts);
      if (_styles != null) {
        styles = { ...styles, ..._styles };
      }
    }
    return styles;
  }

  /**
   * get styles at media
   * @param id 
   * @param breakPoint 
   * @param opts 
   * @returns {Object} style object
   */
  getStyleAtMedia(id: string, breakPoint: IMediaBreakPoint, opts: RuleOptions): any {
    const cc = this.getCssComposer();
    let styles = null;
    const mediaText = BreakPointUtils.getMediaText(breakPoint);
    opts.mediaText = mediaText;
    const rule = cc.getRule(id, opts);
    if (rule) {
      styles = rule.getStyle();
    }
    return styles;
  }

  /**
   * return object type of rule 
   * @param name 
   * @returns type of rule 
   */
  convertRuleStyleName(name: string, type: 1 | 2| 3): {
    type: any,
    name: string
  } {
    if (type) {
      return {
        type: type,
        name: name
      }
    }
    let newName: string = name;
    if (name && name[0] == '#') {
      newName = name.substring(0);
      type = 2; // is id
    } else if (name && name[0] == '.') {
      newName = name.substring(0);
      console.log('name=', name, ' newName=', newName);
      type = 1; // is class
    } else {
      type = 3;
    }
    return {
      type: type,
      name: newName
    };
  }

  /**
   * Set the style on the component
   * @param {string} name name of selector
   * @param {Object} prop Key value style object
   * @param {RuleOptions} opts 
   * @returns 
   */
  public setStyles(name: string, prop: any, opts: RuleOptions = {}) {
    const cc = this.getCssComposer();
    const ruleType = this.convertRuleStyleName(name, opts.type);
    opts.type = ruleType.type;
    if (opts.fixMedia) {
      const rule = cc.setRule(ruleType.name, prop, { ...opts });
      return rule;
    }
    const mediaText = BreakPointUtils.getMediaText(BreakPointUtils.getSelectedBreakPoint());
    if (mediaText) {
      opts.mediaText = mediaText;
    }
    const rule = cc.setRule(ruleType.name, prop, opts);
    return rule;
  }

  /**
   * set comp styles
   * @param comp 
   * @param prop 
   * @param opts 
   */
  public setCompStyles(comp: DomComponent, prop: any, opts: RuleOptions = {}) {
    const id = GLOBAL.compUtil.getStyleCompId(comp);
    this.setStyles(id, prop, opts);
  }

  /**
   * get rule style
   * @param {string} name 
   * @param {RuleOptions} options
   * @returns {CssRule} css rule
   */
  public getRule(name: string, options: RuleOptions = {}) : CssRule {
    const cssComposer = this.getCssComposer();
    const rule = cssComposer.getRule(name, options);

    return rule;
  }

  /**
   * get all rules
   * @returns {Object} all css rules
   */
  public getAllRules(): any {
    return this.getCssComposer().getAll();
  }

  /**
   * get a selected Dom component
   */
  public getSelected(): DomComponent {
    return this.editor.getSelected();
  }

  /**å
   * get wrapper component
   * @returns {DomComponent}
   */
  public getWrapper(): DomComponent {
    return this.editor.getWrapper();
  }

  /**
   * get document iframe
   * @returns {Document} document iframe
   */
  public getDocument(): Document {
    return this.getCanvas().getDocument();
  }


  /**
   * get the container of the component
   * @param {DomComponent} comp 
   * @param {boolean} ignoreSelf
   * @returns {DomComponent} container of component
   */
  // public getContainer(comp: DomComponent, ignoreSelf: boolean = true): DomComponent {
  //   return GLOBAL.compUtil.getContainer(comp, ignoreSelf);
  // }

  /**
   * get block moved flag
   * @returns {boolean} the flag blockMoved
   */
  public getBlockMoved(): boolean {
    return this.editor.blockMoved;
  }


  /**
   * get UndoManager
   * @returns 
   */
  getUndoManager() {
    return this.editor.UndoManager;
  }

  /**
   * is undo available
   * @returns 
   */
  isUndoAvailable() {
    return this.getUndoManager().isUndoAvailable();
  }

  /**
   * is redo available
   * @returns 
   */
  isRedoAvailable() {
    return this.getUndoManager().isRedoAvailable();
  }

  /**
   * run command editor
   * @param name 
   * @param options 
   */
  runCommand(name: string, options: any) {
    return this.editor.runCommand(name, options);
  }

  /**
   * set block moved
   * @param moved 
   */
  public setBlockMoved(moved: boolean) {
    this.editor.blockMoved = moved;
  }
  /**
   * get editor class rule
   * @param name 
   * @param styles 
   * @param options 
   */
  public setRule(name: string, styles: any, options: RuleOptions = {}) {
    this.getCssComposer().setRule(name, styles, options);
  }

  /**
   * set resize moving flag
   * @param isMoving 
   */
  public setResizeMoving(isMoving: boolean) {
    this.editor.resizeMoving = isMoving;
  }

  /**
   * select model
   * @param model 
   */
  public select(model: any) {
    this.editor.select(model);
  }

  /**
   * update media
   * @param oldMedia 
   * @param newMedia 
   */
  public updateMedia(oldMedia: any, newMedia: any) {
    this.editor.updateMedia(oldMedia, newMedia);
  }

  /**
   * remove media
   * @param media 
   */
  public removeMedia(media: any) {
    this.editor.removeMedia(media);
  }


  /**
   * remove selected
   * @returns 
   */
  public removeSelect(): any {
    return this.editor.removeSelect();
  }

  /**
   * return string html of page
   * @returns 
   */
  public getHtml(): string {  
    return this.editor.getHtml();
  }

  /**
   * return string css of page
   * @returns 
   */
  public getCss(): string {  
    return this.editor.getCss();
  }

  public getParser(): Parser {
    return this.editor.Parser
  }

  /**
   * parse string style, return array css
   * @param styleStr 
   * @returns 
   */
  parseCss(styleStr: string): ICss[] {
    return this.getParser().parseCss(styleStr);
  }
 
} 

/**
 * View Component abstract class
 */
abstract class ViewDomComponent {
  /**
   * element javascript of component
   */
  public abstract el: HTMLElement;
  /**
   * element jquery of component
   */
  public abstract $el: any
}

/**
 * Dom Component abstract class
 */
abstract class DomComponent {
  /**
   * the view of the component
   * 
   */
  public abstract view: ViewDomComponent;
  /**
   * Find inner components by query string.
   * **ATTENTION**: this method works only with already rendered component
   * @param  {String} query Query string
   * @return {Array} Array of components
   * @example
   * component.find('div > .class');
   * // -> [Component, Component, ...]
   */
  public abstract find(query: string): DomComponent[];

  /**
   * get id of component
   */
  public abstract getId(): string;
  /**
   * get attribute value
   * @param name attribute's name
   */
  public abstract get(name: string): any;

  /**
   * set attribute value
   * @param name attribute's name
   * @param value attribute value
   */
  public abstract set(name: string, value: any): void;

  /**
   * get attributes of component
   */
  public abstract getAttributes(): any;

  /**
   * set attributes of component
   * @param attrs 
   */
  public abstract setAttributes(attrs: any, options: any | null): void;

  /**
   * get collection container of component
   */
  public abstract getMoContainers(): any;

  /**
   * Replace a component with another one
   * @param {String|Component} el Component or HTML string
   * @return {Component|Array<Component>} New added component/s
   * @example
   * component.replaceWith('<div>Some new content</div>');
   * // -> Component
   */
  public abstract replaceWith(el: String | DomComponent): any;

  /**
   * Get the parent component, if exists
   * @return {DomComponent}
   * @example
   * component.parent();
   * // -> Component
   */
  public abstract parent(): DomComponent;

  /**
   * get level of component
   */
  public abstract getLevel(): number;

  /**
   * Return string Html of component
   */
  public abstract toHTML(): string;

  /**
   * remove component
   */
  public abstract remove(): any;

  /**
   * remove class of component
   * @param className 
   */
  public abstract removeClass(className: string): any;

  /**
   * delete style inline
   */
  public abstract deleteInlineStyle(): void;

  /**
   * Add new component children
   * @param  {DomComponent|String} comps Component to add
   * @param {Object} [opts={}] Options, same as in `model.add()`(from backbone)
   * @return {Array} Array of appended components
   * @example
   * someComponent.get('components').length // -> 0
   * const videoComponent = someComponent.append('<video></video><div></div>')[0];
   * // This will add 2 components (`video` and `div`) to your `someComponent`
   * someComponent.get('components').length // -> 2
   * // You can pass components directly
   * otherComponent.append(otherComponent2);
   * otherComponent.append([otherComponent3, otherComponent4]);
   */
  public abstract append(comps: DomComponent | string, opts: any) : DomComponent[];

  /**
   * check if component has a class
   * @param className 
   */
  public abstract hasClass(className: string): boolean;

  /**
   * return index of component
   */
  public abstract getIndex(): number;

}

/**
 * abstract class CssComposer
 */
abstract class CssComposer {
  /**
   * Get the CSS rule by selector
   * @param {string} name selector name, eg. 'my-class', 'my-id', ..
   * @param  {RuleOptions} [opts={}]  RuleOptions, like `state` and `mediaText`
   * @return {Rule}
   * @example
   * const rule = cc.getRule('myclass');
   * const ruleHover = cc.getRule('myclass', { state: 'hover' });
   */
  public abstract getRule(name: string, opts: RuleOptions | undefined ): CssRule;

  /**
   * Add/update the CSS rule with selector
   * @param {string} name Object selector name, eg. 'my-id'
   * @param {Object} style  Style properties and values
   * @param {RuleOptions} [opts={}]  RuleOptions, like `state` and `mediaText`
   * @return {CssRule} The new/updated rule
   * @example
   * const rule = cc.setRule('myid', { color: 'red' });
   * const ruleHover = cc.setRule('myid', { color: 'blue' }, { state: 'hover' });
   * // This will add current CSS:
   * // #myid { color: red }
   * // #myid:hover { color: blue }
   */
  public abstract setRule(name: string, style: any, opts: RuleOptions) : void;

  /**
   * get all rules
   */
  public abstract getAll(): any;

  /**
   * find list css rule with start name
   * @param name 
   * @param options 
   * @return {CssRule[]}
   */
  public abstract findByStartsWith(name: string, options:RuleOptions): CssRule[];

  /**
   * find list css rule by name
   * @param name 
   * @param options 
   * @return {CssRule[]}
   */
  public abstract findByName(name: string, options:RuleOptions): CssRule[];

  /**
   * remove cssRule
   * @param rule 
   */
  public abstract removeRule(rule: CssRule): void;
}

/**
 * Css Rule Abstract
 */
abstract class CssRule {
  // Css selectors
  private selectors: any;

  // Additional string css selectors
  private selectorsAdd: string;

  // Css properties style
  private style: any;

  // On which device width this rule should be rendered, eg. @media (max-width: 1000px)
  private mediaText: string;

  // State of the rule, eg: hover | pressed | focused
  private state: string;

  // Indicates if the rule is stylable
  private stylable: boolean;

  // Type of at-rule, eg. 'media', 'font-face', etc.
  private atRuleType: string;

  // This particolar property is used only on at-rules, like 'page' or
  // 'font-face', where the block containes only style declarations
  // singleAtRule: 0,

  // If true, sets '!important' on all properties
  // You can use an array to specify properties to set important
  // Used in view
  private important: number;
  
  /**
   * get attribute by name
   * @param name 
   * example get('style') -> style
   */
  public abstract get(name: string): any;

  /**
   * set attribute value
   * @param name attribute's name
   * @param value attribute's value
   */
  public abstract set(name: string, value: any): void;

  /**
   * Return selectors fo the rule as a string
   * @return {string}
   */
  public abstract selectorsToString(): string;

  /**
   * Returns CSS string of the rule
   * @param {Object} [opts={}] Options
   * @return {string}
   */
  public abstract toCSS(opts: any): string;

  /**
   * get style of rule
   */
  public abstract getStyle(): any;

  /**
   * set style of rule
   */
  public abstract setStyle(styles: any, options: any): void;


}

abstract class Parser {
  /**
     * Parse HTML string and return valid model
     * @param  {string} str HTML string
     * @return {Object}
     */
  public abstract parseHtml(str: string): any;

  /**
   * Parse CSS string and return valid model
   * @param  {string} str CSS string
   * @return {Array<Object>}
   */
  public abstract parseCss(str: string): any[];
}

export {
  MoWbEditorWrapper,
  SelectorType,
  GLOBAL,
  DomComponent,
  RuleOptions,
  CssComposer,
  CssRule,
  ICss
}

