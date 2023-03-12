import {
  Component, EventEmitter, ViewChild,Output, Input, ElementRef, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { MoWbBaseComponent } from '../../base.component';
import { IDropdownItem } from '../../../common/interface/IDrowdownItem';

@Component({
  selector: 'mo-wb-components-dropdown-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbDropdownItemComponent extends MoWbBaseComponent {

 
  @Input() item: any;
  @Input() keyName: string;
  @Input() key: string;
  @Input() selectedId: string;
  @Input() level: number = 1;

  @Output() onSelectedItem = new EventEmitter<any>();

  override ngOnInit() {
  }


  override ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  handleOnItemClick(e: any, item: IDropdownItem) {
    e.stopPropagation();
    this.onSelectedItem.emit(item);
  }

  override ngOnDestroy() {
  }
}
