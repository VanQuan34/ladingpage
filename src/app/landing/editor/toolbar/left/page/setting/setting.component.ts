import {
  Component, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { IMenuListItem } from 'src/app/components/menu/menu.component';
import { MoWbBaseComponent } from '../../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../../editor-wrapper';
import { IPage } from '../../../../root.service';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-page-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPageSettingComponent extends MoWbBaseComponent {
  
  selectedComp: DomComponent;
  
  @Input() tabSelected: string = 'setting';
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = true;
  @Input() page: IPage;

  @Output() onMenuClose = new EventEmitter<any>();
  @Output() onPageChanged = new EventEmitter<IPage>();
  
  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * handle on page close
   * @param event 
   */
  handleOnCloseClick(event: MouseEvent) {
    this.isOpen = false;
    this.detectChanges();
    setTimeout(() => {
      this.onMenuClose.emit({});
    }, 500);
  }

  /**
   * handle on tab click
   * @param event 
   * @param tabKey 
   */
  handleOnTabClick(event: MouseEvent, tabKey: string) {
    if (this.tabSelected === tabKey) {
      return;
    }

    this.tabSelected = tabKey;
    this.detectChanges();
  }

  /**
   * handle on page changed
   * @param page 
   */
  handleOnPageChanged(page: IPage) {
    this.onPageChanged.emit(page);
  }
}
