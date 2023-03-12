import { AddComponentToBodyService } from './../../api/common/add-component-to-body.service';
import {
  Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef,
  SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewRef, ComponentFactoryResolver, Injector
} from '@angular/core';
import { MoWbMenuPageDropdownComponent } from './menu-page/menu-page.component';

@Component({
  selector: 'mo-wb-components-menu_dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoWbMenuDropdownComponent implements OnInit {
  isOver: boolean = false;

  @Input() page: any;
  @Input() isMenuOpen: boolean = false;
  @Input() selectedItemId: any = '';
  @Input() selectedItem: any;
  @Input() listItem: any[] = [];
  @Input() classInclude: string = '';
  @Input() placeholder: string = 'i18n_select_device';
  @Input() width: string = '200px';
  @Input() height: string = '310px';
  @Input() classLabelInclude: string = '';
  @Input() classIconInclude: string = '';
  @Input() customClass: boolean;
  @Input() customIcon: string;
  @Input() type: 'BUTTON' | 'BUTTON-LANDING-PAGE' | 'DROPDOWN' | 'MENU-PAGE' = 'DROPDOWN';

  @Output() onSelectedItemChanged = new EventEmitter<any>();

  @ViewChild('menu') menuRef: ElementRef;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _domService: AddComponentToBodyService,
    ) {
  }

  ngOnInit() {
  }

  detectChanges() {
    if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed) {
      this.changeDetection.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listItem'] || changes['selectedItemId']) {
      this.getSelectedItem();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.selectedItemId) {
        this.getSelectedItem();
      }

      this.menuRef.nativeElement.addEventListener('mouseover', this.handleOnMouseover);
      this.menuRef.nativeElement.addEventListener('mouseout', this.handleOnMouseout);
      document.addEventListener('click', this.handleOnDocumentClick);
    }, 0);
  }

  getSelectedItem = () => {
    if (this.type === 'BUTTON') {
      return;
    }
    this.selectedItem = this.listItem.find((item: any) => {
      if (item.id === this.selectedItemId) {
        return true;
      }
      return false;
    });
    this.detectChanges();
  }


  handleOnMouseover = (e: any) => {
    this.isOver = true;
  }

  handleOnMouseout = (e: any) => {
    this.isOver = false;
  }

  handleOnDocumentClick = (e: any) => {
    if (this.isOver) {
      return;
    }
    this.isMenuOpen = false;
    this.detectChanges();
  }

  handleOnToggleShowMenu(e: any) {
    e.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    this.detectChanges();
  }

  showMenuUnits(targetRef: any = null) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbMenuPageDropdownComponent).create(this._injector);
    modalRef.instance.listSelectOption = this.listItem;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    modalRef.instance.onSelectItem.subscribe((item: any) => {
      this.onSelectedItemChanged.emit(item);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(targetRef || this.menuRef);
  }

  handleOnShowMenu(e: any){
    e.stopPropagation();
   this.showMenuUnits();
    
  }

  handleOnSelectItem(e: any, item: any) {
    this.selectedItemId = item.id;
    this.selectedItem = item;
    this.detectChanges();
    this.onSelectedItemChanged.emit(item);
  }

  ngOnDestroy() {
    this.menuRef.nativeElement.removeEventListener('mouseover', this.handleOnMouseover);
    this.menuRef.nativeElement.removeEventListener('mouseout', this.handleOnMouseout);
    document.removeEventListener('click', this.handleOnDocumentClick);
  }
}
