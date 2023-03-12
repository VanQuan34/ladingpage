import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef
} from '@angular/core';
import { AddComponentToBodyService } from '../../../../../../../api/common/add-component-to-body.service';
import { MoLandingEditorInspectorLayoutMenuComponent } from '../menu.component';

interface IMenu {
  id: string;
  title: string;
}

@Component({
  selector: 'mo-wb-landing-editor-inspector-menu-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorMenuIconComponent implements OnInit {

  @Input() classInclude: string = '';
  @Input() menuItemList: IMenu[] = [];

  @ViewChild('menuIcon') menuIconRef: ElementRef;

  @Output() onSelectMenuItem = new EventEmitter<any>();

  constructor(
    public _changeDetection: ChangeDetectorRef,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  
  ngOnDestroy() {

  }

  showMenu() {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoLandingEditorInspectorLayoutMenuComponent).create(this._injector);
    modalRef.instance.menuList = this.menuItemList;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    modalRef.instance.onSelectMenuItem.subscribe((item: any) => {
      this.onSelectMenuItem.emit(item);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(this.menuIconRef);
  }

  handleOnMenuIconClick(e: any) {
    this.showMenu();
  }
  
}
