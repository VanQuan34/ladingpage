import {
  Component, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../../components/base.component';
import { DomComponent, GLOBAL } from '../../../../editor-wrapper';
import { IPage } from '../../../../root.service';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-page-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPageSeoComponent extends MoWbBaseComponent {
  
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
   * handle on slug value changed
   * @param slug 
   */
  handleOnSlugValueChanged(slug: string) {
    this.page.slug = slug;
    this.detectChanges();
    this.onPageChanged.emit(this.page);
  }

  /**
   * handle on title value changed
   * @param title 
   */
  handleOnTitleValueChanged(title: string) {
    this.page.title = title;
    this.detectChanges();
    this.onPageChanged.emit(this.page);
  }

  /**
   * handle on desc value changed
   * @param desc 
   */
  handleOnDescValueChanged(desc: string) {
    this.page.desc = desc;
    this.detectChanges();
    this.onPageChanged.emit(this.page);
  }

  /**
   * handle on active google index changed
   * @param active 
   */
  handleOnActiveGoogleIndexChanged(active: any) {
    this.page.allowIndex = active.active;
    this.detectChanges();
    this.onPageChanged.emit(this.page);
  }

}
