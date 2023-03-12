import { Component, OnInit, ChangeDetectorRef, ViewRef, EventEmitter, Input,
   ChangeDetectionStrategy, Output, ElementRef } from '@angular/core';
import { IUnit } from 'src/app/utils/unitUtil';
import { MoWbDetectionComponent } from '../../../detection.component';

@Component({
  selector: 'mo-wb-components-input_number-unit_dropdown',
  templateUrl: './unit-dropdown.component.html',
  styleUrls: ['./unit-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputNumberUnitDropdownComponent extends MoWbDetectionComponent {

  top: number = 0;
  left: number = 0;

  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() zIndex: number = 2500;
  @Input() classInclude: string;
  @Input() units: any[] = [];
  @Input() isShow: boolean = false;
  @Input() selectedKey: string = '';

  
  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectItem = new EventEmitter<any>();

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  show(target: ElementRef) {
    const targetRect = target.nativeElement.getBoundingClientRect();
    // this.height = this.getHeight();
    this.top = Math.min(window.innerHeight - this.height - 10, targetRect.top + 30) ;
    this.left = targetRect.left + targetRect.width - this.width + 2;
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

  /**
   * handle unit item select
   * @param e 
   * @param item 
   */
  handleOnUnitItemSelect(e: any, item: IUnit) {
    e.stopPropagation();
    if (item.key === this.selectedKey) {
      return;
    }
    this.onSelectItem.emit(item);
    this.close();
  }

}
