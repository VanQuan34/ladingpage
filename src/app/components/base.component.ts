import { MoButtonService } from './../api/buttonApi';
import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewRef, Injector } from '@angular/core';
import { AddComponentToBodyService } from '../api/common/add-component-to-body.service';
import { CacheService } from '../api/common/cache.service';
import { ToastTranslateService } from '../api/common/toast-translate.service';
import { MoWbBaseApiService } from '../api/baseApi'; 
import { TranslateService } from '@ngx-translate/core';
import { MoRootManagerService } from '../landing/editor/root.service';

@Component({
  template: "<div></div>",
})
export class MoWbBaseComponent implements OnInit {
  isConfirmOpen: boolean; 
  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    public _changeDetection: ChangeDetectorRef,
    public _cacheService: CacheService,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver,
    public _rootService: MoRootManagerService,
    public _baseApiService: MoWbBaseApiService,
    public _buttonService: MoButtonService
  ) {

  }

  ngOnInit() {
    this.onInit();
  }

  onInit() {

  }

  ngAfterViewInit() {
    this.onAfterInit();
  }

  onAfterInit() {

  };

  detectChanges() {
    try{
      if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
        this._changeDetection.detectChanges();
      }
    } catch(ex) {
      console.log('detectChanges ex=',ex);
    }
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  onDestroy() {

  }

  /**
   * handle on confirm remove 
   */
  handleOnConfirmClose() {
    this.isConfirmOpen = false;
    this.detectChanges();
  }

}
