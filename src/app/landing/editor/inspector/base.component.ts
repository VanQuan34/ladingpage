import { Component, OnInit, ChangeDetectorRef, ViewRef, ViewChildren, 
  QueryList, Input, Injector, ComponentFactoryResolver } from '@angular/core';
import { MoWbDetectionComponent } from '../../../components/detection.component';
import { MoWbInputComponent } from '../../../components/input/input.component';
import { MoWbInputNumberComponent } from '../../../components/input/number/input-number.component';
import { AddComponentToBodyService } from '../../../api/common/add-component-to-body.service';
import { MoBlocksService } from '../blocks/blocks.service';
import { Utils } from '../../../utils/utils';
import { MoRootManagerService } from '../root.service';
import { GLOBAL, DomComponent, RuleOptions } from '../editor-wrapper';
import { IDockingPos } from 'src/app/utils/dockUtil';
import { EditorConstants } from '../constants';
import { uid } from 'uid';
import { BreakPointUtils } from 'src/app/utils/breakPointUtils';

interface ICompState {
  id: 'REGULAR' | 'HOVER' | 'CLICKED';
  name: string;
}

@Component({
  template: "<div></div>",
})
export class MoLandingEditorInspectorBaseComponent extends MoWbDetectionComponent {
  
  moType: string = '';
  loading: boolean = false;
  width: number = 0;
  height: number = 0;
  selectedComp: DomComponent;
  $target: any;
  $el: any;
  id: string;
  styleId: string;
  formId: string;
  targetComp: DomComponent;
  $targetEls: any; 
  
  stateList: ICompState[] = [];
  stateComps: DomComponent[];

  @Input() state: 'REGULAR' | 'HOVER' | 'CLICKED' | string = 'REGULAR';
  @Input() selectorId: string;
  @Input() fixSelectorId: string;
  @Input() isImportant: boolean;
  @Input() selectorAdd: string;
  @Input() selectorAddMore: string[] = [];
  @Input() label: string;
  @Input() classInclude: string = '';
  @Input() isShow: boolean;
  @Input() modelType: 'text' | 'image' | 'button' | 'form' | 'section';
  @Input() isEnable: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() fixSelectedModel: any;
  @Input() stateAdd: string;
  @Input() toggleState: 'ON' | 'OFF' = 'OFF';
  @Input() selectorAddRegular: string = '';
  @Input() title: string;
  @Input() selectorAddState: string = '';
  @Input() selectorAddHover: string = '[data-preview="hover"]';
  @Input() selectorAddClicked: string = '[data-preview="clicked"]';

  @ViewChildren('input') inputRefs: QueryList<MoWbInputComponent>;
  @ViewChildren('inputNumber') inputNumberRefs: QueryList<MoWbInputNumberComponent>;

  constructor(
    public override _changeDetection: ChangeDetectorRef,
    public _blockService: MoBlocksService,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _componentFactoryResolver: ComponentFactoryResolver,
    public _rootService: MoRootManagerService) {
    super(_changeDetection);

    this.stateList = [
      {
        id: 'REGULAR',
        name: 'Bình thường',
      },
      {
        id: 'HOVER',
        name: 'Di chuột',
      },
      {
        id: 'CLICKED',
        name: 'Đã chọn',
      },
    ];
  }

  override ngOnInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
    this.onInit();
  }

  onInit() {

  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.setValue();
    }, 0);
    this.onAfterViewInit();
  }

  onAfterViewInit(){

  }

  override ngOnDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
    this.onDestroy();
  }

  onDestroy() {

  }

  setValue() {
    // console.log('base comp setValue ');
    this.selectedComp = this.getSelectedComp();
    
    if (!this.selectedComp) {
      return;
    }
    const attrs = this.selectedComp.getAttributes();
    this.id = `#${this.selectedComp.getId()}`;
    this.styleId = GLOBAL.compUtil.getStyleCompId(this.selectedComp);
    const selectorAdd = this.selectorAdd || attrs['selector-add'];
    //this.styleId = selectorAdd ? `${this.styleId}${selectorAdd}` : `${this.styleId}`;
    this.selectorId = this.fixSelectorId || (selectorAdd ? `${this.id}${selectorAdd}` : `${this.id}`);
    this.targetComp = this.selectedComp;
    
    this.$targetEls = GLOBAL.editor.getWrapper().view.$el.find(this.selectorId);
    // get state component
    const stateId = `${this.id}${this.selectorAddState}`;
    this.stateComps = GLOBAL.editor.getWrapper().find(stateId);
    // console.log('targetEls=', this.$targetEls);
    this.detectChanges();
  }

  resetInputs() {
    if (this.inputRefs && this.inputRefs.toArray().length) {
      this.inputRefs.toArray().forEach(input => {
        input.reset();
      })
    }
  }

  blurInput() {
    if (!this.inputNumberRefs || !this.inputNumberRefs.toArray().length) {
      return;
    }
    this.inputNumberRefs.toArray().forEach(input => {
      input.blur();
    })
  }

  getSelectedComp() {
    const selectedComp = this.fixSelectedModel || GLOBAL.editor.getSelected();
    return selectedComp;
  }

  getRuleOption(selectorId: string = undefined): RuleOptions {
    let selectorAdd;
    if (this.selectorAdd || this.selectedComp) {
      selectorAdd = this.selectorAdd || this.selectedComp.getAttributes()['selector-add'];
    }
    const id = this.selectorId || (this.fixSelectorId || (selectorAdd ? `${this.id} ${selectorAdd}` : `${this.id}`));
    const opts: RuleOptions = { id: this.stateAdd ? `${id}:${this.stateAdd}`: id};
    opts.mediaText = BreakPointUtils.getMediaText(BreakPointUtils.getSelectedBreakPoint());
    // if (this.state) {
    //   opts.state = this.state;
    // }
    return opts;
  }

  getRuleStyles() {
    // const cc = this.editor.CssComposer;
    const opts: any = {type: 2};
    opts.mediaText =  BreakPointUtils.getMediaText(BreakPointUtils.getSelectedBreakPoint());
    // if (this.state) {
    //   opts.state = this.state;
    // }
    const ruleStyle = GLOBAL.editor.getRule(this.getStyleSelectorId(), opts);
    const styles = ruleStyle && ruleStyle.get('style');
    return styles;
  }

  getStyleSelectorId(selectorAdd: string = '-1') {
    let selectorId = '';
    if (selectorAdd === '-1') {
      return this.styleId;
    }
    selectorId =`${this.styleId}${selectorAdd || this.selectorAdd || ''}`;
    // console.log('selectorId=', selectorId, 'styleId=', this.styleId, ' selectorAdd=', selectorAdd);
    return selectorId;
  }
  
  /**
   * get style
   * @param selectorAdd 
   * @param opts 
   * @returns 
   */
  getStyle(selectorAdd: string = null, opts: any = {}) {
    const _opts = { ...this.getRuleOption(), ...opts };

    const selectorId = this.getStyleSelectorId(selectorAdd);
    let styles = GLOBAL.editor.getStyles(selectorId, _opts);
    return styles;
  }

  /**
   * set styles
   * @param properties 
   * @param deleteProperties 
   * @param selectorAdd 
   */
  setStyles(properties: { value: any, property: string }[], deleteProperties?: string[], selectorAdd: string = null) {
    const opts: RuleOptions = {};
    opts.onlyMedia = true;
    const selectorId = this.getStyleSelectorId(selectorAdd);
    const styles = GLOBAL.editor.getStyles(selectorId, opts);
    if (deleteProperties && deleteProperties.length) {
      for (let i = 0; i < deleteProperties.length; i++) {
        delete styles[deleteProperties[i]];
      }
    }

    for (let i = 0; i < properties.length; i++) {
      styles[properties[i].property] = `${properties[i].value}${this.isImportant ? ' !important' : ''}`;
    }
    
    GLOBAL.editor.setStyles(selectorId, styles, opts);
  }

  /**
   * set style
   * @param value 
   * @param property 
   * @param selectorAdd 
   */
  setStyle(value: any, property: string, selectorAdd: string = '') {
    const opts: RuleOptions = {};
    opts.onlyMedia = true;
    const selectorId = this.getStyleSelectorId(selectorAdd);
    // console.log('setStyle selectorId=', selectorId, opts, this.selectorId);
    const styles = GLOBAL.editor.getStyles(selectorId, opts);
    styles[property] = `${value} ${this.isImportant ? '!important' : ''}`;
    
    GLOBAL.editor.setStyles(selectorId, styles, opts);
  }

  setAttr(value: any, property: string) {
    if (!this.selectedComp) {
      return;
    }
    const attrs = this.selectedComp.getAttributes();
    attrs[property] = value;
    this.selectedComp.setAttributes(attrs, {});
  }

  setAttrs(addProperties: { value: any, property: string }[], deleteProperties?: string[]) {
    const attrs = this.selectedComp.getAttributes();
    for (let i = 0; i < addProperties.length; i++) {
      attrs[addProperties[i].property] = addProperties[i].value;
    }

    if (deleteProperties && deleteProperties.length) {
      for (let i = 0; i < deleteProperties.length; i++) {
        delete attrs[deleteProperties[i]];
      }
    }

    this.selectedComp.setAttributes(attrs, {});
  }

  /**
   * update docking pos
   */
  updateDockingPosInfo() {
    const dockingPos: IDockingPos = GLOBAL.dock.getAutoDockingPos(this.selectedComp);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT, dockingPos);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_DOCKING_CHANGED_EVENT, dockingPos);
  }

  /**
   * delete inline style
   */
  deleteInlineStyle() {
    this.$targetEls.removeAttr('style');
  }

  handleOnCompToggled = (comp: any) => {
    // console.log('handleOnCompToggled base comp toggle=', comp, ' selectedComp=', selectedComp);
    if (!comp) {
      return;
    }
    const selectedComp = GLOBAL.editor.getSelected();
    if (!selectedComp) {
      return;
    }
    this.setValue();
    this.blurInput();
  }

  handleOnCompUndo = () => {
    // this.setValue();
  }

  handleOnCompRedo = () => {
    // this.setValue();
  }

  /**
   * Duplicate Item for id
   */
  handleDuplicateItem(idSelected: string, selectorWrapper: string, selectorItem: string){
    const firstId = this.selectedComp.find(`${selectorItem}:first-child`)[0].getId();
    const id = (idSelected !== null) ? idSelected : firstId;
    const newId = `${id.split('__')[0]}__${uid()}`;
    const html = this.selectedComp.find(`#${id}`)[0].view.el.outerHTML;
    const newHtml = html.replace(id, newId);

    this.selectedComp.find(selectorWrapper)[0].append(newHtml, {});
    this.selectedComp.find(`${selectorItem}:not(#${idSelected})`).forEach((item: any) => {
      item.view.$el.removeAttr('style');
    });
    this.detectChanges();
    this.updateDockingPosInfo();
  }
  /**
   * Sort html by id
   * @param ids  Array
   * @param selectorWrapper 
   * @param selectorItem 
   */
  handleSortHtml(ids:Array<string>,  selectorWrapper: string, selectorItem: string) {
    const containerSelector = this.selectedComp.find(selectorWrapper)[0].view.el;
    const elements = Array.from(containerSelector.querySelectorAll(selectorItem));
    const sortedElements = ids.map(id => elements.find(e => e.id === id));
    sortedElements.forEach(ele => {
      containerSelector.appendChild(ele);
    });
  }
  
  /**
   * Sort html by array index
   * @param ArrIndex 
   * @param selectorWrapper 
   * @param selectorItem 
   */
  handleSortHtmlByIndex(ArrIndex: Array<number>, selectorWrapper: string, selectorItem: string){
    const container = this.selectedComp.find(selectorWrapper).length !== 0 ? this.selectedComp.find(selectorWrapper)[0].view.el : this.selectedComp.view.el;
    const elements = container.querySelectorAll(selectorItem);
    // Convert the NodeList to an array
    const elementsArray = Array.from(elements);
    // Sort the array based on the given index from oldArr
    const sortedElements = ArrIndex.map(index => elementsArray[index]);
    // Append the sorted elements to the container
    sortedElements.forEach(element => {
      container.appendChild(element);
    });
  }

  /**
   * handle on state comp changed
   * @param stateItem 
   * @returns 
   */
  handleOnSelectState(stateItem: any) {
    this.state = stateItem.id;
    this.detectChanges();
    if (!this.stateComps.length) {
      return;
    }
    this.stateComps.forEach(comp => {
      const attrs = comp.getAttributes();
      switch(this.state) {
        case 'REGULAR':
          attrs['data-preview'] = 'regular';
          break;
        case 'HOVER':
          attrs['data-preview'] = 'hover';
          break;
        case 'CLICKED':
          attrs['data-preview'] = 'clicked';
          break;
        default:
          break;
      }
      comp.setAttributes(attrs,{});
    });
  }
}
