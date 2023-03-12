/* eslint-disable @typescript-eslint/no-explicit-any */
import { PATTERN_INSERT } from "./template.define";

const setValue = (el: HTMLInputElement, value: any) => {
  if (isInputOrTextAreaElement(el)) {
    el.value = value;

    return;
  }
  el.textContent = value;
};

export const getValue = (el: HTMLInputElement) => {
  return isInputOrTextAreaElement(el) ? el.value : el.textContent;
};

export const insertValue = (el: HTMLInputElement, start: number, end: number, text: string, iframe: HTMLIFrameElement, noRecursion: boolean = false): HTMLSpanElement | undefined | null => {
  if (isTextElement(el)) {
    const val: any = getValue(el);

    text = noRecursion ? PATTERN_INSERT : text;

    setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
    setCaretPosition(el, start + text.length, iframe);

    return;
  }
  if (noRecursion) {
    return;
  }

  return insertValueToContentEditable(start, end, text, el);
};

const insertValueToContentEditable = (start: number, end: number, text: string, element: HTMLInputElement): HTMLSpanElement | undefined | null => {
  if (!window.getSelection) {
    return;
  }
  const sel: any = window.getSelection();

  if (!sel.getRangeAt || !sel.rangeCount) {
    return;
  }
  let range: any;

  const anchorNode = sel.anchorNode;

  range = sel.getRangeAt(0);
  let previousNode = anchorNode.previousSibling ? anchorNode.previousSibling : anchorNode.parentNode.previousSibling;
  let countTextPrevious = 0;
  if (previousNode && previousNode !== element) {
    do {
      countTextPrevious = countTextPrevious + previousNode.textContent.length;
      previousNode = previousNode.previousSibling ? previousNode.previousSibling : previousNode.parentNode.previousSibling;
    } while (previousNode && previousNode !== element)
  }
  range.setStart(anchorNode, start - countTextPrevious);
  range.setEnd(anchorNode, end - countTextPrevious);
  range.deleteContents();
  // Range.createContextualFragment() would be useful here but is
  // only relatively recently standardized and is not supported in
  // some browsers (IE9, for one)
  const el = document.createElement("SPAN");

  el.innerHTML = text;
  const frag = document.createDocumentFragment();
  let node: any, lastNode, nodeHandlerEvent;

  while ((node = el.firstChild)) {
    if (node.getAttribute) {
      nodeHandlerEvent = node;
    }

    lastNode = frag.appendChild(node);
  }
  // const empty = document.createTextNode('\uFEFF');
  // lastNode = frag.appendChild(empty);
  range.insertNode(frag);

  // Preserve the selection
  if (lastNode) {
    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  return nodeHandlerEvent;
};

export const isInputOrTextAreaElement = (el: HTMLElement): boolean => {
  return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA');
};

export const isTextElement = (el: HTMLElement): boolean => {
  return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA' || el.nodeName == '#text');
};

export const setCaretPosition = (el: HTMLInputElement, pos: number, iframe: HTMLIFrameElement) => {
  //console.log("setCaretPosition", pos, el, iframe==null);
  if (isInputOrTextAreaElement(el) && el.selectionStart) {
    el.focus();
    el.setSelectionRange(pos, pos);

    return;
  }

  const range: any = getDocument(iframe).createRange();

  range.setStart(el, pos);
  range.collapse(true);
  const sel = getWindowSelection(iframe);

  if (!sel) {
    return;
  }
  sel.removeAllRanges();
  sel.addRange(range);
};

export const getCaretPosition = (el: HTMLInputElement, iframe?: HTMLIFrameElement): any => {
  if (isInputOrTextAreaElement(el)) {
    const val = el.value;

    return val.slice(0, el.selectionStart || undefined).length;
  }
  const selObj = getWindowSelection(iframe); //window.getSelection();

  if (selObj && selObj.rangeCount > 0) {
    const selRange = selObj.getRangeAt(0);
    const preCaretRange = selRange.cloneRange();

    preCaretRange.selectNodeContents(el);
    preCaretRange.setEnd(selRange.endContainer, selRange.endOffset);
    const position = preCaretRange.toString().length;

    return position;
  }
};

// Based on ment.io functions...
//

const getDocument = (iframe?: HTMLIFrameElement) => {
  if (!iframe) {
    return document;
  }

  return iframe.contentWindow.document;
};

export const getWindowSelection = (iframe?: HTMLIFrameElement): Selection | null => {
  if (!iframe) {
    return window.getSelection();
  }

  return iframe.contentWindow && iframe.contentWindow.getSelection ? iframe.contentWindow.getSelection() : null;
};

export const getContentEditableCaretCoords = (ctx: { iframe: HTMLIFrameElement, parent: Element | null }) => {
  const markerTextChar = '\ufeff';
  const markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
  const doc: any = getDocument(ctx.iframe);
  const sel = getWindowSelection(ctx.iframe);

  if (!sel) {
    return {
      left: 0,
      top: 0,
      bottom: 0
    };
  }
  const prevRange = sel.getRangeAt(0);

  // create new range and set postion using prevRange
  const range = doc.createRange();

  range.setStart(sel.anchorNode, prevRange.startOffset);
  range.setEnd(sel.anchorNode, prevRange.startOffset);
  range.collapse(false);

  // Create the marker element containing a single invisible character
  // using DOM methods and insert it at the position in the range
  const markerEl = doc.createElement('span');

  markerEl.id = markerId;
  markerEl.appendChild(doc.createTextNode(markerTextChar));
  range.insertNode(markerEl);
  sel.removeAllRanges();
  sel.addRange(prevRange);

  const coordinates = {
    left: 0,
    top: markerEl.offsetHeight,
    bottom: -1
  };

  localToRelativeCoordinates(ctx, markerEl, coordinates);
  markerEl.parentNode.removeChild(markerEl);
  const widthScreen = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (coordinates.left + 315 > widthScreen) {
    coordinates.left = coordinates.left - 300;
  }
  const heightScreen = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  if (coordinates.top + 190 > heightScreen) {
    coordinates.bottom = heightScreen - coordinates.top + 15;
    coordinates.top = -1;
  }
  return coordinates;
};

const localToRelativeCoordinates = (ctx: { iframe: HTMLIFrameElement, parent: Element | null }, element: Element, coordinates: { top: number; left: number, bottom: number }) => {
  let obj = <HTMLElement>element;
  let iframe = ctx ? ctx.iframe : null;

  while (obj) {
    if (ctx.parent != null && ctx.parent == obj) {
      break;
    }
    coordinates.left += obj.offsetLeft + obj.clientLeft;
    coordinates.top += obj.offsetTop + obj.clientTop;
    obj = <HTMLElement>obj.offsetParent;
    if (!obj && iframe) {
      obj = iframe;
      iframe = null;
    }
  }
  obj = <HTMLElement>element;
  iframe = ctx ? ctx.iframe : null;
  while (obj !== getDocument(undefined).body && obj != null) {
    if (ctx.parent != null && ctx.parent == obj) {
      break;
    }
    if (obj.scrollTop && obj.scrollTop > 0) {
      coordinates.top -= obj.scrollTop;
    }
    if (obj.scrollLeft && obj.scrollLeft > 0) {
      coordinates.left -= obj.scrollLeft;
    }
    obj = <HTMLElement>obj.parentNode;
    if (!obj && iframe) {
      obj = iframe;
      iframe = null;
    }
  }
};
