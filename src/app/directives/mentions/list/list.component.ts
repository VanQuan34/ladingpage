/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, TemplateRef, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { DOMAIN_GET_SOURCES_STATIC } from "../../../common/define/host-domain.define";
import { getCaretCoordinates } from "../defines/caret-coords.define";
import { getContentEditableCaretCoords, isInputOrTextAreaElement } from "../defines/utils.define";
import { IMentionsConfigItemData } from "../interfaces/mention-config.interface";
@Component({
  selector: 'mo-wbs-shared-components-mentions-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MoWbsSharedComponentsMentionsListComponent {
  public items: Array<IMentionsConfigItemData>;
  public activeIndex: number;
  public hidden: boolean;
  public dropUp: boolean;
  public styleOff: boolean;
  public parentHandlerKeyDown: (e: any, element: HTMLInputElement) => any;
  private coords: { top: number, left: number, bottom?: number };
  private offset: number;
  private nativeParentElement: HTMLInputElement;
  private readonly KEY_ENTER = 13;
  private start: number;
  private end: number;
  public defaultAvatar: string;


  @Input() labelKey: string;
  @Input() itemTemplate: TemplateRef<any>;
  @Output() itemClick = new EventEmitter();

  @ViewChild('ElementRef') element: ElementRef;

  constructor() {
    this.offset = 0;
    this.coords = { top: 0, left: 0, bottom: 0 };
    this.items = [];
    this.activeIndex = 0;
    this.labelKey = 'label';
    this.defaultAvatar = `${DOMAIN_GET_SOURCES_STATIC()}avatar.png`;
  }

  // lots of confusion here between relative coordinates and containers
  position(nativeParentElement: HTMLInputElement, iframe?: HTMLIFrameElement, leftDiv?: number): void {
    this.nativeParentElement = nativeParentElement;
    if (isInputOrTextAreaElement(nativeParentElement)) {
      // parent elements need to have postition:relative for this to work correctly?
      this.coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart);
      this.coords.top = nativeParentElement.offsetTop + this.coords.top - nativeParentElement.scrollTop;
      this.coords.left = nativeParentElement.offsetLeft + this.coords.left - nativeParentElement.scrollLeft + nativeParentElement.getBoundingClientRect().left;

      // getCretCoordinates() for text/input elements needs an additional offset to position the list correctly
      this.offset = this.getBlockCursorDimensions(nativeParentElement).height;
      this.positionElement();

      return;
    }
    if (iframe) {
      const context: { iframe: HTMLIFrameElement, parent: Element | null } = { iframe: iframe, parent: iframe.offsetParent };

      this.coords = getContentEditableCaretCoords(context);
      this.positionElement();

      return;
    }
    const doc = document.documentElement;
    const scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    // bounding rectangles are relative to view, offsets are relative to container?
    const caretRelativeToView = getContentEditableCaretCoords({ iframe } as any);

    this.coords.top = caretRelativeToView.top - scrollTop;
    this.coords.left = caretRelativeToView.left - scrollLeft - (leftDiv || 0);
    this.coords.bottom = caretRelativeToView.bottom;
    this.positionElement();
  }

  get ActiveItem() {
    return this.items[this.activeIndex];
  }

  handlerClick(e: any, index: number) {
    e.stopPropagation();
    this.activeIndex = index;
    e.keyCode = this.KEY_ENTER;

    this.parentHandlerKeyDown(e, this.nativeParentElement);
  }

  activateNextItem() {
    this.activeIndex = this.items.length - 1 > this.activeIndex ? this.activeIndex + 1 : this.activeIndex;
  }

  activatePreviousItem() {
    this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : this.activeIndex;
  }

  private positionElement(left: number = this.coords.left, top: number = this.coords.top, dropUp: boolean = this.dropUp, bottom: number = this.coords.bottom) {
    const el = this.element.nativeElement;

    top += dropUp ? 0 : this.offset; // top of list is next line
    el.style.position = "absolute";
    el.style.left = left + 'px';
    el.style.top = bottom !== -1 ? 'auto' : top + 'px';
    el.style.bottom = bottom === -1 ? 'auto' : bottom + 'px';
  }

  private getBlockCursorDimensions(nativeParentElement: HTMLInputElement) {
    const parentStyles = window.getComputedStyle(nativeParentElement);

    return {
      height: parseFloat(parentStyles.lineHeight),
      width: parseFloat(parentStyles.fontSize)
    };
  }

  handleActiveItem(event, index) {
    event.stopPropagation();
    this.activeIndex = index;
  }
}
