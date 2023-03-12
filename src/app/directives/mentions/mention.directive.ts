/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentRef, Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, TemplateRef, AfterViewInit } from "@angular/core";

import { MoWbsSharedComponentsMentionsListComponent } from "./list/list.component";
import { buildTemplate, DEFAULT_CONFIG } from "./defines/template.define";
import { v4 as uuid } from 'uuid';
import { getCaretPosition, getValue, getWindowSelection, insertValue, setCaretPosition } from "./defines/utils.define";
import { IMentionsConfig, INodeInsert } from "./interfaces/mention-config.interface";
import { Subject } from "rxjs";
import { Observable } from 'rxjs/Rx';
import { IEvent } from "../../components/tab/interfaces/tab.interface";
import { isNil } from "lodash";
import { AddComponentToBodyService } from '../../api/common/add-component-to-body.service';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_SHIFT = 16;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_BUFFERED = 229;

/**
 * Angular Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mention], [mentionConfig]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    // '(keydown)': 'handlerKeydown($event)',
    // '(input)': 'handlerInput($event)',
    // '(blur)': 'handlerBlur($event)',
    // '(click)': 'handlerFocus($event)',
    // '(paste)': 'handlerPaste($event)',
    // 'autocomplete': 'off'
  }
})
export class MoWbsSharedComponentsMentionsDirective implements OnChanges, OnDestroy, AfterViewInit {
  // stores the items passed to the mentions directive and used to populate the root items in mentionConfig
  private onDestroy: Subject<void> = new Subject<void>();
  private listComponentRef: ComponentRef<MoWbsSharedComponentsMentionsListComponent> | undefined;
  private mentionItems: any[];
  private nodesInsert: Set<INodeInsert>;
  private activeConfig: IMentionsConfig | null;
  private isEditor: boolean;

  @Input() set mention(items: any[]) {
    this.mentionItems = items;
  }
  @Input() mentionConfig: IMentionsConfig = { items: [] };

  // template to use for rendering list items
  @Input() mentionListTemplate: TemplateRef<any>;

  @Output() searchTerm = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<any>();
  @Output() moOpened = new EventEmitter();
  @Output() moClosed = new EventEmitter();

  private triggerChars: { [key: string]: IMentionsConfig } = {};
  private searchString: any;
  private startPos: any;
  private startNode: any;
  private searchList: MoWbsSharedComponentsMentionsListComponent;
  private searching: any;
  private iframe: any; // optional
  private lastKeyCode: any;

  constructor(
    private element: ElementRef,
    private addComponentService: AddComponentToBodyService
  ) {
    this.nodesInsert = new Set();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mention'] || changes['mentionConfig']) {
      this.updateConfig();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const isContentEditable = this.element.nativeElement.getAttribute('contenteditable');
      if (isContentEditable) {
        this.isEditor = false;
      } else {
        this.isEditor = true;
      }
      const element = !this.isEditor ? this.element.nativeElement : this.element.nativeElement.querySelector('.ql-editor[contenteditable="true"]');
      element.addEventListener('keydown', (event) => {
        this.handlerKeydown.bind(this)(event, element)
      });
      element.addEventListener('input', (event) => {
        this.handlerInput.bind(this)(event, element)
      });
      element.addEventListener('blur', (event) => {
        this.handlerBlur.bind(this)(event, element)
      });
      element.addEventListener('click', (event) => {
        this.handlerFocus.bind(this)(event, element)
      })
    })
  }

  public updateConfig() {
    const config = this.mentionConfig;

    this.triggerChars = {};
    if (this.mentionItems) {
      config.items = this.mentionItems;
    }
    this.addConfig(config);
    if (config.mentions) {
      config.mentions.forEach(config => this.addConfig(config));
    }
  }

  private addConfig(config: IMentionsConfig) {
    const defaults = Object.assign({}, DEFAULT_CONFIG);

    config = Object.assign(defaults, config);
    if (config.items && config.items.length > 0) {
      if (typeof config.items[0] === 'string') {
        config.items.forEach((label) => {
          const object: any = {};

          object[config.labelKey || 'label'] = label;

          return object;
        });
      }
      if (config.labelKey) {
        // remove items without an labelKey (as it's required to filter the list)
        config.items = config.items.filter(e => e[config.labelKey || 'label']);
        if (!config.disableSort) {
          config.items.sort((a, b) => a[config.labelKey || 'label'].localeCompare(b[config.labelKey || 'label']));
        }
      }
    }
    this.triggerChars[config.triggerChar || '@'] = config;
    if (this.activeConfig && this.activeConfig.triggerChar == config.triggerChar) {
      this.activeConfig = config;
      this.updateSearchList();
    }
  }

  setIframe(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  private stopEvent(event: any) {
    //if (event instanceof KeyboardEvent) { // does not work for iframe
    if (event.wasClick) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  private handlerPaste(e: IEvent) {
    console.log(e.clipboardData.files || e.dataTransfer.files);
  }

  handlerBlur(event: any) {
    setTimeout(() => {
      this.stopEvent(event);
      this.stopSearch();
    }, 100);
  }

  handlerInput(event: any, nativeElement: HTMLInputElement = this.element.nativeElement) {
    if (this.lastKeyCode === KEY_BUFFERED && event.data) {
      const keyCode = event.data.charCodeAt(0);

      this.handlerKeydown({ keyCode, inputEvent: true }, nativeElement);
    }
  }

  // @param nativeElement is the alternative text element in an iframe scenario
  handlerKeydown(event: any, nativeElement: HTMLInputElement = this.element.nativeElement): any {
    console.log(event);

    this.lastKeyCode = event.keyCode;
    if (event.isComposing || event.keyCode === KEY_BUFFERED) {
      return;
    }

    const val: any = getValue(nativeElement);
    let pos: any = getCaretPosition(nativeElement, this.iframe);
    let charPressed = event.key;

    if (event.keyCode === KEY_BACKSPACE) {
      this.appendEmptyToLastNode(pos, val.length, nativeElement);
    }

    setTimeout(() => {
      this.addNodeZeroWidthSpace(nativeElement);
    }, 0);

    if (!charPressed) {
      const charCode = event.which || event.keyCode;

      charPressed = String.fromCharCode(event.which || event.keyCode);
      if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
        charPressed = String.fromCharCode(charCode + 32);
      }
    }

    if (event.keyCode == KEY_ENTER && event.wasClick && pos < this.startPos) {
      // put caret back in position prior to contenteditable menu click
      pos = this.startNode.length;
      setCaretPosition(this.startNode, pos, this.iframe);
    }
    const config = this.triggerChars[charPressed];
    if (config) {
      this.activeConfig = config;
      this.startPos = event.inputEvent ? pos - 1 : pos;
      this.startNode = getWindowSelection(this.iframe).anchorNode;
      this.searching = true;
      this.searchString = '';
      this.showSearchList(nativeElement);
      this.updateSearchList();
      if (config.returnTrigger) {
        this.searchTerm.emit(config.triggerChar);
      }

      return;
    }
    setTimeout(() => {
      for (const itemSet of Array.from(this.nodesInsert)) {
        if (!nativeElement.contains(itemSet.elementSpan)) {
          itemSet.subscription.unsubscribe();
          this.nodesInsert.delete(itemSet);
        }
      }
    });
    if (this.startPos < 0 || !this.searching) {
      return;
    }
    if (pos <= this.startPos) {
      this.searchList.hidden = true;
      this.moClosed.emit();
      return;
    }
    // ignore shift when pressed alone, but not when used with another key
    if (event.keyCode === KEY_SHIFT || event.metaKey || event.altKey || event.ctrlKey || pos <= this.startPos) {
      return;
    }
    if (!this.activeConfig.allowSpace && event.keyCode === KEY_SPACE) {
      this.startPos = -1;
    } else if (event.keyCode === KEY_BACKSPACE && pos > 0) {
      pos--;
      if (pos == this.startPos) {
        this.stopSearch();
      }
    }
    else if (this.searchList && this.searchList.hidden) {
      if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
        this.stopSearch();

        return;
      }
    }
    else if (this.searchList && !this.searchList.hidden && this.activeConfig) {
      if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
        this.stopEvent(event);
        // emit the selected list item
        this.itemSelected.emit(this.searchList.ActiveItem);
        // optional function to format the selected item before inserting the text
        let text = '';
        const feId = uuid();
        const id = this.searchList.ActiveItem ? this.searchList.ActiveItem.id : uuid();
        const itemActive = this.searchList.ActiveItem;
        const { triggerChar, mentionEventName, mentionActionByEvent } = this.activeConfig;

        if (this.activeConfig.mentionSelect) {
          text = this.activeConfig.mentionSelect(this.searchList.ActiveItem, this.activeConfig.triggerChar);
        }
        let span: HTMLSpanElement = document.createElement('TEXTAREA');
        span.innerText = text;
        text = span.innerHTML;
        span.remove();
        text = buildTemplate(text, id, feId, '#333333');
        span = insertValue(nativeElement, this.startPos, pos, text, this.iframe) as HTMLSpanElement;
        if (span) {
          const data: INodeInsert = {
            elementSpan: span,
            subscription: undefined,
            item: itemActive,
            triggerChar: triggerChar,
            manualAdd: true
          };

          this.nodesInsert.add(data);
          mentionEventName && (data.subscription = Observable.fromEvent<IEvent>(span, mentionEventName).do(e => e.stopPropagation()).takeUntil(this.onDestroy.asObservable()).subscribe(() => {
            mentionActionByEvent && mentionActionByEvent(itemActive, triggerChar);
          }));
        }

        // fire input event so angular bindings are updated
        if ("createEvent" in document) {
          const evt = document.createEvent("HTMLEvents");

          // this seems backwards, but fire the event from this elements nativeElement (not the
          // one provided that may be in an iframe, as it won't be propogate)
          this.iframe ? evt.initEvent("change", true, false) : evt.initEvent("input", true, false);
          nativeElement.dispatchEvent(evt);
        }
        this.startPos = -1;
        this.stopSearch();

        return false;
      }

      if (event.keyCode === KEY_ESCAPE) {
        this.stopEvent(event);
        this.stopSearch();

        return false;
      }
      if (event.keyCode === KEY_DOWN) {
        this.stopEvent(event);
        // this.searchList.activateNextItem();

        return false;
      }
      if (event.keyCode === KEY_UP) {
        this.stopEvent(event);
        // this.searchList.activatePreviousItem();

        return false;
      }
    }

    if (charPressed.length != 1 && event.keyCode != KEY_BACKSPACE) {
      this.stopEvent(event);

      return false;
    }
    if (!this.searching) {
      return;
    }
    let mention = val.substring(this.startPos + 1, pos);

    if (event.keyCode !== KEY_BACKSPACE && !event.inputEvent) {
      mention += charPressed;
    }
    const searchString = mention.replace(String.fromCharCode(160), ' ').replace(String.fromCharCode(0), '');


    this.searchString = searchString.trim();
    if (this.activeConfig.limitSpaceSearchQuery && (searchString.split(' ').length - 1) > this.activeConfig.limitSpaceSearchQuery) {
      this.searchString = null;
    }
    if (this.activeConfig.returnTrigger) {
      const triggerChar = (this.searchString || event.keyCode === KEY_BACKSPACE) ? val.substring(this.startPos, this.startPos + 1) : '';

      this.searchTerm.emit(triggerChar + this.searchString);
      this.updateSearchList();

      return;
    }
    this.searchTerm.emit(this.searchString);
    this.updateSearchList();
  }

  handlerFocus(e: Event, nativeElement: HTMLInputElement = this.element.nativeElement) {
    e.stopPropagation();
    setTimeout(() => {
      let node = document.getSelection().anchorNode;
      if (node.nodeType !== 3) {
        this.stopSearch();
        return;
      }
      if (node.nodeType === 3 && node.parentNode) {
        const parentNode = node.parentNode;
      }
      let previousNode = node.previousSibling ? node.previousSibling : node.parentNode.previousSibling;
      let textAnchor = node.textContent;
      let countTextPrevious = 0;
      if (previousNode && previousNode !== nativeElement) {
        do {
          countTextPrevious = countTextPrevious + previousNode.textContent.length;
          previousNode = previousNode.previousSibling ? previousNode.previousSibling : previousNode.parentNode.previousSibling;
        } while (previousNode && previousNode !== nativeElement)
      }
      const pos: any = getCaretPosition(nativeElement, this.iframe);
      const indexCursorInAnchor = pos - countTextPrevious;
      const triggerChars = Object.keys(this.triggerChars).map((key: string) => {
        return {
          key: key,
          config: this.triggerChars[key],
          index: textAnchor.substring(0, indexCursorInAnchor).lastIndexOf(key) as number
        };
      });
      const matchingCharacters = triggerChars.reduce((pre, current) => pre && current && current.index > pre.index ? current : pre);
      if (matchingCharacters.index < 0) {
        this.stopSearch();
        return;
      }
      const search = textAnchor.substring(matchingCharacters.index, indexCursorInAnchor);
      if (!search) {
        this.stopSearch();
        return;
      }
      this.activeConfig = matchingCharacters.config;
      this.startPos = matchingCharacters.index + countTextPrevious;
      this.searchString = search.replace(matchingCharacters.key, '');
      this.searching = true;
      this.handlerKeydown({ keyCode: ''.charCodeAt(0), inputEvent: false }, nativeElement);
      const divElement = document.createElement("div");

      divElement.style.width = 'max-content';
      divElement.innerText = search;
      document.body.appendChild(divElement);
      this.searchList && this.searchList.position(nativeElement, this.iframe, divElement.getBoundingClientRect().width);
      divElement.remove();
      nativeElement.normalize();
    });
  }

  private stopSearch() {
    if (this.searchList && !this.searchList.hidden) {
      this.searchList.hidden = true;
      this.moClosed.emit();
    }
    this.activeConfig = null;
    this.searching = false;
  }

  private updateSearchList() {
    let matches: any[] = [];

    // disabling the search relies on the async operation to do the filtering
    if (this.activeConfig && this.activeConfig.items && !this.activeConfig.disableSearch && !isNil(this.searchString) && this.activeConfig.labelKey && this.activeConfig.mentionFilter) {
      matches.push(...this.activeConfig.mentionFilter(this.searchString, this.activeConfig.items) as any);
    }
    // update the search list
    if (!this.searchList) {
      return;
    }
    if (this.activeConfig.maxItems > 0) {
      matches = matches.slice(0, this.activeConfig.maxItems);
    }
    this.searchList.items = matches;
    this.searchList.hidden = !matches.length;
    this.searchList.activeIndex = 0;
    if (matches.length) {
      this.moOpened.emit();
    } else {
      this.moClosed.emit();
    }
  }

  private showSearchList(nativeElement: HTMLInputElement) {
    this.moOpened.emit();
    if (!this.listComponentRef) {
      this.listComponentRef = this.addComponentService.resolveComponentFactory(MoWbsSharedComponentsMentionsListComponent);
      this.searchList = this.listComponentRef.instance;
      this.searchList.itemTemplate = this.mentionListTemplate;
      this.listComponentRef.instance.itemClick.subscribe(() => {
        nativeElement.focus();
        const fakeKeydown = { key: 'Enter', keyCode: KEY_ENTER, wasClick: true };

        this.handlerKeydown(fakeKeydown, nativeElement);
      });
    }
    this.searchList.labelKey = this.activeConfig.labelKey || '';
    this.searchList.styleOff = this.mentionConfig.disableStyle || false;
    this.searchList.activeIndex = 0;
    this.searchList.parentHandlerKeyDown = this.handlerKeydown.bind(this);
    this.searchList.position(nativeElement, this.iframe);
    this.listComponentRef && this.addComponentService.addDomToBody(this.listComponentRef);
  }

  private destroyListSearch() {
    this.addComponentService.removeComponentFromBody(this.listComponentRef);
    this.listComponentRef = undefined;
  }

  appendEmptyToLastNode(position: number, length: number, nativeElement: HTMLInputElement = this.element.nativeElement) {
    const empty = document.createTextNode('\u00A0');
    const selection = getWindowSelection(this.iframe);
    const anchorNode = selection.anchorNode;
    let preNode = null;
    const anchorOffset = selection.anchorOffset;

    if (!anchorNode || !anchorOffset) {
      return;
    }

    if (anchorNode.nodeName.toLowerCase() !== '#text') {
      nativeElement.appendChild(empty);

      return;
    }

    for (let i = 0; i < nativeElement.childNodes.length; i++) {
      const node = nativeElement.childNodes[i];

      if (anchorNode.nodeType === 3 && anchorNode === node && preNode && preNode.getAttribute && preNode.getAttribute('id') && (!anchorNode.textContent.length || anchorNode.textContent.length === 1) && position === length) {
        nativeElement.appendChild(empty);
        break;
      }
      preNode = node;
    }
  }

  addNodeZeroWidthSpace(nativeElement: HTMLInputElement = this.element.nativeElement) {
    let preNode = null;

    for (let i = 0; i < nativeElement.childNodes.length; i++) {
      const node: any = nativeElement.childNodes[i];

      if (preNode && preNode.getAttribute && preNode.getAttribute('id') && node && node.getAttribute && node.getAttribute('id')) {
        const empty = document.createTextNode('\u200b');

        nativeElement.insertBefore(empty, preNode.nextSibling);
      }

      preNode = node;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.destroyListSearch();
  }
}
