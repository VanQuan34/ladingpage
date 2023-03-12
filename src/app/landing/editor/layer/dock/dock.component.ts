
import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoLandingEditorLayerBaseComponent } from '../base.component';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { IDockingPos } from 'src/app/utils/dockUtil';
import { IGridArea, IGridInfo } from 'src/app/utils/gridLayoutUtil';
import { flatMap } from 'lodash';
import { EditorConstants } from '../../constants';

@Component({
  selector: 'mo-wb-landing-editor-layer-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorLayerDockComponent extends MoLandingEditorLayerBaseComponent {
  
  containerComps: any[] = [];
  isContainer: boolean;
  isMoving: boolean = false;
  isNotShow: boolean;
  dockingPos: IDockingPos;
  areaRect: {
    top: number,
    left: number,
    width: number,
    height: number
  };

  centerHor: {
    width: number,
    top: number,
    left: number
  };

  centerVer: {
    height: number,
    top: number,
    left: number
  };

  ml: string;
  mr: string;
  mb: string;
  mt: string;
  mch: string;
  mcv: string;

  isTextShow: boolean = false; 

  override ngOnInit() {
    this.areaRect = {
      top: 0,
      left: 0,
      height: 0,
      width: 0
    }
  }

  override onAfterViewInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
    // GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_MOVING_EVENT, this.handleOnCompMoving);
    // GLOBAL.editor.getEditor().on(EditorConstants.COMP_SELECTED_UPDATED_EVENT, this.handleOnSelectedCompUpdated);
  }

  override setValue(): void {
    super.setValue();
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp) {
      this.isOpen = false;
      this.detectChanges(); 
      return;
    }
    this.isOpen = true;
    this.isTextShow = false;
    this.isNotShow = false;

    this.dockingPos = GLOBAL.dock.getFixDockingPos(this.selectedComp);
    this.selectedComp.set('docking-info', this.convertDockingInfo(this.dockingPos));

    GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_DOCKING_CHANGED_EVENT, this.dockingPos);
    this.setPosition();
  }

  override setPosition(): void {
    this.selectedComp = GLOBAL.editor.getSelected();
    if (!this.selectedComp || !this.dockingPos) {
      this.isOpen = false;
      this.detectChanges();
      return;
    }

    const editorRect = GLOBAL.canvasEl.getBoundingClientRect();
    const rect = this.selectedComp.view.el.getBoundingClientRect();

    this.top = editorRect.top + rect.top;
    this.left = editorRect.left + rect.left;
    this.width = rect.width;
    this.height = rect.height;

    const containerRect = this.dockingPos.area.container.view.el.getBoundingClientRect();
    this.areaRect.top = editorRect.top + containerRect.top + this.dockingPos.area.top;
    this.areaRect.left = editorRect.left + containerRect.left + this.dockingPos.area.left;
    this.areaRect.height = this.dockingPos.area.height;
    this.areaRect.width = this.dockingPos.area.width;

    this.centerHor = {
      width: 0,
      top: 0,
      left: 0
    };

    this.centerVer = {
      height: 0,
      top: 0,
      left: 0
    };

    this.centerHor.width = (this.dockingPos.mlpx || this.dockingPos.mrpx) / 2;
    this.centerHor.top = this.top + this.height/2;
    this.centerHor.left = this.dockingPos.mr ? this.left + this.width / 2 : this.left + this.width / 2 - this.centerHor.width;

    this.centerVer.height = (this.dockingPos.mtpx || this.dockingPos.mbpx) / 2;
    this.centerVer.top = this.dockingPos.mb ? this.top + this.height/2 : this.top + this.height/2  - this.centerVer.height;
    this.centerVer.left = this.left + this.width / 2;  //this.dockingPos.mr ? this.left + this.width / 2 : this.left + this.width / 2 - this.centerHor.width;

    this.ml = `${Math.round(this.dockingPos.ml)}${this.dockingPos.mUnit.ml}`;
    this.mr = `${Math.round(this.dockingPos.mr)}${this.dockingPos.mUnit.mr}`;
    this.mb = `${Math.round(this.dockingPos.mb)}${this.dockingPos.mUnit.mb}`;
    this.mt = `${Math.round(this.dockingPos.mt)}${this.dockingPos.mUnit.mt}`;
    this.mt = `${Math.round(this.dockingPos.mt)}${this.dockingPos.mUnit.mt}`;
    this.mch = `${Math.round(this.dockingPos.mr || this.dockingPos.ml)}${this.dockingPos.mr ? this.dockingPos.mUnit.mr : this.dockingPos.mUnit.ml}`;
    this.mcv = `${Math.round(this.dockingPos.mt || this.dockingPos.mb)}${this.dockingPos.mb ? this.dockingPos.mUnit.mb : this.dockingPos.mUnit.mt}`;

    // console.log('mcv=', this.mcv, ' height=', this.centerVer.height);
    this.detectChanges();
  }

  convertDockingInfo(dockingPos: IDockingPos) {
    if (!dockingPos) {
      return null;
    }
    const gridInfo: IGridInfo = {
      id: dockingPos.area.grid.id,
      rows: dockingPos.area.grid.rows,
      cols: dockingPos.area.grid.cols,
      rect: dockingPos.area.grid.rect,
      colGap: dockingPos.area.grid.colGap,
      rowGap: dockingPos.area.grid.rowGap,
      actualH: dockingPos.area.grid.actualH,
      actualW: dockingPos.area.grid.actualW,
      comp: null
    }
    const area: IGridArea = {
      top: dockingPos.area.top,
      left: dockingPos.area.left,
      startRow: dockingPos.area.startRow,
      endRow: dockingPos.area.endRow,
      startCol: dockingPos.area.startCol,
      endCol: dockingPos.area.endCol,
      width: dockingPos.area.width,
      height: dockingPos.area.height,
      grid: gridInfo,
      container: null
    }

    const newDockingInfo: IDockingPos = {
      alignSelf: dockingPos.alignSelf,
      justifySelf: dockingPos.justifySelf,
      ml: dockingPos.ml,
      mr: dockingPos.mr,
      mt: dockingPos.mt,  
      mb: dockingPos.mb,
      mbpx: dockingPos.mbpx,
      mlpx: dockingPos.mlpx,
      mtpx: dockingPos.mtpx,
      mrpx: dockingPos.mrpx,
      mUnit: dockingPos.mUnit,
      area: area
    };
    
    return newDockingInfo;
  }

  handleCompMoving(container: DomComponent) {
    this.isTextShow = true;
    let gridArea: IGridArea;
    let gridInfo: IGridInfo =  container && container.get('grid-info');
    // console.log('handleCompMoving gridInfo=', gridInfo);
    if (gridInfo) {
      gridInfo.comp = this.selectedComp;
    }
    // console.log('gridInfo=', gridInfo);
    gridArea = GLOBAL.grid.getGridArea(this.selectedComp.view.el.getBoundingClientRect(), container, gridInfo);
    this.dockingPos = GLOBAL.dock.calcDockingPosInfo(this.selectedComp, gridArea);
    
    this.selectedComp.set('docking-info', this.convertDockingInfo(this.dockingPos));
    GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_DOCKING_CHANGED_EVENT, this.dockingPos);

    this.setPosition();
    this.detectChanges();
  }

  handleOnCompMoving = (container: DomComponent) => {
    this.handleCompMoving(container);
  }

  override handleOnCompMoveStarted = (e: any) => {
    this.detectChanges();
  }

  override handleOnCompMoveEnded = (e: any) => {
    this.isTextShow = false;
    this.detectChanges();
  }

  override handleOnSelectedCompUpdated = (dockingPos: IDockingPos) => {
    if (dockingPos) {
      this.dockingPos = dockingPos;
      this.selectedComp.set('docking-info', this.convertDockingInfo(this.dockingPos));
      this.setPosition();
    }
  }
}
