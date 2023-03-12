import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../components/detection.component';
import { GLOBAL } from '../../../editor-wrapper';
import * as $ from 'jquery';
import { EditorConstants } from '../../../constants';

@Component({
  selector: 'mo-wb-landing-editor-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorMenuComponent extends MoWbDetectionComponent {
  
  selectedModel: any;
  menu: any[] = [];
  selectedId: string = 'quickAdd';
  
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onMenuClose = new EventEmitter<any>();
  
  override ngOnInit() {
    GLOBAL.editor.getEditor().on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);

    this.menu = [
      {
        id: 'quickAdd',
        title: 'Thêm nhanh',
      },
      {
        id: 'section',
        title: 'Thành phần',
      },
      {
        id: 'layout',
        title: 'Bố cục',
      },
      {
        id: 'button',
        title: 'Nút',
      },
      {
        id: 'text',
        title: 'Văn bản',
      },
      {
        id: 'menu',
        title: 'Menu',
      },
      {
        id: 'form',
        title: 'liên hệ và mẫu',
      },
      {
        id: 'icon',
        title: 'Mạng xã hội',
      },
    ];
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.selectedModel = GLOBAL.editor.getEditor().getSelected();
      console.log('menu,', this.menu);
    }, 0);
  }

  override ngOnDestroy() {
    GLOBAL.editor.getEditor().off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['isOpen']) {
    //   this.selectedModel = this.editor && this.editor.getSelected();
    //   this.detectChanges();
    // }
  }
  
  handleOnCompToggled = (comp: any) => {
    if (!comp) {
      return;
    }
    this.selectedModel = GLOBAL.editor.getEditor().getSelected();
    this.detectChanges();
  }

  handleOnMenuClose() {
    this.isOpen = false;
    this.detectChanges();
    setTimeout(() => {
      this.onMenuClose.emit({});
    }, 500);
  }

  handleOnOpenAddNew = () => {
    this.isOpen = true;
    this.detectChanges();
  }
  
}
