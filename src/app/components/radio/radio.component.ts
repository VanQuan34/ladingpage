import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITooltip } from '../tooltip/api/tooltip';

@Component({
  selector: 'mo-wb-components-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class MoWbRadioComponent implements OnInit {
  @Input() active: boolean;
  @Input() key: any;
  @Input() label: string;
  @Input() groups: MoWbRadioComponent[];
  @Input() tooltip: ITooltip;
  @Input() disable: boolean;
  @Input() readonly: boolean;
  @Input() hasTooltip: boolean;
  @Input() classLabelInclude: string;
  @Input() classInclude: string;
  @Input() clickExactly: boolean;
  @Input() disableText: boolean;
  @Input() classRadio: string; // normal:medium
  @Input() classIncludeRadio: string;


  @Output() onActiveChanged = new EventEmitter<any>();

  constructor() {
    this.classLabelInclude = 'mo-wb-font-head-4 ';
    this.classInclude = '';
    this.classRadio = 'normal';
    this.active = false;
    this.hasTooltip = true;
    this.clickExactly = true;
    this.disableText = false
  }

  ngOnInit() {
  }

  public handleOnClick(e: Event, clickElementContainer: boolean) {
    e.stopPropagation();
    if (clickElementContainer && this.clickExactly) {
      return;
    }
    this.changeActive();
  }

  public changeActive() {
    if (this.active || this.readonly || this.disable) {
      return;
    }
    this.setActive(true);
    this.onActiveChanged.emit({ active: this.active, key: this.key });
  }

  public setActive(active: boolean) {
    if (active) {
      if (this.groups) {
        this.groups.forEach((item) => {
          item.setActive(false);
        });
      }
    }
    this.active = active;
  }

  public isChecked() {
    return this.active;
  }

  public getKey() {
    return this.key;
  }

}
