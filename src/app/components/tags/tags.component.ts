import { DefineConstants } from 'src/app/common/define/constants.define';
import { Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, ViewRef, EventEmitter, Output, ViewChildren, QueryList } from "@angular/core";
import { IMoWbLabel } from "../label/api/ILabel";
import { cloneDeep, keys } from 'lodash';
import { ITagSelectedItem } from './api/selected-item';
import { ITag } from './api/itag';
import { MoTagsServices } from 'src/app/api/tagsApi';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';

@Component({
  selector: 'mo-wb-components-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class MoWbTagsComponent implements OnInit{
  public borderInput: boolean;
  isLoaded: boolean = false;
  loading: boolean = false;
  curPage: number = 1;
  canLoadMore: boolean = true;
  searchValue: string = '';
  keyName: string = 'tag_name';
  keyId: string = 'tag_id';
  perPage:number = 25;
  valueInput: string= "";
  isFocus: boolean = false;
  viewData: Array<ITag> = [];
  processData: Array<ITag> = [];
  emptyError: boolean;
  height: string;

  @Input() isRequired: boolean = false;
  @Input() ignoreKeys: Array<string> = [];
  @Input() ignoreTagRoleParams: boolean;
  @Input() selectedItems = new Array<ITag>();
  @Input() ignoreShowSuggest: boolean;
  @Input() tagRole: string = 'assign'; // [view, assign]
  @Input() disable: boolean;
  @Input() readonly: boolean;
  @Input() ignoreItemDropDown: Array<string> = [];
  @Input() classInclude: string = '';
  @Input() label: IMoWbLabel;
  @Input() emptyErrorMsg: string = 'i18n_valid_empty_message';

  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectedItemChanged: EventEmitter<ITagSelectedItem> = new EventEmitter<ITagSelectedItem>();
  @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input') input :ElementRef;


  constructor(
    private _changeDetection: ChangeDetectorRef,
    private _moTagsServices: MoTagsServices,
    private _toast: ToastTranslateService,

  ){
    this.tagRole = 'assign';
    this.emptyError = false;
    this.height = 'mo-wb-h-26px'
  }

  ngOnInit(): void {
  }



  ngAfterViewInit(){
    this.initEvent();
  }
  
  initEvent(){
    if(!this.input && !this.input.nativeElement){
      return;
    }
    this.input.nativeElement.addEventListener('focus', this.handleOnInputFocus);
    this.input.nativeElement.addEventListener('blur', this.handleOnInputBlur);
  }

  changeDetection() {
    if (this._changeDetection !== null && this._changeDetection !== undefined && !(this._changeDetection as ViewRef).destroyed) {
      this._changeDetection.detectChanges();
    }
  }

  handlerRemove(e: any){
    this.updateSelectedItem(e, 'r');
    this.isFocus = false;
    this.refreshInput();
    this.changeDetection();
  }

  handleOnClickOutside(e: Event) {
    e.stopPropagation();
    if(this.input.nativeElement.value){
      this.isLoaded = false;
      this.curPage = 1;
      this.canLoadMore = true;
    }
    this.isFocus = false;
    this.onBlur.emit({});
    this.refreshInput(); 
    this.changeDetection();
  }

  handleOnInputFocus = (e: Event) => {
    e.stopPropagation();
    this.isFocus = true;
    this.fetchData();
    this.changeDetection();
  }
  handleOnInputBlur = (e: Event) => {}

  
  handleInputSearch(event: Event, input: any) {
    const keySearch = input && input.value ? input.value.trim() : '';
    if(keySearch === ''){
      this.onSearch(keySearch)
      return
    }
    setTimeout(() => {
      const key = input && input.value ? input.value.trim() : '';
      if (keySearch !== key) {
        return;
      }
      this.onSearch(keySearch)
    }, 250);
  }

 
  handleOnClickTagsInput(e: Event) {
    e.stopPropagation();
    this.onFocus.emit(e);
    if (this.disable || this.readonly) {
      return;
    }
    this.borderInput = true;
    if (this.input) {
      this.input.nativeElement.focus();
    }
  }

  handlerSelectDropdown(e: Event, val: ITag){
    e.stopPropagation();
    this.isFocus = false;
    this.updateSelectedItem(val)
    this.refreshInput();
    this.changeDetection();
  }

  

  handleOnKeyUp(e: Event, val: string){
    e.stopPropagation();
    if(e['keyCode' as keyof Event] >=30 && e['keyCode' as keyof Event] <=40){
      return;
    }
    if(e['keyCode' as keyof Event] === 13 && val.trim() !== '') {
      this.addNewTag(val.trim());
      this.isFocus = false;
      this.curPage = 1;
      this.isLoaded = false;
      this.canLoadMore = true;
      this.input.nativeElement.blur();
      this.changeDetection();
    }

    // const keySearch = val.trim();
    // if (keySearch === '') {
    //   this.onSearch(keySearch);
    //   return;
    // }
    // setTimeout(() => {
    //   this.onSearch(keySearch);
    // }, 250);
  }

  handleOnSelectedChange(event: any){
  }

  valid(){
    if(this.selectedItems.length===0){
      this.emptyError = true;
      return
    }
    this.emptyError = false;
    this.changeDetection();
  }
 
  calHeight(){
    if(!this.viewData && !this.viewData.length){
      this.height = 'mo-wb-h-26px'
      return;
    }
    if(this.viewData && this.viewData.length >=5){
      this.height = 'mo-wb-h-132px';
      return;
    }
    if(this.viewData && this.viewData.length === 0){
      this.height = 'mo-wb-h-26px'
      return;
    }
    if(this.viewData.length < 5){
      this.height = `mo-wb-h-${this.viewData.length * 26}px`;
      return;
    }
  }

  async fetchData(isLoadMore: boolean = false){
    if(this.loading){
      return;
    }
    if(!isLoadMore && this.isLoaded){
      return;
    }
    if(isLoadMore && !this.canLoadMore){
      return;
    }
    this.loading = true;
    this.changeDetection();
    const response = await this._moTagsServices.getDataTags(this.tagRole, this.curPage, this.perPage, this.searchValue);
    this.isLoaded = true;
    this.loading = false;
    this.changeDetection();
    if(response && response.code !== 200){
      this._toast.show( 'error', response.message);
      this.changeDetection();
      return;
    }
    if(!isLoadMore){
      this.viewData = [...response.datas];
      this.processData = [...response.datas];
    }else{
      this.viewData = [...this.viewData, ...response.datas];
      this.processData = [...this.processData, ...response.datas];
      if(!response.datas.length) {
        this.canLoadMore = false;
      }
    }
    this.curPage += 1;
    this.calHeight();
    this.changeDetection();
  }

  fetchMoreData = async (event: any) => {
    let total: number = this.viewData.length - 1;
    if (event.endIndex !== total || event.endIndex < 0) return;
    this.fetchData(true);
  }


  filterIgnoreItems(){
    this.viewData = [...this.processData];
    let x = this.selectedItems.map(item => item[this.keyId as keyof ITag]);
    x.forEach(item1 => {
      this.viewData = this.viewData.filter(item => item[this.keyId as keyof ITag] !== item1);
    })
    this.changeDetection();
  }
 
 
  onSearch(keySearch: string){
    const inputVal = (this.input && this.input.nativeElement.value && this.input.nativeElement.value.trim()) || '';
    if (keySearch !== inputVal) {
      return;
    }
    if (keySearch === this.searchValue) {
      return;
    }
    this.isLoaded = false;
    this.curPage = 1;
    this.canLoadMore = true;
    this.searchValue = keySearch;
    this.fetchData();
    this.changeDetection();
  }


  addNewTag(newTagValue: string) {
    const newTags: any = {tag_type: 100};
    newTags[this.keyName] = newTagValue;

    this.updateSelectedItem(newTags)
    this.refreshInput();
    this.changeDetection();
  }

   updateSelectedItem(item: any, action: string = 'a'){
    if(!item || !item[this.keyName]){
      return;
    }
    
    if(action === 'a'){
      const foundItem = this.selectedItems.find((selectedItem: any) => {
        return item[this.keyName] === selectedItem[this.keyName];
      });
      if (foundItem) {
        return;
      }
      this.selectedItems.push(item);
      this.onSelectedItemChanged.emit({ item: item, selectedItems: this.selectedItems });
    }
    if (action === 'r') {
      this.selectedItems = this.selectedItems.filter(selectedItem => {
        return item[this.keyName] !== selectedItem[this.keyName as keyof ITag];
      });
    }
    this.onSelectedItemChanged.emit({ item: item, selectedItems: this.selectedItems });
    if(this.isRequired){
      this.valid();
    }
    this.filterIgnoreItems();
    this.changeDetection();
  }

  refreshInput(){
    this.input.nativeElement.value = '';
    this.searchValue = '';
    this.changeDetection();
  }

}