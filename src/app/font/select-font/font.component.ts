import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { MoWbModalComponent } from '../../components/modal/modal.component';
import { AddComponentToBodyService } from '../../api/common/add-component-to-body.service';
import { MoWbFontAddCustomComponent } from '../add-custom-font/custom-font-add.component';
import { MoWbFontAddGoogleComponent } from '../add-google-font/google-font-add.component';
import { DOMAIN_GET_SOURCES_STATIC } from '../../common/define/host-domain.define';


@Component({
  selector: 'mo-wb-font',
  templateUrl: './font.component.html',
  styleUrls: ['./font.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbFontComponent implements OnInit {

  label: string = 'i18n_add_font';
  width: number = 598
  maxWidth: number = 1200;
  height: number = 261;
  typeFont:string = '';
  urlImgGoogle: string;
  urlImgMyFont: string;
  loading: boolean = false;
  
  @Input() zIndex: number = 0;
  @Output() onClose = new EventEmitter<any>();
  @Output() refreshFontList = new EventEmitter<any>();
  @Output() getList = new EventEmitter<any>();

  @ViewChild('modal') modalFontRef!: MoWbModalComponent;

  constructor(
    private changeDetection: ChangeDetectorRef,
    public componentFactoryResolver: ComponentFactoryResolver,
    public _domService: AddComponentToBodyService,
    public injector: Injector,
  ) {
    this.urlImgGoogle = `${DOMAIN_GET_SOURCES_STATIC()}gg_font.png`
    this.urlImgMyFont = `${DOMAIN_GET_SOURCES_STATIC()}custom_font.png`
  }

  ngOnInit(): void {

  }
  
  ngAfterViewInit() {
    this.show();
    this.changeDetection.detectChanges();
  }

  public show() {
    this.modalFontRef.open();
  }

  public hideModal() {
    this.modalFontRef.hide();
  }

  close() {
    this.hideModal();
    this.onClose.emit({});
  }
  
  showModalAddGoogle(){
    const modalFontGoogleRef = this.componentFactoryResolver.resolveComponentFactory(MoWbFontAddGoogleComponent).create(this.injector);
    modalFontGoogleRef.instance.zIndex = this.zIndex;
    modalFontGoogleRef.instance.refreshFontList.subscribe((event)=> {
      this.getList.emit({});
    })
    modalFontGoogleRef.instance.onClose.subscribe((event) => {
          setTimeout(() => {
            this._domService.removeComponentFromBody(modalFontGoogleRef);
          }, 500);
        });
    this._domService.addDomToBody(modalFontGoogleRef);
  }

  showModalAddMyFont(){
    const modalFontMyRef = this.componentFactoryResolver.resolveComponentFactory(MoWbFontAddCustomComponent).create(this.injector);
    modalFontMyRef.instance.zIndex = this.zIndex;
    modalFontMyRef.instance.refreshFontList.subscribe((event)=> {
      this.getList.emit({});
    })
    modalFontMyRef.instance.onClose.subscribe((event) => {
          setTimeout(() => {
            this._domService.removeComponentFromBody(modalFontMyRef);
          }, 500);
        });
    this._domService.addDomToBody(modalFontMyRef);
  }
  
  handleContinueFont(){
    this.close();
    if(this.typeFont==='GOOGLE'){
      this.showModalAddGoogle();
    }else{
      this.showModalAddMyFont();
    }
  }

  handleOnCancelModal() {
    this.close();
  }

  handleOnCloseModal() {
    this.hideModal();
    this.onClose.emit({});
  }
  handleOnSelectItem(event:any, name: string) {
    name==='MY'? this.typeFont='MY' : this.typeFont='GOOGLE'
  }

  ngOnDestroy(): void {
  }
}
