import {
  Component, Input, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { IGridInfo } from 'src/app/utils/gridLayoutUtil';
import { MoWbDetectionComponent } from '../../../../components/detection.component';
import { EditorConstants } from '../../constants';
import { DomComponent, GLOBAL } from '../../editor-wrapper';


@Component({
  selector: 'mo-wb-landing-editor-layer-grid_layout',
  templateUrl: './grid_layout.component.html',
  styleUrls: ['./grid_layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerGridLayoutComponent extends MoWbDetectionComponent {
  
  selectedComp: DomComponent;
  grids: IGridInfo[] = [];
  canvasRect: any;

  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;
  
  override ngOnInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_GRID_UPDATE_POS_EVENT, this.handleOnGridUpdatePos);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_GRID_REPLACE_CONTAINER_EVENT, this.handleOnGridReplaceContainer);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_SCROLL_EVENT, this.handleOnCanvasScroll);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_RESIZE_STARTED_EVENT, this.handleOnCanvasResizeStarted);
    GLOBAL.editor.getEditor().on(EditorConstants.CANVAS_RESIZE_ENDED_EVENT, this.handleOnCanvasResizeEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_STARTED_EVENT, this.handleOnCompResizeStarted);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnCompResizeEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_NONE_SELECTED_EVENT, this.handleOnCompNoneSelected);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVE_STATED_EVENT, this.handleOnCompMoveStarted);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVE_ENDED_EVENT, this.handleOnCompMoveEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMovingEnded);
    GLOBAL.editor.getEditor().on(EditorConstants.GRID_LAYOUT_CHANGED_EVENT, this.handleOnGridLayoutChanged);

    window.addEventListener('resize', this.handleOnWindowResize);
    GLOBAL.editor.getIframeWin().addEventListener('scroll', this.handleIframeScroll);
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.selectedComp =  GLOBAL.editor.getSelected();
    }, 0);
    this.canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
  } 

  override ngOnDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_GRID_UPDATE_POS_EVENT, this.handleOnGridUpdatePos);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_GRID_REPLACE_CONTAINER_EVENT, this.handleOnGridReplaceContainer);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_SCROLL_EVENT, this.handleOnCanvasScroll);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_RESIZE_STARTED_EVENT, this.handleOnCanvasResizeStarted);
    GLOBAL.editor.getEditor().off(EditorConstants.CANVAS_RESIZE_ENDED_EVENT, this.handleOnCanvasResizeEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_STARTED_EVENT, this.handleOnCompResizeStarted);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_RESIZE_ENDED_EVENT, this.handleOnCompResizeEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_NONE_SELECTED_EVENT, this.handleOnCompNoneSelected);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_UNDO_EVENT, this.handleOnCompUndo);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_REDO_EVENT, this.handleOnCompRedo);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVE_STATED_EVENT, this.handleOnCompMoveStarted);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVE_ENDED_EVENT, this.handleOnCompMoveEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMovingEnded);
    GLOBAL.editor.getEditor().off(EditorConstants.GRID_LAYOUT_CHANGED_EVENT, this.handleOnGridLayoutChanged);

    GLOBAL.editor.getIframeWin().removeEventListener('scroll', this.handleIframeScroll);
    window.removeEventListener('resize', this.handleOnWindowResize);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * set gridInfo
   */
  setGridInfo = () => {
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      this.isOpen = false;
      this.grids = [];
      this.detectChanges();
    }
    this.canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
    this.grids = [];
    this.isOpen = true;
    const compContainer = GLOBAL.compUtil.getContainer(this.selectedComp);
    const comps: DomComponent[] = [compContainer, this.selectedComp];
    comps.forEach(comp => {
      const gridInfo = GLOBAL.grid.getGridInfo(comp);
      // console.log('gridInfo=', gridInfo);
      if (comp && gridInfo) {
        comp.set('grid-info', this.convertGridInfo(gridInfo));
      }
      if (gridInfo) {
        this.grids.push(gridInfo);
      }
    });
    this.detectChanges();
  }
  /**
   * return gridInfo with comp is null
   * @param gridInfo 
   * @returns 
   */
  convertGridInfo(gridInfo: IGridInfo) : IGridInfo {
    const newGridInfo: IGridInfo = {
      id: gridInfo.id,
      rows: gridInfo.rows,
      cols: gridInfo.cols,
      rect: gridInfo.rect,
      colGap: gridInfo.colGap,
      rowGap: gridInfo.rowGap,
      actualH: gridInfo.actualH,
      actualW: gridInfo.actualW,
      comp: null
    };
    return newGridInfo;
  }

  /**
   * update gridLayout position
   * @param comp 
   */
  updateGridLayoutPos(comp: DomComponent){
    const gridInfo = this.grids.find(grid => {
      if (grid.id === comp.getId()) {
        return true;
      }
      return false;
    });

    if (!gridInfo) {
      return;
    }

    gridInfo.rect = comp.view.el.getBoundingClientRect();
    // console.log('gridInfo=', gridInfo);
    this.detectChanges();
  }

  /**
   * update all pos grid layout
   */
  updateAllGrids() {
    if (!this.grids.length) {
      return;
    }
    this.canvasRect = GLOBAL.canvasEl.getBoundingClientRect();
    // console.log('updateAllGrids grids=', this.grids);
    this.grids.forEach(grid => {
      grid.rect = grid.comp.view.el.getBoundingClientRect();
    });

    this.detectChanges();
  }

  /**
   * replace container
   * @param newComp 
   * @param oldId 
   */
  replaceContainer(newComp: DomComponent, oldId: string) {
    if (!newComp) {
      return;
    }
    this.grids = [];
    const newGridInfo = GLOBAL.grid.getGridInfo(newComp);
    // console.log('newGridInfo=', newGridInfo);
    if (newGridInfo) {
      newComp.set('grid-info', this.convertGridInfo(newGridInfo));
      this.grids = [newGridInfo];
    } else {
      newComp.set('grid-info', null);
    }

    this.detectChanges();
  }

  /**
   * remove grid of selected comp
   */
  removeGridSelected() {
    const id = this.selectedComp.getId();
    this.grids = this.grids.filter( grid => {
      if (grid.id === id) {
        return false;
      }
      return true;
    });
  }
  
  /**
   * handle component toggled
   * @param comp 
   * @returns 
   */
  handleOnCompToggled = (comp: any) => {
    const selectedModel = GLOBAL.editor.getSelected();
    if (!comp || !selectedModel) {
      return;
    }
    this.selectedComp = selectedModel;
    this.setGridInfo();
  }

  /**
   * handle grid update position
   * @param comp 
   */
  handleOnGridUpdatePos = (comp: any) => {
    this.isOpen = true;
    this.updateGridLayoutPos(comp);
  }
  /**
   * handle replace grid container
   * @param newComp 
   * @param oldId 
   */
  handleOnGridReplaceContainer = (newComp: DomComponent, oldId: string) => {
    this.isOpen = true;
    this.replaceContainer(newComp, oldId);
  }

  /**
   * handle on canvas scroll
   * @param event 
   */
  handleOnCanvasScroll = (event: any) => {
    this.isOpen = true;
    this.updateAllGrids();
  }

  /**
   * handle on Iframe scroll
   * @param event 
   */
  handleIframeScroll = (event: any) => {
    this.updateAllGrids();
  }

  handleOnCanvasResizeStarted = () => {
    this.isOpen = false;
    this.detectChanges();
  }

  handleOnCanvasResizeEnded = () => {
  }
  
  handleOnWindowResize = (event: any) => {
    this.setGridInfo();
  }

  handleOnCompResizeStarted = (event: any) => {
    this.removeGridSelected();
    this.detectChanges();
  }

  handleOnCompResizeEnded = (event: any) => {
    this.isOpen = true;
    this.setGridInfo();
  }

  handleOnCompNoneSelected = () => {
    this.grids = [];
    this.isOpen = false;
    this.detectChanges();
  }

  handleOnCompUndo = () => {
    this.setGridInfo();
  }

  handleOnCompRedo = () => {
    this.setGridInfo();
  }
  
  handleOnSelectedCompUpdated = (event: any) => {
    this.setGridInfo();
  }

  handleOnCompMoveEnded = (e: any) => {
    this.setGridInfo();
    this.detectChanges();
  }

  handleOnCompMovingEnded = (e: any) => {
    this.updateAllGrids();
  }

  handleOnCompMoveStarted = () => {
    // this.grids=[];
    this.detectChanges();
  }

  handleOnGridLayoutChanged = () => {
    this.setGridInfo();
    this.detectChanges();
  }
}
