import { Component, OnInit, Output, Input, EventEmitter,ViewChildren, QueryList,ChangeDetectionStrategy,ViewChild, ChangeDetectorRef,ComponentFactoryResolver,Injector} from '@angular/core';
import { MoWbModalComponent } from '../../components/modal/modal.component';
import { AddComponentToBodyService } from '../../api/common/add-component-to-body.service';
import { ToastTranslateService } from '../../api/common/toast-translate.service';
import {MoFontApiService} from '../../api/fontApi';
import { MoWbFontComponent } from '../select-font/font.component';
import { MoWbFontManagementModalDeleteComponent } from './delete-font/modal-delete-font.component';


@Component({
  selector: 'mo-wb-font-management',
  templateUrl: './font-management.component.html',
  styleUrls: ['./font-management.component.scss'],
	providers: [MoFontApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
  })

export class MoWbFontManagementComponent implements OnInit {

  label: string = 'i18n_font_manager'
  zIndex:number = 5000;
  height:number = 744;
  width:number = 801;
  maxWidth:number = 1200
  responseFont: Array<any> = [];
  isLoaded: boolean = false;
  selectedId: Array<any> = []
  selectedItem: Array<any> = []
  searchValue: string = ''
  loading:boolean = false;
  canLoadedMore: boolean = true;
  curPage:number = 1;
  deleteDetailItem:boolean = false;
  nameFont: string = '';
  selectAll:boolean = false;
  @Output() onClose = new EventEmitter<any>();

  @ViewChild('modal') modal!: MoWbModalComponent;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private _fontService: MoFontApiService,
    public componentFactoryResolver: ComponentFactoryResolver,
    public _domService: AddComponentToBodyService,
    public injector: Injector,
    private _toast: ToastTranslateService,

  ){}


  ngOnInit(): void {
    this.getDataFont();
    setTimeout(() => {
      this.updateSize();
    }, 0);
    this.changeDetection.detectChanges();
  }

  async getDataFont(){
    const response = await this._fontService.getListFont(1,20, '3', this.searchValue);
    if(!response || response.code!==200){
      return;
    }
    this.responseFont = response.data;
    this.isLoaded = true;
    this.curPage+=1;
    this.changeDetection.detectChanges();
  }
  ngAfterViewInit() {
    window.addEventListener('resize', this.handleOnWindowResize);
    this.show();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleOnWindowResize);
  }

  handleOnWindowResize = (e: any) => {
    this.updateSize();
  }

  updateSize() {
    this.maxWidth = Math.min(1200, window.innerWidth - 80);
    this.height = Math.min(744, window.innerHeight - 80);
    this.changeDetection.detectChanges();
  }

  public show() {
    this.modal.open();
  }

  public hideModal() {
    this.modal.hide();
  }

  close() {
    this.hideModal();
    this.onClose.emit({});
  }
  selectAllFont(){
    if(!this.selectAll){
      this.selectAll = true;
      this.selectedId = this.responseFont.map(item => item.id);
    }else{
      this.selectAll = false;
      this.selectedId = [];
    }
  }

  onChangeChecked(event:any){
    if(event.checked && event.key !== 'checkAll'){
      if(this.selectedId.includes(event.key)){
        return;
      }
      this.selectedId.push(event.key)
    }else if(event.checked && event.key==='checkAll'){
      this.selectedId = this.responseFont.map(item => item.id);
    }else if(!event.checked && event.key==='checkAll'){
      this.selectedId = [];
    }else{
      const index = this.selectedId.indexOf(event.key);
      this.selectedId.splice(index, 1);
    }

    if(this.selectedId.length === this.responseFont.length){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }
    
  }

  searchData = async (searchValue: string) => {
    if (this.searchValue === searchValue) {
      return;
    }
    this.isLoaded = false;
    this.curPage = 1;
    this.canLoadedMore = true;
    this.searchValue = searchValue;
    this.selectedId = [];
    this.selectedItem = [];
    this.fetchData();
    this.changeDetection.detectChanges();
  }
  async fetchData(isLoadMore: boolean = false) {
    if (this.loading) {
      return;
    }
    if (isLoadMore && !this.canLoadedMore) {
      return;
    }
    this.loading = true;
    const response = await this._fontService.getListFont(this.curPage,20, '3', this.searchValue);
    this.isLoaded = true;
    this.loading = false;
    if (response && response.code !== 200) {
      this._toast.show('error', response.message);
      this.changeDetection.detectChanges();
      return;
    }
    if (!isLoadMore) {
      this.responseFont = [...response.data];
    } else {
      this.responseFont = [...this.responseFont, ...response.data];
      if (!response.data.length) {
        this.canLoadedMore = false;
      }
    }
    this.curPage += 1;
    this.changeDetection.detectChanges();
  }
  fetchMoreData = async (event: any) => {
    let total: number = this.responseFont.length - 1;
    if (event.endIndex !== total || event.endIndex < 0 ) return;
    this.fetchData(true);
    if(this.selectedId.length === this.responseFont.length){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }
  }

  showAddNewFont(){
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbFontComponent).create(this.injector);
    modalRef.instance.zIndex = this.zIndex;
    modalRef.instance.getList.subscribe((event) => {
      this.isLoaded = false;
      this.curPage = 1;
      this.canLoadedMore = true;
      this.selectedId = [];
      this.selectedItem = [];
      this.getDataFont();
      this.changeDetection.detectChanges();

    })
    modalRef.instance.onClose.subscribe((event) => {
          setTimeout(() => {
            this._domService.removeComponentFromBody(modalRef);
          }, 500);
        });
    this._domService.addDomToBody(modalRef);
  }

  showModalDeleteFont(){
    const modalDeleteRef = this.componentFactoryResolver.resolveComponentFactory(MoWbFontManagementModalDeleteComponent).create(this.injector);
    modalDeleteRef.instance.selectedId = this.selectedId;
    modalDeleteRef.instance.deleteDetailItem = this.deleteDetailItem;
    modalDeleteRef.instance.nameFont = this.nameFont;
    modalDeleteRef.instance.onRefreshFont.subscribe((event) => {
      this.isLoaded = false;
      this.curPage = 1;
      this.canLoadedMore = true;
      this.selectedId = [];
      this.selectedItem = [];
      this.fetchData();
      this.changeDetection.detectChanges();

    })
    modalDeleteRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalDeleteRef);
      }, 500);
    });
    this._domService.addDomToBody(modalDeleteRef);
  }

  handlerAddNewFont(event: any){
    this.showAddNewFont();
  }

  handlerDeleteFont(e: any){
    this.deleteDetailItem=false;
    this.showModalDeleteFont();
  }

  handleOnCancelModal() {
    this.close();
  }

  handleOnCloseModal() {
    this.hideModal();
    this.onClose.emit({});
  }

  handleOnSelectItem(e: any, item:any){
    if(this.selectedId.includes(item.id)){
      const index = this.selectedId.indexOf(item.id);
      this.selectedId.splice(index, 1);
      this.selectedItem.splice(index, 1);
    }else{
      this.selectedId.push(item.id);
      this.selectedItem.push(item);
    }
    this.changeDetection.detectChanges();
  }

  handleOnDeleteItemFont(event: any, id:string, nameFont: string){
    event.stopPropagation();
    this.selectedId = [id];
    this.nameFont = nameFont;
    this.deleteDetailItem = true;
    this.showModalDeleteFont();
  }

  handleOnSearchFont(searchData: string){
    this.searchData(searchData);
  }
}
