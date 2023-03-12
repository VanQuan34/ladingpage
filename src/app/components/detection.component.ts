
import { Component, OnInit, ChangeDetectorRef, ViewRef } from '@angular/core';
@Component({
  template: "<div></div>",
})
export class MoWbDetectionComponent implements OnInit {
  
  constructor(
    public _changeDetection: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  detectChanges() {
    if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
      this._changeDetection.detectChanges();
    }
  }

  ngOnDestroy() {

  }


}
