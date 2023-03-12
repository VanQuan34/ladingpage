import {
  Component, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { IMenuListItem } from 'src/app/components/menu/menu.component';
import { MoWbBaseComponent } from '../../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../../editor-wrapper';
import { IPage } from '../../../../root.service';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-page-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPageInfoComponent extends MoWbBaseComponent {
  
  selectedComp: DomComponent;

  @Input() page: IPage;
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = true;
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
   * handle on page name changed
   * @param pageName 
   */
  handleOnPageNameChanged(pageName: string) {
    this.page.name = pageName;
    this.onPageChanged.emit(this.page);
  }

  /**
   * handle on home button click
   * @param event 
   */
  handleOnHomeButtonClick(event: MouseEvent) {
    this.page.isHome = true;
    this.detectChanges();
    this.onPageChanged.emit(this.page);
  }

}
