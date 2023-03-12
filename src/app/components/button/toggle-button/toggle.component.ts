import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IToggleEvent } from '../api/toggle-event';

@Component({
  selector: 'mo-wb-components-button-toggle_button',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class MoWbToggleComponent implements OnInit {
  @Input() disable: boolean;
  @Input() active: boolean;

  @Output() onChangeToggle: EventEmitter<IToggleEvent>;
  constructor() {
    this.onChangeToggle = new EventEmitter();
  }

  ngOnInit() {
  }

  handlerClick(event: Event) {
    event.stopPropagation();
    if (this.disable) {
      return;
    }
    this.setActiveToggle();
    this.onChangeToggle.emit({
      active: this.active,
      revert: () => {this.setActiveToggle();
      }
    });
  }

  private setActiveToggle() {
    this.active = this.active ? false : true;
  }
}
