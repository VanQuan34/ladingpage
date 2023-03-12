import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITooltip } from '../tooltip/api/tooltip';
import { ICheckbox } from './api/checkbox';

@Component({
  selector: 'mo-wb-components-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class MoWbCheckBoxComponent implements OnInit {
  @Input() checked: boolean;
  @Input() key: any;
  @Input() label: string;
  @Input() disable: boolean;
  @Input() readonly: boolean;
  @Input() tooltip: ITooltip;
  @Input() classLabelInclude: string;
  @Input() classInclude: string;
  @Input() hasTooltip: boolean;
  @Input() avatar: string;
  @Input() classAvatarInclude: string;
  @Input() bullet: any;
  @Input() clickExactly: boolean;
  @Input() showBorderRed: boolean;

  @Output() onChangeChecked = new EventEmitter<ICheckbox>();
  @Output() onAvatarLoadError = new EventEmitter<any>();

  constructor() {
    this.checked = false;
    this.key = '';
    this.classLabelInclude = 'mo-wb-font-head-4 ';
    this.classInclude = '';
    this.hasTooltip = true;
    this.clickExactly = true;
  }

  ngOnInit() { }

  public handleOnClick(e: Event, clickElementContainer: boolean) {
    e.stopPropagation();
    if (clickElementContainer && this.clickExactly) {
      return;
    }
    this.changeChecked();
  }

  public changeChecked() {
    if (this.readonly || this.disable) {
      return;
    }
    this.checked = (this.checked) ? false : true;
    this.onChangeChecked.emit({ checked: this.checked, key: this.key });
  }

  public setChecked(checked: boolean) {
    this.checked = checked;
  }

  public isChecked() {
    return this.checked;
  }

  public getKey() {
    return this.key;
  }

  handlerAvatarError() {
    this.onAvatarLoadError.emit({});
  }

}
