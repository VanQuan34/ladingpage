import {
  Component, OnInit, EventEmitter, ViewChild, QueryList, ViewChildren,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewRef
} from '@angular/core';


@Component({
  selector: 'mo-wb-components-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbCategoryComponent implements OnInit { 

  @Input() categoryList: any[] = [
    {
      id: '1',
      title: 'Tất cả'
    },
    {
      id: '2',
      title: 'Tài chính ngân hàng'
    },
    {
      id: '3',
      title: 'Bất động sản'
    },
    {
      id: '4',
      title: 'Du lịch'
    },
    {
      id: '5',
      title: 'Thương mại điện tử'
    }
  ];
  @Input() selectedKey: any;
  @Input() classInclude: string = '';


  @Output() onSelectCategory: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _changeDetection: ChangeDetectorRef
  ){

  }
  ngOnInit(): void {
    
  }

  onSelectedCategory(e: any, item: any){
    if (item.id === this.selectedKey) {
      return;
    }
    this.selectedKey = item.id;
    
    this._changeDetection.detectChanges();
    this.onSelectCategory.emit(item);
  }
}