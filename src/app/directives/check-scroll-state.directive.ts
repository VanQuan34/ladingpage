/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgModule, AfterViewInit, Directive, ElementRef, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Directive({
  selector: '[MoWbDirectivesCheckScrollState]'
})
export class MoWbDirectivesCheckScrollStateDirective implements AfterViewInit, OnDestroy {
  private hasScrollHeight: boolean;
  private hasScrollWidth: boolean;
  private timeOut: any;

  @Input() emitWhenNotScrollToScroll: boolean;
  @Input() paddingHasScroll: string; // padding scroll right
  @Input() paddingNotScroll: string; // padding scroll right
  @Input() paddingBottomHasScroll: string;
  @Input() paddingBottomNotScroll: string;
  @Input('keyFetchCheckUI') set keyFetchCheckUI(keyFetchCheckUI: string) {
    keyFetchCheckUI;
    this.checkViewPortScroll();
  }

  @Output() moCheckScrollStateEvent = new EventEmitter();

  constructor(
    private elementRef: ElementRef) {
    this.hasScrollHeight = false;
    this.hasScrollWidth = false;
    this.paddingHasScroll = '4px';
    this.paddingNotScroll = '12px';
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.style.paddingRight = this.paddingNotScroll;
  }

  private checkViewPortScroll() {

    this.timeOut = setTimeout(() => {
      this.checkScrollHeight(this.hasScrollHeight);
      this.checkScrollWidth(this.hasScrollWidth);
    }, 100);
  }

  private checkScrollHeight(preScroll: boolean) {
    const nativeEl = this.elementRef.nativeElement;

    this.hasScrollHeight = false;
    if (nativeEl.offsetHeight < nativeEl.scrollHeight) {
      this.hasScrollHeight = true;
    }
    if (preScroll && !this.hasScrollHeight) {
      this.moCheckScrollStateEvent.next({});
    }

    if (!preScroll && this.hasScrollHeight && this.emitWhenNotScrollToScroll) {
      this.moCheckScrollStateEvent.next({ hasScrollHeight: true });
    }
    if (this.hasScrollHeight) {
      nativeEl.style.paddingRight = this.paddingHasScroll;

      return;
    }
    nativeEl.style.paddingRight = this.paddingNotScroll;
  }

  private checkScrollWidth(preScroll: boolean) {
    const nativeEl = this.elementRef.nativeElement;

    this.hasScrollWidth = false;
    if (nativeEl.offsetWidth < nativeEl.scrollWidth) {
      this.hasScrollWidth = true;
    }
    if (preScroll && !this.hasScrollWidth) {
      this.moCheckScrollStateEvent.next({});
    }

    if (!preScroll && this.hasScrollWidth && this.emitWhenNotScrollToScroll) {
      this.moCheckScrollStateEvent.next({ hasScrollWidth: true });
    }

    if (this.hasScrollWidth) {
      nativeEl.style.paddingBottom = this.paddingBottomHasScroll || 0;

      return;
    }
    nativeEl.style.paddingBottom = this.paddingBottomNotScroll || 0;
  }

  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }
}

@NgModule({
  declarations: [
    MoWbDirectivesCheckScrollStateDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MoWbDirectivesCheckScrollStateDirective
  ]
})
export class MoWbDirectivesCheckScrollStateDirectiveModule { }
