import { Component, OnInit, ChangeDetectorRef, ViewRef, EventEmitter, Input,
  ChangeDetectionStrategy, Output, ElementRef } from '@angular/core';
import { IUnit } from 'src/app/utils/unitUtil';
import { MoWbDetectionComponent } from '../../../detection.component';

@Component({
 selector: 'mo-wb-components-input_number-minmax',
 templateUrl: './minmax.component.html',
 styleUrls: ['./minmax.component.scss'],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputNumberMinmaxComponent extends MoWbDetectionComponent {

 top: number = 0;
 left: number = 0;

 @Input() width: number = 250;
 @Input() height: number = 200;
 @Input() zIndex: number = 2500;
 @Input() classInclude: string;
 @Input() isShow: boolean = false;
 @Input() min: any;
 @Input() max: any;
 @Input() units:  IUnit[];

 
 @Output() onClose = new EventEmitter<any>();
 @Output() onSelectItem = new EventEmitter<any>();
 @Output() onChangeMinUnit = new EventEmitter<any>();
 @Output() onChangeMaxUnit = new EventEmitter<any>();
 @Output() onChangeMinValue = new EventEmitter<any>();
 @Output() onChangeMaxValue = new EventEmitter<any>();

 override ngOnInit() {
 }

 override ngAfterViewInit() {
 }

 override ngOnDestroy() {
 }

 show(target: ElementRef) {
   const targetRect = target.nativeElement.getBoundingClientRect();
   this.top = targetRect.top - 20;
   this.left = targetRect.left - 20;
   this.isShow = true;
   this.detectChanges();
 }

 close() {
   this.isShow = false;
   this.detectChanges();
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

 handleOnMinUnitChange(unitItem: IUnit) {
  this.onChangeMinUnit.emit(unitItem);
 }

 handleOnMaxUnitChange(unitItem: IUnit) {
  this.onChangeMaxUnit.emit(unitItem);
 }

 handleOnMinValueChange(value: number) {
  this.onChangeMinValue.emit(value);
  this.close();
 }

 handleOnMaxValueChange(value: number) {
  this.onChangeMaxValue.emit(value);
  this.close();
 }


}
