/* eslint-disable @typescript-eslint/no-explicit-any */
/* From: https://github.com/component/textarea-caret-position */

import { isNil } from "lodash";

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
const properties = [
  'direction', // RTL support
  'boxSizing',
  'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY', // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration', // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

const isBrowser = (typeof window !== 'undefined');
const isFirefox = (isBrowser && (window as any)['mozInnerScreenX'] != null);

export const getCaretCoordinates = (element: any, position: number | null) => {
  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  // The mirror div will replicate the textarea's style
  const div: HTMLDivElement = document.createElement('div');

  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle; // currentStyle for IE < 9
  const isInput = element.nodeName === 'INPUT';

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (!isInput) { style.wordWrap = 'break-word' } // only for textarea-s

  // Position off-screen
  style.position = 'absolute'; // required to return coordinates properly

  // Transfer the element's properties to the div
  properties.forEach((prop: any) => {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      if (computed.boxSizing !== "border-box") {
        style.lineHeight = computed.height;

        return;
      }
      const height = parseInt(computed.height);
      const outerHeight = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom) + parseInt(computed.borderTopWidth) + parseInt(computed.borderBottomWidth);
      const targetHeight = outerHeight + parseInt(computed.lineHeight);

      if (height > targetHeight) {
        style.lineHeight = height - outerHeight + "px";

        return;
      }
      if (height === targetHeight) {
        style.lineHeight = computed.lineHeight;

        return;
      }
      style.lineHeight = '0';

      return;
    }
    style[prop] = computed[prop];

  });

  if (!isFirefox) {
    style.overflow = 'hidden';
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
  }
  if (isFirefox && element.scrollHeight > parseInt(computed.height)) { style.overflowY = 'scroll' }
  div.textContent = element.value.substring(0, position);
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput && !isNil(div.textContent)) {
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');
  }
  const span = document.createElement('span');

  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.'; // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  document.body.removeChild(div);

  return coordinates;
};
