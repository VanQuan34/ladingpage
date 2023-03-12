import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../components/detection.component';
import {CacheService } from '../../../api/common/cache.service';
import { ToastTranslateService } from '../../../api/common/toast-translate.service';
import { MoLandingEditorToolbarDeviceComponent } from './center/device/device.component';
import { DomComponent, GLOBAL } from '../editor-wrapper';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { EditorConstants } from '../constants';
import { ILandingPage, IMediaBreakPoint, IPage } from '../root.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'mo-wb-landing-editor-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorToolbarComponent extends MoWbDetectionComponent {
  
  inspectorOpen: boolean = false;
  isFirstInspect: boolean = true;
  buttonLeft: string = ''; 
  isPreviewShow: boolean = false;
  landingPage: ILandingPage;

  // undo
  // undoManager: any;
  isUndo: boolean;
  isRedo: boolean;
  updateUndoStateInterval: any;

  saving: boolean = false;
  
  @Input() isLoaded: boolean = false;
  @Input() classInclude: string = '';
  // @Input() mediaBreakPoints: IMediaBreakPoint[];

  @Output() onInspectorToggle = new EventEmitter<boolean>();
  @Output() onBreakPointChanged = new EventEmitter<IMediaBreakPoint>();
  @Output() onDeviceWidthChanged = new EventEmitter<number>();

  @ViewChild('device') deviceRef: MoLandingEditorToolbarDeviceComponent;

  constructor( 
    public override _changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    private _cacheService: CacheService,
    
    //tientd
    private _domService: AddComponentToBodyService,
    public componentFactoryResolver: ComponentFactoryResolver,
    public _injector: Injector,
    ) 
    {
    super(_changeDetection);
  }

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    $(GLOBAL.canvasEl).on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    $(GLOBAL.canvasEl).on(EditorConstants.OPEN_ADD_NEW_ELEMENT_EVENT, this.handleOnOpenAddNew);
    $(GLOBAL.canvasEl).on(EditorConstants.OPEN_PAGE_MANAGER_EVENT, this.handleOnPageManagerOpen);

    this.updateUndoStateInterval = setInterval(() => {
      const isUndo = this.isUndo;
      this.isUndo = this.isUndoAvailable();
      this.isRedo = this.isRedoAvailable();

      if (isUndo && !this.isUndo) {
        const selectedComp = GLOBAL.editor.getSelected();
        if (!selectedComp) {
          this.inspectorOpen = false;
          // GLOBAL.editor.hideCanvasSelectedComp();
          this.onInspectorToggle.emit(this.inspectorOpen);
          GLOBAL.editor.getModel().trigger('comp:none-selected');
        }
      };
      this.detectChanges();
    }, 250);
    
    this.detectChanges();
  }

  override ngOnDestroy() { 
    $(GLOBAL.canvasEl).off(EditorConstants.OPEN_ADD_NEW_ELEMENT_EVENT, this.handleOnOpenAddNew);
    $(GLOBAL.canvasEl).off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    $(GLOBAL.canvasEl).off(EditorConstants.OPEN_PAGE_MANAGER_EVENT, this.handleOnPageManagerOpen);

    clearInterval(this.updateUndoStateInterval);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  isUndoAvailable() {
    return GLOBAL.editor.isUndoAvailable();
  }

  isRedoAvailable() {
    return GLOBAL.editor.isRedoAvailable();
  }

  closeMenu() {
    this.buttonLeft = '';
    this.detectChanges();
  }

  /**
   * save template
   */
  saveTemplate() {
    const selectedPage = GLOBAL.landingPage.pages.find(page => {
      return page.isSelected ? true : false;
    })
    GLOBAL.builder.buildEditorContent(selectedPage);
    this._cacheService.set(EditorConstants.LANDING_PAGE_INFO, GLOBAL.landingPage, CacheService.CACHE_EXPIRE_NONE);
    this.saving = false;
    this._toast.show('success', 'i18n_notification_manipulation_success');
    this.detectChanges();
  }

  /**
   * handle undo click
   * @param e 
   */
  handleOnUndoClick = (e: any) => {
    e.stopPropagation();
    GLOBAL.editor.getUndoManager().undo(1);
    GLOBAL.editor.getModel().trigger('comp:undo');
  }

  /**
   * handle redo click
   * @param e 
   */
  handleOnRedoClick = (e: any) => {
    e.stopPropagation();
    GLOBAL.editor.getUndoManager().redo(1);
    GLOBAL.editor.getModel().trigger('comp:redo');
  }
  
  /**
   * handle inspector button click
   * @param e 
   */
   handleOnInspectorButtonClick(e: any) {
    this.inspectorOpen = !this.inspectorOpen;
    this.onInspectorToggle.emit(this.inspectorOpen);
    this.detectChanges();
  }

  /**
   * handle component selected changed
   * @param comp 
   */
  handleOnCompToggled = (event: any, comp: DomComponent) => {
    if (!comp) {
      return;
    }
    const selectedComp = GLOBAL.editor.getSelected();
    if (this.isFirstInspect) {
      this.inspectorOpen = selectedComp ? true : false;
      this.isFirstInspect = false;
    }
    // close left menu when select component
    setTimeout(() => {
      const selectedComp = GLOBAL.editor.getSelected();
      if (selectedComp) {
        this.buttonLeft = '';
        this.detectChanges();
      }
    }, 50);

    this.onInspectorToggle.emit(this.inspectorOpen);
    this.detectChanges();
  }
  /**
   * handle save template click
   * @param event 
   */
  handleOnSaveTemplate = (event: any) => {
    this.saving = true;
    setTimeout(() => {
      this.saveTemplate();
    }, 150);
  }

  /**
   * handle on icon left click
   * @param e 
   * @param id 
   */
  handleOnIconLeftClick = (e: any, id: string) => {
    this.buttonLeft = this.buttonLeft === id ? '' : id;
    const selectedComp = GLOBAL.editor.getSelected();
    if(!selectedComp || selectedComp.getAttributes()['mo-type'] === 'tabs') return;
    if (this.buttonLeft) {
      setTimeout(() => {
        GLOBAL.editor.removeSelect();
      }, 50);
    }
    this.detectChanges();
  }

  /**
   * handle on menu close
   */
  handleOnMenuClose = () => {
    this.buttonLeft = '';
    this.detectChanges();
  }

  /**
   * handle on add new open
   */
  handleOnOpenAddNew = () => {
    this.buttonLeft = 'addNew';
    this.detectChanges();
  }

  /**
   * handle on page manager open
   */
  handleOnPageManagerOpen = () => {
    this.buttonLeft = 'pages';
    this.detectChanges();
  }

  /**
   * handle on preview button click
   * @param event 
   */
  handleOnPreviewButtonClick = (event: MouseEvent) => {
    this.isPreviewShow = true;
    this.landingPage = Utils.copyObject(GLOBAL.landingPage);
    this.detectChanges();
  }

  /**
   * handle on preview close
   */
  handleOnPreviewClose = () => {
    this.isPreviewShow = false;
    this.detectChanges();
  } 
}
