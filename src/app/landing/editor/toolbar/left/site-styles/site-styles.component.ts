import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../../../components/detection.component';
import * as $ from 'jquery';
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { EditorConstants } from '../../../constants';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-site_styles',
  templateUrl: './site-styles.component.html',
  styleUrls: ['./site-styles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorSiteStylesComponent extends MoWbDetectionComponent {
  
  selectedModel: any;
  menu: any[] = [];
  selectedId: string = 'color';
  
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;

  @Output() onMenuClose = new EventEmitter<any>();
  
  override ngOnInit() {

    this.menu = [
      {
        id: 'textStyle',
        title: 'Kiểu chữ',
      },
      {
        id: 'color',
        title: 'Màu',
      },
    ];
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.isOpen = true;
      this.detectChanges();
    }, 50);
    // GLOBAL.editor.getModel().on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
  }

  override ngOnDestroy() {
    // GLOBAL.editor.getModel().off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  handleOnMenuClose() {
    this.onMenuClose.emit();
  }

  handleOnSelectedMenuItem(item: any) {
    this.selectedId = item.id;
    this.detectChanges();
  }

  handleOnCompToggled = (comp: DomComponent) => {
    if (!comp)   {
      return;
    }

    this.isOpen = false;
    this.detectChanges();
    this.onMenuClose.emit();
  }
  
}
