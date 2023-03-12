import {
  Component, ViewChild, ElementRef, ChangeDetectionStrategy, Input, Output, EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ColorPickerModal } from '../../common/common-types';
import { MoWbBaseComponent } from '../../components/base.component';
import { MoWbColorComponent } from '../../components/color/color.component';
import { DomComponent, GLOBAL, MoWbEditorWrapper } from './editor-wrapper';
import { UnitUtil } from 'src/app/utils/unitUtil';
import { GridLayoutUtil } from 'src/app/utils/gridLayoutUtil';
import { DockUtil } from 'src/app/utils/dockUtil';
import { NearestUtil } from 'src/app/utils/nearestUtil';
import { CompUtil } from 'src/app/utils/compUtil';
import { EditorConstants } from './constants';
import { ContentBuilderEditor } from 'src/app/utils/builder/contentBuilder';
import { IMediaBreakPoint } from './root.service';
import { BreakPointUtils } from 'src/app/utils/breakPointUtils';
import { FontUtils } from 'src/app/utils/fontUtils';

declare var moWbjs: any;

@Component({
  selector: 'mo-wb-landing-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorComponent extends MoWbBaseComponent {
  loading: boolean = true;
  editor: any;
  inspectorOpen: boolean = false;
  menuOpen: boolean = false;
  canvasWidth: number = 1272;
  canvasStartedWidth: number = 0;
  contentWidth: string = 'auto';
  mediaScreenWidth: number = 0;
  pageId: string;
  breakPoint: IMediaBreakPoint;

  //tientd
  isShow: boolean = false;
  zIndex: number = 5000;
  @Input() pageItem: any;
  @Input() modalHeight: string = '';
  @Output() onClose = new EventEmitter<any>();



  @ViewChild('wrapperEl') wrapperElRef: ElementRef;
  @ViewChild('canvasEl') canvasRef : ElementRef;
  
  override ngOnInit() {
  }

  override async ngAfterViewInit() {
    
    GLOBAL.canvasEl = this.canvasRef.nativeElement;
    $(GLOBAL.canvasEl).on(EditorConstants.SELECTED_PAGE_CHANGED_EVENT, this.handleOnSelectedPageChanged);
    $(GLOBAL.canvasEl).on(EditorConstants.BREAK_POINT_SELECTED_CHANGED_EVENT, this.handleOnSelectedBreakPointChanged);
    $(GLOBAL.canvasEl).on(EditorConstants.BREAK_POINTS_CHANGED_EVENT, this.handleOnBreakPointsChanged);

    // load all data
    await this.loadData();
    // init color picker
    this.initColorPicker();
    // init editor
    this.initEditor();
  }

  override ngOnDestroy() { 
    this.editor.off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    this.editor.off(EditorConstants.SELECTED_PAGE_CHANGED_EVENT, this.handleOnSelectedPageChanged);
  }

  /**
   * load data
   */
  async loadData() {
    await this._rootService.loadAllFont();
  }

  /**
   * init editor
   */
  initEditor() {
    console.log('initEditor');
    let config: any = {
      container: '#editor',
      height: '100%',
      blocks: new Array(),
      fonts: new Array(),
      messageTags: undefined,
      externalCssLink: [],
      externalJavascriptLink:[
        'https://npmcdn.com/flickity@2/dist/flickity.pkgd.js',
      ]
    };

    this.editor = moWbjs.init(config);
    // init page
    GLOBAL.landingPage = this._cacheService.get(EditorConstants.LANDING_PAGE_INFO) || this._rootService.initDefaultLandingPage();
    console.log('landingPage=', GLOBAL.landingPage);
    // get selected page
    const selectedPage = GLOBAL.landingPage.pages.find(page => {
      return page.isSelected ? true : false;
    });
    // get content full html page
    const content =  this._rootService.getFullHtmlPage(selectedPage, GLOBAL.landingPage.theme); 
    this.editor.runCommand('update-content', { content: content, tracking: [] });

    // init utils components
    GLOBAL.editor = new MoWbEditorWrapper(this.editor);
    GLOBAL.unit = new UnitUtil();
    GLOBAL.grid = new GridLayoutUtil();
    GLOBAL.dock = new DockUtil();
    GLOBAL.nearestUtil = new NearestUtil();
    GLOBAL.compUtil = new CompUtil();
    GLOBAL.builder = new ContentBuilderEditor();
    

    // handle editor events
    this.editor.on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    
    
    // this.initEvents();
    FontUtils.buildIframeFontLink() ;
    // get root font
    FontUtils.getAllRootFonts();
    
    this.pageId = selectedPage.id;
    
    this.breakPoint = BreakPointUtils.resetSelectedBreakPoint();
    this.setCanvasWidthByBreakpoint(this.breakPoint);
    
    this.loading = false;
    this.detectChanges();

    setTimeout(() => {
      console.log('BREAK_POINTS_PAGE_CHANGED_EVENT');
      $(GLOBAL.canvasEl).trigger(EditorConstants.BREAK_POINTS_PAGE_CHANGED_EVENT);
    }, 50);
  }
  
  /**
   * change iframe width
   * @param width 
   */
  changeIframeDeviceWidth(width: string) {
    this.editor.getModel().trigger('change:device', width);
  }

  /**
   * init color picker
   */
  initColorPicker() {
    if (!ColorPickerModal.Instance) {
      const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbColorComponent).create(this._injector);
      modalRef.instance.zIndex = 5000;
      modalRef.instance.onClose.subscribe((event: any) => { });
      this._domService.addDomToBody(modalRef);
      ColorPickerModal.Instance = modalRef.instance;
      ColorPickerModal.Modal = modalRef;
    }
  }

  /**
   * set canvas width by breakpoint
   * @param breakPoint 
   */
  setCanvasWidthByBreakpoint(breakPoint: IMediaBreakPoint) {
    this.canvasWidth = BreakPointUtils.getIframeWidth(breakPoint) + 36*2;
    this.mediaScreenWidth = breakPoint.max;
  }

  show() {
    this.isShow = true;
    this._changeDetection.detectChanges();
  }

  hide() {
    this.isShow = false;
    this._changeDetection.detectChanges();
  }

  close() {
    this.hide();
    this.onClose.emit();
  }


  /**
   * handle canvas width change
   */
  handleCanvasWidthChanged() {
    const iframeWidth = this.canvasWidth - 72;
    const breakPoint = BreakPointUtils.getBreakPointByIFrameWidth(iframeWidth);
    // console.log('breakPoint = ', breakPoint);
    this.changeIframeDeviceWidth(`100%`);
    // update media screen width
    this.mediaScreenWidth = breakPoint.max;

    if (this.breakPoint.id !== breakPoint.id) {
      this.breakPoint = breakPoint;
      BreakPointUtils.updateSelectedBreakPoint(breakPoint);
    }
    $(GLOBAL.canvasEl).trigger(EditorConstants.IFRAME_WIDTH_CHANGED_EVENT,[breakPoint, iframeWidth]);
    this.detectChanges();
  }

  /**
   * handle drag left started move
   */
  handleOnDragLeftStarted() {
    this.canvasStartedWidth = this.canvasWidth;
    GLOBAL.editor.getCanvas().handleResizeStarted();
    GLOBAL.editor.setBlockMoved(true);
    GLOBAL.editor.removeSelect();
  }

  /**
   * handle drag left moving
   * @param offsetLeft 
   */
  handleOnDragLeftMoving(offsetLeft: number) {
    this.canvasWidth = Math.max(320 + 72, this.canvasStartedWidth - offsetLeft*2);
    this.handleCanvasWidthChanged();
  }

  /**
   * handle start right move started 
   */
  handleOnDragRightStarted() {
    this.canvasStartedWidth = this.canvasWidth;
    GLOBAL.editor.getCanvas().handleResizeStarted();
    GLOBAL.editor.setBlockMoved(true);
    GLOBAL.editor.removeSelect();
  }
  /**
   * handle drag right move
   * @param offsetLeft 
   */
  handleOnDragRightMoving(offsetLeft: number) {
    this.canvasWidth = Math.max(320 + 72, this.canvasStartedWidth + offsetLeft*2);
    this.handleCanvasWidthChanged();
  }

  /**
   * handle drag end
   */
  handleOnDragEnd() {
    const iframeWidth: string = BreakPointUtils.getIframeStyleWidth(this.breakPoint, this.canvasWidth);
    this.changeIframeDeviceWidth(iframeWidth);

    setTimeout(() => {
      GLOBAL.editor.setBlockMoved(false);
    }, 150);
  }

  /**
   * handle inspector open toggle
   * @param isInspectorOpen 
   */
  handleOnInspectorToggle(isInspectorOpen: boolean) {
    this.inspectorOpen = isInspectorOpen;
    this.detectChanges();
  }

  //tientd
  handleOnBack(event: any){
    this.close();
  }
  /**
   * handle Component toggle
   * @param comp 
   */
  handleOnCompToggled = (comp: DomComponent) => {
    $(GLOBAL.canvasEl).trigger(EditorConstants.COMP_TOGGLED_EVENT, comp);
    if (!comp) {
      return;
    }
    const selectedComp = GLOBAL.editor.getSelected();
    // remove data preview attr
    if (!selectedComp) {
      const attrs = comp.getAttributes();
      if (attrs['data-preview']) {
        attrs['data-preview'] = "regular";
        comp.setAttributes(attrs, {});
      }
      return;
    }
  }

  /**
   * handle on canvas scroll
   * @param event 
   */
  handleOnCanvasScroll = (event: any) => {
    GLOBAL.editor.getModel().trigger(EditorConstants.CANVAS_SCROLL_EVENT);
  }

  /**
   * handle on selected page changed
   */
  handleOnSelectedPageChanged = () => {
    this.pageId = null;
    this.detectChanges();
    this.initEditor();
  }

  /**
   * handle on selected breakpoint changed
   * @param breakPoint 
   */
  handleOnSelectedBreakPointChanged = (event: any, breakPoint: IMediaBreakPoint) => {
    GLOBAL.editor.getCanvas().handleResizeStarted();
    this.breakPoint = breakPoint;

    this.setCanvasWidthByBreakpoint(this.breakPoint);
    const iframeWidth: string = BreakPointUtils.getIframeStyleWidth(breakPoint, this.canvasWidth);
    this.changeIframeDeviceWidth(iframeWidth);
    this.detectChanges();

    // remove select
    GLOBAL.editor.removeSelect();
  }

  /**
   * handle on break points changed
   * @param breakPoints 
   */
  handleOnBreakPointsChanged = (event: any, breakPoints: IMediaBreakPoint[]) => {
    GLOBAL.editor.getCanvas().handleResizeStarted();
    this.breakPoint = BreakPointUtils.getSelectedBreakPoint();
    this.setCanvasWidthByBreakpoint(this.breakPoint);
    const iframeWidth: string = BreakPointUtils.getIframeStyleWidth(this.breakPoint, this.canvasWidth);
    this.changeIframeDeviceWidth(iframeWidth);
    this.detectChanges();
  }

}
