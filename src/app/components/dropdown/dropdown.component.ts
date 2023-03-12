import {
  Component, EventEmitter, Injector, ViewChild,Output, Input, ElementRef, 
  ChangeDetectionStrategy, SimpleChanges, ChangeDetectorRef, ComponentFactoryResolver
} from '@angular/core';
// import { DefineConstants } from '../../common/define/constants.define';
import { cloneDeep } from 'lodash';
import { MoWbBaseComponent } from '../base.component';
import { DefineFunction } from '../../common/define/function.define';
import { IApiService, IDropdownItem } from '../../common';
// import { AddComponentToBodyService } from '../../api/common/add-component-to-body.service';
// import { ToastTranslateService } from '../../api/common/toast-translate.service';
// import { CacheService } from '../../api/common/cache.service';
// import { MoWbBaseApiService } from '../../api/baseApi';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mo-wb-components-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbDropdownComponent extends MoWbBaseComponent {

  isOver: boolean = false;
  isAbove: boolean = false;
  isLoading: boolean = false;
  isLoaded: boolean = false;
  currPage: number = 1;
  afterToken: string = '';
  canLoadMore: boolean = true;
  searchValue: string = '';
  isFirstOpen: boolean = true;
  storeItems: any[] = [];

  @Input() itemHeight: number = 28;
  @Input() classInclude: string = '';
  @Input() classIncludeDropDown: string = '';
  @Input() classIncludeEmptyMsg: string ='';
  @Input() label: string = '';
  @Input() isRequired: boolean = true;
  @Input() enable: boolean = true;
  @Input() maxLines: number = 5;
  @Input() selectedId: any;
  @Input() selectedItem: any;
  @Input() defaultTitle: string = 'Không chọn';
  @Input() isOpen: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() items: any[] = [];
  @Input() width: string = 'auto';
  @Input() dropdownWidth: string = '100%';
  @Input() note: string = '';
  @Input() tooltip: string = '';
  @Input() isStaticData: boolean = true;
  @Input() pageSize: number = 20;
  @Input() api: IApiService;
  @Input() key: string = 'id';
  @Input() hasSearch: boolean = false;
  @Input() searchHolder: string = 'i18n_search';
  @Input() noSearchMsg: string = 'Không tìm thấy kết qủa' //'i18n_common';
  @Input() noDataMsg: string = 'i18n_no_data';
  @Input() emptyError: boolean = false;
  @Input() emptyMsg: string = 'i18n_valid_empty_message';
  @Input() keyName: string = 'name';
  @Input() hasNotRequireText: boolean = false;
  @Input() ignoreKeys: any[] = [];
  @Input() showAsterisk: boolean = false;
  @Input() hasCloseButton: boolean = false;
  @Input() level: number = 1;
  @Input() nameButton: string = '';
  @Input() dropdownTooltip: string = '';
  @Input() isOnlyText: boolean = false;

  @Output() onSelectedItem = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<any>();
  @Output() onButtonClick = new EventEmitter<any>();

  @ViewChild('container') container!: ElementRef;
  @ViewChild('input') inputRef!: ElementRef;

  // constructor(
  //   public override _domService: AddComponentToBodyService,
  //   public override _injector: Injector,
  //   public override _toast: ToastTranslateService,
  //   public override _changeDetection: ChangeDetectorRef,
  //   public override _cacheService: CacheService,
  //   public override _translate: TranslateService,
  //   public override _componentFactoryResolver: ComponentFactoryResolver,
  //   public _baseApiService: MoWbBaseApiService
  // ) {
  //   super(_domService, _injector, _toast, _changeDetection, _cacheService, _translate, _componentFactoryResolver);
  // }

  override ngOnInit() {
    this.storeItems = cloneDeep(this.items);
  }

  override ngAfterViewInit() {
    if (!this.selectedItem) {
      setTimeout(() => {
        this.getSelectedItem();
        this.detectChanges();
      }, 0);
    }
  }
  
  updateList(){
    this.storeItems = this.items;
    console.log('this.item into dropdown:', this.items);
    this.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedId'] && changes['selectedId'].currentValue) {
      this.getSelectedItem();
      this.detectChanges();
    }
    if (changes['items'] && changes['items'].currentValue) {
      this.storeItems = cloneDeep(this.items);
      this.detectChanges();
    }
  }

  addEvents() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.addEventListener('click', this.handleDocumentClick);
  }

  setSelectedId(selectedId: any) {
    this.selectedId = selectedId && selectedId.trim();
    this.getSelectedItem();
    this.detectChanges();
  }

  getSelectedItem() {
    const items = this.isStaticData ? this.storeItems : this.items;
    if (!this.selectedId || !items || !items.length) {
      return false;
    }

    this.selectedItem = items.find((item: any, index: number) => {
      if (item[this.key] && item[this.key].toString().trim() === this.selectedId.toString().trim()) {
        return true;
      }
      return false;
    });

    return true;
  }

  async open() {
    this.isFirstOpen = false;
    const rect = this.container.nativeElement.getBoundingClientRect();
    const wh = window.innerHeight;
    if (this.maxLines * 28 > wh - rect.bottom - 50) {
      this.isAbove = true;
    } else {
      this.isAbove = false;
    }
    this.addEvents();
    this.loadData();
  }

  close() { }

  validate() {
    let result = false;
    if (this.selectedId && this.selectedItem) {
      result = true;
      this.emptyError = false;
    } else {
      result = false;
      this.emptyError = true;
    }
    this.detectChanges();
    return result;
  }

  async loadData(isMore: boolean = false) {
    if (this.isStaticData || (!isMore && this.isLoaded)
        || (isMore && !this.canLoadMore) || this.isLoading) {
      return;
    }

    if (!isMore) {
      this.currPage = 1;
    }

    this.isLoading = true;
    this.detectChanges();

    const paging = this.buildPaging();
    const query = { ...this.api.query, ...paging };

    const response = await this._baseApiService.fetchData(this.api.path, this.api.method, this.api.body, query, this.api.hostApi, this.api.headerType, this.api.needCache);

    this.isLoading = false;
    this.detectChanges();

    if (response.code !== 200) {
      this._toast.show('error', response.message);
    } else {
      this.items = isMore ? [...this.items, ...response.data] : response.data;
      if (this.api.paging && this.api.paging.token && response.paging && response.paging.cursors) {
        this.afterToken = response.paging.cursors.after;
      }
      if (isMore && !response.data.length) {
        this.canLoadMore = false;
      }
    }
    this.currPage += 1;
    this.isLoaded = true;
    this.filterData();
    this.detectChanges();
  }

  async search() {
    if (this.isStaticData) {
      this.searchStaticData();
      return;
    }

    this.canLoadMore = false;
    this.isLoaded = false;
    this.afterToken = '';
    this.loadData();
  }

  searchStaticData() {
    const searchKey = DefineFunction.deleteUnicode(this.searchValue.toLowerCase());
    this.items = this.storeItems.filter((item: any) => {
      let name = item[this.keyName] || '';
      name = DefineFunction.deleteUnicode(name.toLowerCase());
      if (name.includes(searchKey)) {
        return true;
      } else {
        return false;
      }
    });
    this.detectChanges();
  }

  fixScollVirtual() {
    const lastItem: any = this.items.pop();
    this.detectChanges();
    this.items.push(lastItem);
    this.detectChanges();
  }

  fetchMoreData = async (event: any) => {
    let total: number = this.items.length - 1;
    if (event.endIndex !== total || event.endIndex < 0) return;
    this.loadData(true);
  }

  buildPaging() {
    const paging: any = {};
    if (!this.api.paging) {
      return {};
    }
    paging.per_page = this.api.paging.perPage;
    if (this.api.paging && this.api.paging.search) {
      paging[this.api.paging.search] = this.searchValue;
    }
    if (this.api.paging && this.api.paging.token) {
      paging[this.api.paging.token] = this.afterToken;
      return paging;
    }
    paging['page'] = this.currPage;
    return paging;
  }

  filterData() {
    if (!this.items.length || !this.ignoreKeys.length) {
      return;
    }
    this.items = this.items.filter((element: any) => {
      if (this.ignoreKeys.includes(element[this.key])) {
        return false;
      }
      return true;
    });
    this.detectChanges();
  }

  setIgnoreKeys(ignoreKeys: any[]) {
    this.ignoreKeys = cloneDeep(ignoreKeys);
    this.filterData();
  }

  calcHeightPopup() {
    const height = (this.items.length ?
        (this.maxLines > this.items.length) ? this.items.length : this.maxLines : 3) * this.itemHeight + 5 + this.itemHeight + (this.hasSearch ? 28 : 0 ) + 'px';
 
    return height;
  }

  onClickManageMenu(event: any){
    this.onButtonClick.emit({});
  }

  handleOnDropdownClick(e: any) {
    if (!this.enable || this.readOnly) {
      return;
    }
    this.isOpen = !this.isOpen;
    this.isAbove = false;

    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
    this.detectChanges();
  }

  handleOnSelectItem(item: any) {
    if (!this.enable || this.readOnly) {
      return;
    }
    if ((item[this.key] && item[this.key] === this.selectedId) || (item._id && item._id === this.selectedId)) {
      if (this.isRequired) {
        return;
      }
      this.selectedId = '';
      this.selectedItem = undefined;
      this.onSelectedItem.emit(undefined);
    } else {
      this.emptyError = false;
      this.selectedId = item[this.key];
      this.getSelectedItem();
      this.onSelectedItem.emit(item);
    }

    this.isOpen = false;
    this.close();
    this.detectChanges();
  }

  handleOnCloseMenuClick(e: any) {
    e.stopPropagation();
    this.isOpen = false;
    this.close();
    this.detectChanges();
  }

  handleDocumentClick = (e: any) => {
    if (this.isOver) {
      return;
    }

    this.isOpen = false;
    this.close();
    this.detectChanges();
  }

  handleOnMouseover = (e: any) => {
    this.isOver = true;
  }

  handleOnMouseleave = (e: any) => {
    this.isOver = false;
  }

  handleOnInputSearchClick = (event: any) => {
    event.stopPropagation();
  }

  handleOnInputSearchKeyUp = (event: any) => {
    const value = (this.inputRef.nativeElement.value && this.inputRef.nativeElement.value.trim()) || '';

    if (event.keyCode === 13) {
      this.searchValue = value;
      this.search();
      return;
    }

    setTimeout(() => {
      const currentValue = (this.inputRef.nativeElement.value && this.inputRef.nativeElement.value.trim()) || '';
      if (value !== currentValue) {
        return;
      }
      this.searchValue = currentValue;
      this.search();
    }, 250);
  }

  handleOnRemoveClick(event: any) {
    event.stopPropagation();
    this.selectedId = '-1';
    this.selectedItem = null;
    this.detectChanges();
    this.onRemove.emit({});
  }

  override ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick);
  }
}
