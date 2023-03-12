import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mo-wb-components-button-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbButtonToggleComponent implements OnInit {

  @Input() label: string;
  @Input() classInclude: string = '';
  @Input() state: 'ON' | 'OFF' = 'ON';
  @Input() textOn: string = 'ON';
  @Input() textOff: string = 'OFF';
  @Input() width: number;

  @Output() onSelectedChange = new EventEmitter<any>();

  constructor(
    private _changeDetection: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  setState(state: 'ON' | 'OFF') {
    this.state = state;
    this._changeDetection.detectChanges();
  }

  handleOnButtonClick(event: any, state: 'ON' | 'OFF') {
    this.state = state;
    this._changeDetection.detectChanges();
    this.onSelectedChange.emit(state);
  }

  ngOnDestroy() {
  }
}
