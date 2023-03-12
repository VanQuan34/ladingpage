import {
  Component, OnInit, ChangeDetectorRef, ViewRef, EventEmitter, Input,
  ChangeDetectionStrategy, Output, ElementRef, Injector, ComponentFactoryResolver
} from '@angular/core';
import {CacheService } from '../../../../../../api/common/cache.service';
import { ToastTranslateService } from '../../../../../../api/common/toast-translate.service';
import { AddComponentToBodyService } from '../../../../../../api/common/add-component-to-body.service';
import { uid } from 'uid';
declare var require: any
var clone = require('clone');



@Component({
  selector: 'mo-wb-landing-editor-inspector-layout-layout-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorLayoutMenuComponent implements OnInit {

  top: number = 0;
  left: number = 0;
  isShow: boolean;
  
  @Input() menuList: any[];

  @Input() width: number = 180;
  @Input() height: number = 300;
  @Input() zIndex: number = 2500;
  @Input() classInclude: string;


  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectMenuItem = new EventEmitter<any>();

  constructor( 
    public _changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    private _cacheService: CacheService,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _componentFactoryResolver: ComponentFactoryResolver) {
    // super(_changeDetection);
    this.menuList = [
      {
        id: 'left',
        title: 'Thêm cột bên trái'
      },
      {
        id: 'right',
        title: 'Thêm cột bên phải'
      },
      {
        id: 'remove',
        title: 'Xoá cột'
      }
    ]
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  show(target: ElementRef) {
    const targetRect = target.nativeElement.getBoundingClientRect();
    //this.height = this.units.length * 34;
    this.top = targetRect.top + 25;
    this.height = 34 * this.menuList.length ;
    this.left = targetRect.left + targetRect.width - this.width;
    this.isShow = true;
    // this.detectChanges();
  }

  close() {
    this.isShow = false;
    // this.detectChanges();
    setTimeout(() => {
      this.onClose.emit();
    }, 50);
  }

  /**
   * handle overlay click
   * @param event 
   */
  handleOnOverlayClick(event: any) {
    this.close();
  }

  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }
  
  /**
   * handle on close button click
   * @param event 
   */
  handleOnCloseClick(event: any) {
    event.stopPropagation();
    this.close();
  }

  handleOnMenuItemClick(item: any) {
    this.onSelectMenuItem.emit(item);
    this.close();
  }

}
