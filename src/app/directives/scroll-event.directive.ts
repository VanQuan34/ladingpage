import { NgModule, AfterViewInit, Directive, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Observable } from 'rxjs';
// import { ISubscription } from 'rxjs/Subscription';

@Directive({
  selector: 'MoWbScrollEvent, [MoWbScrollEvent]'
})
export class MoWbScrollEventDirective implements AfterViewInit, OnDestroy {
  // private subscription: ISubscription;
  private isDestroy: boolean;
  @Output() onScroll = new EventEmitter();
  @Output() onScrollTop = new EventEmitter();
  @Output() onScrollBottom = new EventEmitter();

  constructor(private _elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    // this.subscription = Observable.fromEvent(this._elementRef.nativeElement, 'scroll').do((event: Event) => (event.preventDefault())).takeWhile(() => !this.isDestroy).subscribe((event: any) => {
    //   const target = event.target;
    //   if (target.scrollLeft + target.offsetWidth >= target.scrollWidth) {
    //     target.scrollLeft = target.scrollWidth - target.offsetWidth - (target.offsetWidth - target.clientWidth);
    //   }
    //   this.onScroll.emit(event);
    //   if (event.target.scrollTop === 0) {
    //     return this.onScrollTop.next(event);
    //   }
    //   if (event.target.scrollHeight <= event.target.scrollTop + event.target.offsetHeight + 3) {
    //     return this.onScrollBottom.next(event);
    //   }
    // });
  }

  ngOnDestroy() {
    // this.subscription && this.subscription.unsubscribe();
    this.isDestroy = true;
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MoWbScrollEventDirective
  ],
  declarations: [
    MoWbScrollEventDirective
  ]
})
export class MoWbScrollEventDirectiveModule { }
