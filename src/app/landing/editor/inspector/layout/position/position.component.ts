import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,QueryList,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef,ViewChildren
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../components/detection.component';
import { MoLandingEditorInspectorBaseComponent } from '../../base.component';
import { Units, UnitKey, IUnit } from '../../../../../utils/unitUtil';
import { Utils } from '../../../../../utils/utils';
import { GLOBAL } from '../../../editor-wrapper';
import { IDockingPos } from 'src/app/utils/dockUtil';
import { EditorConstants } from '../../../constants';

const START = 'start';
const END = 'end';
const STRETCH = 'stretch';
const CENTER = 'center';


@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorPositionComponent extends MoLandingEditorInspectorBaseComponent {
  
  posTypes: any[] = [];
  horItems: any[] = [];
  verItems: any[] = [];

  dockingPos: IDockingPos;
  hasDocking: boolean = false;
  gridRowsTemplate: string;
  gridColsTemplate: string;
  cells: any[] = [];

  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;

  colLength: number = 0;
  rowLength: number = 0;

  alignSelf: string;
  justifySelf: string;

  units: any[] = [];

  ml: number = 0;
  mr: number = 0;
  mt: number = 0;
  mb: number = 0;

  mUnit: any;

  isContainer: boolean;

  @Input()  override classInclude: string = '';

  override onInit() {
    this.posTypes = [
      {
        key: 'default',
        name: 'Mặc định',
      },
      {
        key: 'sticky',
        name: 'Cố định',
      },
      {
        key: 'pinted',
        name: 'Pinted',
      },
    ];

    this.horItems = [
      {
        key: START,
        name: 'Trái'
      },
      {
        key: END,
        name: 'Phải'
      },
      {
        key: STRETCH,
        name: 'Trái - Phải'
      },
      {
        key: CENTER,
        name: 'Trung tâm'
      },
    ];

    this.verItems = [
      {
        key: START,
        name: 'Trên'
      },
      {
        key: END,
        name: 'Dưới'
      },
      {
        key: STRETCH,
        name: 'Trên - Dưới'
      },
      {
        key: CENTER,
        name: 'Trung tâm'
      },
    ];

    this.units.push(Units[UnitKey.px]);
    this.units.push(Units[UnitKey.per]);
    this.units.push(Units[UnitKey.vh]);
    this.units.push(Units[UnitKey.vw]);

    GLOBAL.editor.getEditor().on(EditorConstants.COMP_DOCKING_CHANGED_EVENT, this.handleOnDockingPosChanged);
  }

  override onAfterViewInit() {
    setTimeout(() => {
    }, 0);
  }

  override onDestroy() { 
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_DOCKING_CHANGED_EVENT, this.handleOnDockingPosChanged);
  }

  override setValue(): void {
    super.setValue();
    this.isContainer = GLOBAL.compUtil.isContainer(this.selectedComp);
    let dockingPos = this.selectedComp.get('docking-info');
    if (!dockingPos) {
      dockingPos = GLOBAL.dock.getFixDockingPos(this.selectedComp);
    }
    this.updateDockingPos(dockingPos);
  }

  /**
   * update docking position
   * @param dockingPos 
   * @returns 
   */
  updateDockingPos(dockingPos: IDockingPos) {
    this.hasDocking = dockingPos ? true : false;
    this.dockingPos = dockingPos;

    if (!this.hasDocking) {
      this.detectChanges();
      return;
    }

    const grid = dockingPos.area.grid;
    const rowsNumber = dockingPos && grid.rows.length  ? grid.rows.length : 0;
    const colsNumber = dockingPos && grid.cols.length  ? grid.cols.length : 0;
    // get grid layout template
    if (!rowsNumber || !colsNumber) {
      this.gridColsTemplate = undefined;
      this.gridRowsTemplate = undefined;
    } else {
      this.gridRowsTemplate  = '';
      for (let i=0; i < rowsNumber; i++) {
        this.gridRowsTemplate += "1fr ";
      }

      this.gridColsTemplate  = '';
      for (let i=0; i < colsNumber; i++) {
        this.gridColsTemplate += "1fr ";
      }
    }
    // get grid cell
    this.cells = [];
    this.startRow = dockingPos.area.startRow;
    this.endRow = dockingPos.area.endRow;
    this.startCol = dockingPos.area.startCol;
    this.endCol = dockingPos.area.endCol;
    this.colLength = colsNumber + 2;
    this.rowLength = rowsNumber + 2;

    for (let i=0; i < grid.rows.length; i++) {
      for (let j=0; j < grid.cols.length ; j++) {
        let isSelected: boolean = false;
        if (i >= this.startRow - 1 && i < this.endRow - 1 && j >= this.startCol - 1 && j < this.endCol - 1) {
          isSelected = true;
        }
        this.cells.push({isSelected: isSelected});
      }
    }

    // get justify align
    this.alignSelf = dockingPos.alignSelf;
    this.justifySelf = dockingPos.justifySelf;
    
    // get margin size
    !Utils.compareTwoNumbers(this.ml, dockingPos.ml) && (this.ml = dockingPos.ml);
    !Utils.compareTwoNumbers(this.mr, dockingPos.mr) && (this.mr = dockingPos.mr);
    !Utils.compareTwoNumbers(this.mt, dockingPos.mt) && (this.mt = dockingPos.mt);
    !Utils.compareTwoNumbers(this.mb, dockingPos.mb) && (this.mb = dockingPos.mb);
    
    this.mUnit = dockingPos.mUnit;
    this.detectChanges();
  }

  /**
   * change align self
   */
  changeAlignSelf = () => {
    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const dockingPos: IDockingPos = GLOBAL.dock.getDockingPos(container, this.selectedComp, this.alignSelf, this.justifySelf);
    let updateStyles =  [
      {
        value: dockingPos['alignSelf'],
        property: 'align-self'
      },
      {
        value: dockingPos['justifySelf'],
        property: 'justify-self'
      },
      {
        value: `${dockingPos['ml']}${dockingPos.mUnit.ml}`,
        property: 'margin-left'
      },
      {
        value: `${dockingPos['mr']}${dockingPos.mUnit.mr}`,
        property: 'margin-right'
      },
      {
        value: `${dockingPos['mt']}${dockingPos.mUnit.mt}`,
        property: 'margin-top'
      },
      {
        value: `${dockingPos['mb']}${dockingPos.mUnit.mb}`,
        property: 'margin-bottom'
      }
    ];
    // update width auto
    if (this.justifySelf === STRETCH) {
      updateStyles = [...updateStyles, ...[{value: 'auto', property: 'width'}]];
    }
    // update width pixel
    const justifySelf = this.getStyle()['justify-self'];
    if (justifySelf === STRETCH && this.justifySelf !== STRETCH) {
      const modelRect = this.selectedComp.view.el.getBoundingClientRect();
      const pixelWidth = modelRect.width;
      updateStyles = [...updateStyles, ...[{value: `${pixelWidth}px`, property: 'width'}]];
    }
    // update height auto
    if (this.alignSelf === STRETCH) {
      updateStyles = [...updateStyles, ...[{value: 'auto', property: 'height'}]];
    }
    // update height pixel
    const alignSelf = this.getStyle()['align-self'];
    if (alignSelf === STRETCH && this.alignSelf !== STRETCH) {
      const modelRect = this.selectedComp.view.el.getBoundingClientRect();
      const pixelHeight = modelRect.height;
      updateStyles = [...updateStyles, ...[{value: `${pixelHeight}px`, property: 'height'}]];
    }
    // set styles
    this.setStyles(updateStyles);
    // update docking
    this.updateDockingPos(dockingPos);

    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT, dockingPos);
  }

  convertMarginToNewUnit(newUnit: IUnit, pos: string) {
    let currentSize;
    let currentUnit;
    switch(pos) {
      case 'top':
        currentUnit = this.mUnit.mt;
        currentSize = this.mt;
        break;
      case 'right':
        currentUnit = this.mUnit.mr;
        currentSize = this.mr;
        break;
      case 'left':
        currentUnit = this.mUnit.ml;
        currentSize = this.ml;
        break;
      case 'bottom':
        currentUnit = this.mUnit.mb;
        currentSize = this.mb;
        break;
      default:
        break;
    };
    const model = GLOBAL.editor.getSelected();
    const newSize = GLOBAL.unit.convertPixelValueToUnitValue(currentSize, currentUnit, newUnit.key);

    switch(pos) {
      case 'top':
        this.mt = newSize;
        this.mUnit.mt = newUnit.key; 
        this.setStyle(`${newSize}${newUnit.key}`, 'margin-top');
        break;
      case 'right':
        this.mr = newSize;
        this.mUnit.mr = newUnit.key;
        this.setStyle(`${newSize}${newUnit.key}`, 'margin-right');
        break;
      case 'left':
        this.ml = newSize;
        this.mUnit.ml = newUnit.key;
        this.setStyle(`${newSize}${newUnit.key}`, 'margin-left');
        break;
      case 'bottom':
        this.mb = newSize;
        this.mUnit.mb = newUnit.key;
        this.setStyle(`${newSize}${newUnit.key}`, 'margin-bottom');
        break;
      default:
        break;
    };

    this.detectChanges();
  }

  changeRowCol(value: number, type: string) {
    console.log('value=', value, ' type=',type);
    switch(type) {
      case 'startCol':
        this.startCol = value;
        break;
      case 'startRow':
        this.startRow = value;
        break;
      case 'endCol':
        this.endCol = value;
        break;
      case 'endRow':
        this.endRow = value;
        break;
      default:
        break;
    }
    this.setStyles([
      {
        value: this.startCol,
        property: 'grid-column-start'
      },
      {
        value: this.startRow,
        property: 'grid-row-start'
      },
      {
        value: this.endCol,
        property: 'grid-column-end'
      },
      {
        value: this.endRow,
        property: 'grid-row-end'
      }
    ]);

    this.detectChanges();

    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const compRect = this.selectedComp.view.el.getBoundingClientRect();
    const gridArea = GLOBAL.grid.getGridArea(compRect, container);
    const dockingPos: IDockingPos = GLOBAL.dock.calcDockingPosInfo(this.selectedComp, gridArea);

    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT, dockingPos);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_DOCKING_CHANGED_EVENT, dockingPos);
    
  }

  updateMarginChanged(value: number, pos: 'mr' | 'mt' | 'mb' | 'ml') {
    switch(pos) {
      case 'mr':
        this.dockingPos.mr = value;
        this.mr = value;
        this.setStyle(`${value}${this.mUnit.mr}`, 'margin-right');
        break;
      case 'mt':
        this.dockingPos.mt = value;
        this.mt = value;
        this.setStyle(`${value}${this.mUnit.mt}`, 'margin-top');
        break;
      case 'mb':
        this.dockingPos.mb = value;
        this.mb = value;
        this.setStyle(`${value}${this.mUnit.mb}`, 'margin-bottom');
        break;
      case 'ml':
        this.dockingPos.ml = value;
        this.ml = value;
        this.setStyle(`${value}${this.mUnit.ml}`, 'margin-left');
        break;
      default:
        break;
    };

    // change docking
    const container = GLOBAL.compUtil.getContainer(this.selectedComp);
    const compRect = this.selectedComp.view.el.getBoundingClientRect();
    const gridArea = GLOBAL.grid.getGridArea(compRect, container);
    const styles = this.getStyle();
    const dockingPos: IDockingPos = GLOBAL.dock.calcDockingPosInfo(this.selectedComp, gridArea, styles['align-self'], styles['justify-self'], true);

    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT, dockingPos);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_DOCKING_CHANGED_EVENT, dockingPos);
  }

  handleOnPosTypeSelected(item: any) {
    console.log('handleOnPosTypeSelected item=', item);
  }

  handleOnHorConstraitSelected(item: any) {
    console.log('handleOnHorConstraitSelected item=', item);
  }

  handleOnVerConstraitSelected(item: any) {
    console.log('handleOnVerConstraitSelected item=', item);
  }

  handleOnDockingPosChanged = (dockingPos: any) => {
    this.updateDockingPos(dockingPos);
  }

  /**
   * handle align self click
   * @param align 
   */
  handleOnAlignSelfClick = (align: string) => {
    console.log('handleOnAlignSelfClick AlignSelf=', this.alignSelf, ' align=', align);
    // if (this.alignSelf === align) {
    //   this.alignSelf = ALIGN_CENTER;
    //   this.updateAlignSelfChanged();
    //   return;
    // }

    // this.alignSelf = align;
    // this.updateAlignSelfChanged();

    if (this.alignSelf === align) {
      this.alignSelf = CENTER;
      this.changeAlignSelf();
      return;
    }

    if (this.alignSelf === STRETCH && align === START) {
      this.alignSelf = END;
      this.changeAlignSelf();
      return;
    }

    if (this.alignSelf === STRETCH && align === END) {
      this.alignSelf = START;
      this.changeAlignSelf();
      return;
    }

    if (this.alignSelf === STRETCH && align === CENTER) {
      this.alignSelf = CENTER;
      this.changeAlignSelf();
      return;
    }

    if (this.alignSelf === CENTER) {
      this.alignSelf = align;
      this.changeAlignSelf();
      return;
    }

    if (align === CENTER) {
      this.alignSelf = CENTER;
      this.changeAlignSelf();
      return;
    }

    this.alignSelf = STRETCH;
    this.changeAlignSelf();
  }

  /**
   * handle justify self select
   * @param align 
   */
  handleOnJustifySelfClick = (align: string) => {
    // console.log('handleOnJustifySelfClick justifySelf=', this.justifySelf, ' align=', align);
    if (this.justifySelf === align) {
      this.justifySelf = CENTER;
      this.changeAlignSelf();
      return;
    }

    if (this.justifySelf === STRETCH && align === START) {
      this.justifySelf = END;
      this.changeAlignSelf();
      return;
    }

    if (this.justifySelf === STRETCH && align === END) {
      this.justifySelf = START;
      this.changeAlignSelf();
      return;
    }

    if (this.justifySelf === STRETCH && align === CENTER) {
      this.justifySelf = CENTER;
      this.changeAlignSelf();
      return;
    }

    if (this.justifySelf === CENTER) {
      this.justifySelf = align;
      this.changeAlignSelf();
      return;
    }

    if (align === CENTER) {
      this.justifySelf = CENTER;
      this.changeAlignSelf();
      return;
    }

    this.justifySelf = STRETCH;
    this.changeAlignSelf();
  }

  handleOnMarginTopChange(value: number) {
    this.updateMarginChanged(value, 'mt');
  }

  handleOnMarginLeftChange(value:number) {
    this.updateMarginChanged(value, 'ml');
  }

  handleOnMarginBottomChange(value: number) {
    this.updateMarginChanged(value, 'mb');
  }

  handleOnMarginRightChange(value: number) {
    this.updateMarginChanged(value, 'mr');
  }

  handleOnMarginUnitChange(newUnit: IUnit, pos: string) {
    this.convertMarginToNewUnit(newUnit, pos);
  }

  handleOnColRowChange(value: any, type: string) {
    this.changeRowCol(value, type);
  }


}
