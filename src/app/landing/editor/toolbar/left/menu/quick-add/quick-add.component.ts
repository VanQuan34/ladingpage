import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ViewChildren, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges, QueryList
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../../components/detection.component';
import { IBlock, MoBlocksService } from '../../../../blocks/blocks.service';
import { DomComponent, GLOBAL } from '../../../../editor-wrapper';

import * as $ from 'jquery';
import { EditorConstants } from '../../../../constants';

@Component({
  selector: 'mo-wb-landing-editor-menu-quick_add',
  templateUrl: './quick-add.component.html',
  styleUrls: ['./quick-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorMenuQuickAddComponent extends MoWbDetectionComponent {
  
  selectedModel: any;
  selectedId: string = '';
  blocks: any[] = [];
  blockItemSelected: any;
  blockMove: any;
  containerId: string = '';
  startMovedObj: any = {};
  movedContainer: any;
  isOverFrame: boolean = false;

  @Input() classInclude: string = '';
  @ViewChildren('blocks') blockRefs: QueryList<ElementRef> = new QueryList<ElementRef>();

  @Output() onClose = new EventEmitter<any>();

  constructor(
    public override _changeDetection: ChangeDetectorRef,
    private _blocksService: MoBlocksService
  ) {
    super(_changeDetection);
  }
  
  override ngOnInit() {
    this.blocks = [
      {
        id: 'title',
        title: 'Tiêu đề',
        icon: 'mo-icn-popup_text',
      },
      {
        id: 'text',
        title: 'Văn bản',
        icon: 'mo-icn-Demo_sheet'
      },
      {
        id: 'button',
        title: 'Nút bấm',
        icon: 'mo-icn-popup_button'
      },
      {
        id: 'image',
        title: 'Hình ảnh',
        icon: 'mo-icn-popup_image'
      },
      {
        id: 'form',
        title: 'Form',
        icon: 'mo-icn-popup_form'
      },
      {
        id: 'video',
        title: 'Video',
        icon: 'mo-icn-popup_video'
      },
      {
        id: 'gallery',
        title: 'Bộ sưu tập',
        icon: 'mo-icn-landing-page'
      },
      {
        id: 'carousel',
        title: 'Thanh trượt',
        icon: 'mo-icn-app_banner'
      },
      {
        id: 'tabs',
        title: 'Tabs',
        icon: 'mo-icn-popup_form_template'
      },
      {
        id: 'accordion',
        title: 'Accordion',
        icon: 'mo-icn-popup_form_template'
      },
      {
        id: 'table',
        title: 'Table',
        icon: 'mo-icn-popup_form_template'
      },
      {
        id: 'container',
        title: 'Vùng chứa',
        icon: 'mo-icn-popup_line_select_all'
      },
      {
        id: 'layout',
        title: 'Bố cục',
        icon: 'mo-icn-layout-com'
      },
      {
        id: 'repeater',
        title: 'Bố cục lặp',
        icon: 'mo-icn-ab_test_message'
      },
      {
        id: 'iframe',
        title: 'Iframe',
        icon: 'mo-icn-Enterprise'
      },
      {
        id: 'menu',
        title: 'Menu',
        icon: 'mo-icn-empty-menu'
      },
      {
        id: 'icon',
        title: 'Icon',
        icon: 'mo-icn-popup_icon'
      },
      {
        id: 'line',
        title: 'Đường kẻ',
        icon: 'mo-icn-popup_line_dash'
      },
      {
        id: 'social',
        title: 'Mạng xã hội',
        icon: 'mo-icn-manage_social_networks'
      },
    ];
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.selectedModel = GLOBAL.editor.getEditor().getSelected();
    }, 0);
  }

  override ngOnDestroy() {
  }

  close() {
    this.onClose.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  initEvents(e: any) {
    const Canvas = GLOBAL.editor.getCanvas();
    const body = Canvas.getBody();
    // $(document).on("mousemove", this.onFrameMousemove, true);
    document.addEventListener('mousemove', this.onDocMousemove, true);
    body.addEventListener('mousemove', this.onFrameMousemove, true);

    document.addEventListener('mouseup', this.onMouseup, true);
    body.addEventListener('mouseup', this.onMouseup, true);
  }

  /**
   * block mouse down
   * @param e 
   * @param blockItem 
   * @param index 
   */
  onBlockElementMousedown = (e: any, blockItem: any, index: number) => {
    blockItem.data = this._blocksService.getContentBlock(blockItem.id);
    this.blockItemSelected = blockItem;
    const blockEl = this.blockRefs.toArray()[index];
    const rectEl = blockEl.nativeElement.getBoundingClientRect();
    this.blockMove = document.createElement("div");
    $(this.blockMove).addClass('mo-box-moved');
    $(document.body).append(this.blockMove);

    $(this.blockMove).css({top: `${rectEl.y}px`, left: `${rectEl.x}px`, width: `${rectEl.width}px`, height: `${rectEl.height}px`});
    this.selectedId = blockItem.id;
    this.initEvents(e);

    const editorWrap = $(document.body).find('#editor');
    const rect = editorWrap[0].getBoundingClientRect();

    this.startMovedObj = {
      startX: rectEl.x,
      startY: rectEl.y,
      clientX: e.clientX,
      clientY: e.clientY,
      blockItem: blockItem,
      rect: rect,
      data: blockItem.data
    }

    this.detectChanges();
  }

  onDocMousemove = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    this.moveBlock(x, y);
  }

  onFrameMousemove = (e: any) => {
    if (!this.blockMove) {
      return;
    }
    const wrapRect = this.startMovedObj.rect;
    const x = e.clientX + wrapRect.x;
    const y = e.clientY + wrapRect.y;

    const container = this.getContainerFromPoint(e.clientX, e.clientY);
    const tempId = container && container.getId();
    GLOBAL.editor.setBlockMoved(true);
    // console.log('onFrameMousemove tempId=', tempId, ' id =', this.containerId);
    if (container && tempId !== this.containerId) {
      // show grid container
      GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_GRID_REPLACE_CONTAINER_EVENT, container, this.containerId);
      // show container
      GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_CONTAINER_SHOW_EVENT, container);
      // show attach comp
      GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_SHOW_ATTACH_EVENT, container);
      this.containerId = tempId;
    } 
    this.movedContainer = container;

    const compRect = this.getMovedRect();
    const gridArea = GLOBAL.grid.getGridArea(compRect, container);

    if (!this.isOverFrame) {
      this.isOverFrame = true;
      const data: IBlock = this.startMovedObj.data;
      const dragContent = data.dragContent;

      const top = $(this.blockMove).css('top');
      const left = $(this.blockMove).css('left');
      $(this.blockMove).html(dragContent.content);
      $(this.blockMove).css({width: dragContent.width, height: dragContent.height});
      const rect = this.blockMove.getBoundingClientRect();
      // console.log('blockMove top=', top, ' left=', left, ' dragContent=', dragContent);
      this.startMovedObj.startY = this.startMovedObj.clientY - rect.height / 2;
      this.startMovedObj.startX = this.startMovedObj.clientX - rect.width / 2;
    } 
    // move block
    this.moveBlock(x, y, gridArea);
    // close menu
    this.close();
  }

  getMovedRect() {
    const wrapRect = this.startMovedObj.rect;
    const _compRect = this.blockMove.getBoundingClientRect();
    const compRect: any = {
      x: _compRect.x,
      y: _compRect.y,
      top: _compRect.top,
      left: _compRect.left,
      width: _compRect.width,
      height: _compRect.height
    };
    // console.log('compRect=', compRect);
    compRect.x = compRect.x - wrapRect.x;
    compRect.left = compRect.left - wrapRect.x;
    compRect.y = compRect.y - wrapRect.y;
    compRect.top = compRect.top - wrapRect.y;

    return compRect;
  }

  moveBlock(x: number, y: number, gridArea: any = null) {
    const data: IBlock = this.startMovedObj.data;
    if (gridArea) {
      $(this.blockMove).css({
        'grid-column-start': gridArea.startCol,
        'grid-column-end' : gridArea.endCol,
        'grid-row-start': gridArea.startRow,
        'grid-row-end' : gridArea.endRow
      });
    }
    if (data && data.width.unit === '%' && gridArea) {
      const width = gridArea.width * data.width.value / 100;
      $(this.blockMove).css({
        'width': `${width}px`,
        'grid-column-start': gridArea.startCol,
        'grid-column-end' : gridArea.endCol
      });
    }

    const top = y - this.startMovedObj.clientY + this.startMovedObj.startY;
    const left = x - this.startMovedObj.clientX + this.startMovedObj.startX;
    $(this.blockMove).css({
      'top': `${top}px`,
      'left' : `${left}px`
    });
  }

  onMouseup = (e: any) => { 
    const body = GLOBAL.editor.getIFrameBody();
    // remove event move
    document.removeEventListener('mousemove', this.onDocMousemove, true);
    body.removeEventListener('mousemove', this.onFrameMousemove, true);
    // remove event mouse up
    document.removeEventListener('mouseup', this.onMouseup, true);
    body.removeEventListener('mouseup', this.onMouseup, true);

    GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_HIDE_ATTACH_EVENT);

    if (this.isOverFrame) {
      this.addBlock();
    }
    
    // remove block item
    $(this.blockMove).remove();

    //reset variables
    this.isOverFrame = false;
    this.containerId = '';
    this.selectedId = '';

    GLOBAL.editor.setBlockMoved(false);
  }

  /**
   * add block
   * @returns 
   */
  addBlock() {
    const blockId = this.startMovedObj.blockItem.id;
    const data: IBlock = this._blocksService.getContentBlock(blockId);
    // console.log('blockId=', blockId, ' data=', data);
    if (!data || !this.movedContainer) {
      return;
    }
    const htmlStr = GLOBAL.compUtil.convertCompHtml(data.content, this.movedContainer);
    const comps: DomComponent[] = GLOBAL.compUtil.appendToContainer(htmlStr, this.movedContainer);
    if (!comps || !comps.length) {
      return;
    }
     
    const newComp = comps[comps.length - 1];
    const compRect = this.getMovedRect();

    const gridArea = GLOBAL.grid.getGridArea(compRect, this.movedContainer);
    const dockingPos = GLOBAL.dock.calcDockingPosForCompRect(compRect, gridArea);

    const colStart = gridArea.startCol;
    const colEnd = gridArea.endCol;
    const rowStart = gridArea.startRow;
    const rowEnd = gridArea.endRow;

    // console.log('dockingPos=', dockingPos); 
    const styleId = GLOBAL.compUtil.getStyleCompId(newComp);
    const styles = GLOBAL.editor.getStyles(styleId);
    
    styles['margin-left'] = dockingPos.ml + 'px';
    styles['margin-top'] = dockingPos.mt + 'px';
    styles['margin-bottom'] = dockingPos.mb + 'px';
    styles['margin-right'] = dockingPos.mr + 'px';
    styles['align-self'] = dockingPos.alignSelf;
    styles['justify-self'] = dockingPos.justifySelf;
    styles['grid-row-start'] = rowStart;
    styles['grid-row-end'] = rowEnd;
    styles['grid-column-start'] = colStart;
    styles['grid-column-end'] = colEnd;

    // console.log('addBlock styles=', styles, ' id=', styleId);
    GLOBAL.editor.setStyles(styleId, styles, {fixMedia: true});
    // select component
    GLOBAL.editor.select(newComp);
    // add to repeater item
    GLOBAL.compUtil.appendToOtherRepeaterItems(newComp, this.movedContainer);

    GLOBAL.compUtil.appendChildToForm(newComp);
  }

  getModelFromId(id: string) {
    const models = GLOBAL.editor.getWrapper().find(`#${id}`);
    // console.log('getModelFromId id=', id, ' models=', models);
    return models && models.length && models[0];
  }
  
  getMoComp(el: any) {
    let moType = $(el).attr('mo-type');
    const id = $(el).attr('id');
    let moEl = $(el);
    // console.log('getMoModel moType=',moType, ' id=', id);
    if (moType && id) {
      return this.getModelFromId(id);
    }

    const maxLoop = 5;
    let number = 0;

    while (number < maxLoop) {
      const parent = moEl && $(moEl).parent();
      const _moType = parent.attr('mo-type');
      // console.log('getMoElement loop=', number ,'moType=',_moType, ', parent=', parent);
      moEl = parent;
      if (_moType) {
        break;
      }
      number++;
    }
    const newId = moEl.attr('id');
    // console.log('getMoModel moEl=', moEl[0], ' id=', newId);

    const moModel = this.getModelFromId(newId);
    return moModel;
  }

  getContainerFromPoint(x: number, y: number) {
    try {
      const doc = GLOBAL.editor.getDocument();
      const el = doc.elementFromPoint(x, y);
      if (!el) {
        return null;
      }
      let model = $(el).data('model');
      model = this.getMoComp(el);
      if (!model) {
        return null;
      }
      let container = GLOBAL.compUtil.getContainer(model, false);
      return container;
    } catch (ex) {
      console.log('getContainerFromPoint ex=',ex);
      return null;
    }
  }

  handleOnBlockItemMousedown(e: any, blockItem: any, index: number) {
    this.onBlockElementMousedown(e, blockItem, index);
    this.detectChanges();
  }

  handleOnBlockItemClick(e: any, item: any) {
    this.selectedId = item.id;
    this.detectChanges();
  }

  handleOnCloseIconClick(e: any) {
    this.close();
  }
  
}
