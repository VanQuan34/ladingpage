import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';

import {
  Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, ViewChild
} from '@angular/core';
import { MoWbBaseComponent } from 'src/app/components/base.component';
// import { DomComponent, GLOBAL } from '../editor-wrapper';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';
import { DomComponent } from '../../editor-wrapper';

@Component({
  template: "<div></div>",
})

export class MoLandingEditorCompBaseLinkComponent extends MoWbBaseComponent {

  selectedComp: DomComponent;
  isOpen: boolean;
  moType: string;
  top: number;
  left: number;
  width: number;
  height: number;

  override ngOnInit(){

  }
  override ngAfterViewInit() {
  }
  override ngOnDestroy(){

  }

  setData(){
    
  }

  getData(): any{
    return null;
  }

  agree() {

  }

  
  checkError(): boolean{
    return null;
  }
  
  
}