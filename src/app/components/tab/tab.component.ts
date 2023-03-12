import {
  Component, OnInit, EventEmitter, ViewChild, QueryList, ViewChildren,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewRef
} from '@angular/core';

interface ITabItem {
  key: any;
  name: string;
}

@Component({
  selector: 'mo-wb-components-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbTabComponent implements OnInit {

  dividerWidth: string = '0px';
  dividerLeft: string = '40px';

  @Input() classInclude: string = '';
  @Input() tabList: ITabItem[] = [];
  @Input() selectedTabKey: any;
  @Input() normalColorClass: string = 'mo-wb-color-999999';
  @Input() selectedColorClass: string = 'mo-wb-color-009cdb';
  @Input() placeHolder: string = '';
  @Input() disableDeleteButton: boolean;
  @Input() showRightAction: boolean;

  @Output() onSelectTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowModalDelete: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('tab') tabs: QueryList<ElementRef>;
  @ViewChild('tabHeader') tabHeader: ElementRef;


  constructor(
    private _changeDetection: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.updateDividerPos();
    setTimeout(() => {
      this.updateDividerPos();
    }, 250);
  }

  updateDividerPos() {
    const selectedIndex = this.tabList.findIndex(item => {
      if (item.key === this.selectedTabKey) {
        return true;
      }
      return false;
    });

    const rectTab = this.tabHeader.nativeElement.getBoundingClientRect();
    const rectItem = this.tabs.toArray()[selectedIndex].nativeElement.getBoundingClientRect();

    this.dividerWidth = `${rectItem.width}px`;
    this.dividerLeft = `${rectItem.left - rectTab.left}px`;
    this.detectChanges();
  }

  detectChanges() {
    if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
      this.detectChanges();
    }
  }

  handleOnTabClick(event: any, item: ITabItem) {
    if (item.key === this.selectedTabKey) {
      return;
    }
    this.selectedTabKey = item.key;
    this.updateDividerPos();
    this.detectChanges();

    this.onSelectTab.emit(item);
  }
  handleShowDeleteModal() {
    this.onShowModalDelete.emit();
  }

  handleOnSearch(event: any) { }

  ngOnDestroy() {
  }

}
