import { Component, OnInit, Output, Input, EventEmitter,ViewChildren, QueryList,ChangeDetectionStrategy,ViewChild, ChangeDetectorRef,ComponentFactoryResolver,Injector} from '@angular/core';
import { MoWbModalComponent } from '../../components/modal/modal.component';
import { ToastTranslateService } from '../../api/common/toast-translate.service';
import { MoWbDropdownComponent } from '../../components/dropdown/dropdown.component';
import { DefaultConfig } from '../../popup/config/default';
import { IApiService } from '../../common/';
import { MoFontApiService } from '../../api/fontApi';


interface IEventItem {
  font_default_id: string,
  font_type:string,
}
@Component({
    selector: 'mo-wb-font-modal-google-add',
    templateUrl: './google-font-add.component.html',
    styleUrls: ['./google-font-add.component.scss'],
	  providers: [MoFontApiService],
    changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class MoWbFontAddGoogleComponent implements OnInit {
    fonts: IEventItem[];
    searchHolder:string = 'i18n_search_by_name_font';
    defaultTitle: string = 'i18n_select_font';
    apiFetchList: IApiService;
    label:string = 'i18n_add_from_google_font';
    width:number = 598;
    height: number = 182;
    nameSearch: string = '';
    ignoreKeys: Array<any> = [];
    loading:boolean = false;
    

    @Input() zIndex : number = 0;
    @Output() onClose = new EventEmitter<any>();
    @Output() refreshFontList = new EventEmitter<any>();

    @ViewChildren('fontDropdown') fontDropdownListRef!: QueryList<MoWbDropdownComponent>;
    @ViewChild('modal') modal!: MoWbModalComponent;

    constructor(
      private changeDetection: ChangeDetectorRef,
      private _fontService: MoFontApiService,
      private _toast: ToastTranslateService,
    ){
      this.apiFetchList = {
        method: 'GET',
        needCache: false,
        query: {
        },
        paging: {
          perPage:20,
          search: 'search',
        },
        path: 'font-default'
      }

      this.fonts = [
        {
          font_default_id: '',
          font_type: '',
        }
      ];

      this.initFontData();
    }

    getFontData() {
      let isValid = true;
      this.fontDropdownListRef.toArray().forEach(ele => {
        if (!ele.validate()) {
          isValid = false;
        }
      });
      if (!isValid) {
        return false;
      }
      return this.fonts;
    }

    initFontData() {
      const selectedModel = DefaultConfig.popupEditor?.getSelected();
      if (!selectedModel) {
        return;
      }
      const attrs = selectedModel.getAttributes();
      this.fonts = attrs['fonts'] ? JSON.parse(attrs['fonts']):
        [
          {
            font_default_id: '',
            font_type:'',
          }
        ];
    }

    ngOnInit(): void {
    }
    

    ngAfterViewInit() {
      this.show();
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

    getData() {
      const fonts = this.getFontData();
      if (!fonts) {
        return false;
      }
      return fonts;
    }

    async save(){
      this.fontDropdownListRef.toArray()[0].validate();
      this.loading = true;
      const fonts = this.getData();
      if(!fonts){
        return false;
      }
      const result = await this.createFont(this.fonts[0].font_type, this.fonts[0].font_default_id);
      this.loading = false;
      if(result){
        this.hideModal();
        this.onClose.emit({});
      }
      this.changeDetection.detectChanges();
      return true;
      
    }

   
    async createFont(font_type: any, font_default_id: any){
      const response = await this._fontService.createFont(font_type, font_default_id)
      if (!response || response.code !== 200) {
        this._toast.show('error', response.message);
				return false;
			}
      this.refreshFontList.emit({});
			this._toast.show('success', 'i18n_notification_manipulation_success');
      return true;
    }

    handleOnSaveClick(){
      this.save();
    }

    handleOnCancelModal() {
      this.close();
    }

    handleOnCloseModal() {
      this.hideModal();
      this.onClose.emit({});
    }

    handleOnFontSelected(event:any){
      this.fonts[0].font_default_id = event['id']
      this.fonts[0].font_type = 'google_font';
      this.changeDetection.detectChanges();
    }

    ngOnDestroy(): void {
    }
  }
