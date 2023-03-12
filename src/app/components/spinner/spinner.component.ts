import {
  Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Input
} from '@angular/core';

@Component({
  selector: 'mo-wb-components-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class MoWbSpinnerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() width: string;
  @Input() height: string;

  constructor(protected _elementRef: ElementRef) {
    this.width = '100px';
    this.height = '100px';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

}
