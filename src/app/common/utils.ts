
import html2canvas from 'html2canvas';
//import { DefaultConfig, DefaultTemplate, BlocksData, Blocks } from '../popup/config';
import * as $ from 'jquery';
import domtoimage from 'dom-to-image';

const isEmpty = (obj: any) => {
  if (!obj || (Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype)) {
    return true;
  }
  return false;
}

const dataURLToFile = (dataUrl: string, fileName: string) => {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

const captureToImage = async (onSuccess: any, body: any, popupSize: any) => {
  const div = document.createElement('div');
  div.innerHTML = body.innerHTML;
  div.style.position = 'absolute';
  $(div).css('z-index',1000);
  div.style['top'] = '0px';
  div.style['left'] = '0px';
  div.style['width'] = `${popupSize.desktop.width + 40}px`;
  // div.style['height'] = `${popupSize.ch}px`;
  document.body.appendChild(div);
  cleanDataHTML(div);
  // set font family
  $(div).find('p').each(function (index: number) {
    const $el = $(this);
    const $parent = $el.parent();
    const fontFamily = $parent.css('font-family');
    fontFamily && $el.css('font-family', fontFamily);
  });
  // remmove selected class
  $(div).find('[mo-type]').removeClass('mo-comp-selected').removeClass('mo-child').removeClass('mo-child-selected');
  domtoimage.toJpeg(div, { quality: 1, bgcolor: '#ffffff' })
    .then((dataUrl: any) => {
      // console.log('dom', div, dataUrl)
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dataUrl;
      img.addEventListener('load', function () {
        const cvs = document.createElement('canvas');
        const width = popupSize.desktop.width + 40;
        const height = popupSize.desktop.height + 40;
        cvs.width = width;
        cvs.height = height;
        const context = cvs.getContext('2d');
        context.drawImage(img, 0, popupSize.top - 20, width, height, 0, 0, width, height);
        const imageBase64 = cvs.toDataURL("image/jpeg", 1.0);
        // console.log('imageBase64 = ',imageBase64);
        onSuccess(imageBase64);
      }, false);
      div.remove();
    }).catch(function(error: any) {
      console.log('toJpeg error', error);
      processCaptureScreen(onSuccess, true);
    });
}

const cleanDataHTML = (container: any, html: string = '') => {
  if (!container) {
    container = document.createElement('div');
    container.innerHTML = html;
  }
  $(container).find('[data]').removeAttr('data');
  $(container).find('.mo-widget-form-hori-container').css('display', 'block');
  const textEls = $(container).find('.mo-form-label-text');
  for(let i=0; i < textEls.length; i++) {
    const textEl = textEls.eq(i).get(0);
    textEl.outerHTML = `<c>${textEl.innerHTML}</c>`;
  }
  return container.innerHTML;
}

const processCaptureScreen = (onSuccess: any, isAutoSave: boolean = true) => {
  // const popupIframe = DefaultConfig.popupEditor.Canvas.getFrameEl();
  // const body: any = $(popupIframe).contents().find('body')[0];
  // const popupSize = DefaultConfig.popupEditor.runCommand('get-popup-size');
  // if (!isAutoSave) {
  //   captureToImage(onSuccess, body, popupSize);
  //   return;
  // }
  // html2canvas(body, {
  //   useCORS: true,
  //   logging: false,
  //   backgroundColor: '#ffffff',
  //   x: popupSize.left - 20,
  //   y: popupSize.top - 20,
  //   width: popupSize.width + 40,
  //   height: popupSize.height + 40,
  // }).then((canvas: any) => {
  //   let imageBase64 = canvas.toDataURL("image/jpeg", 1.0);
  //   // console.log('html2 canvas=',imageBase64 );
  //   onSuccess(imageBase64);
  // });
}

const validateYoutubeUrl = (url: string) => {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
}

const youtubeParser = (url: string) => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

const extractColor = (rule: string) => {
  let colors: any[] = [];
  let newRule = rule;
  for (let i = 0; i < 5; i++) {
    let reg = null;
    if (newRule.includes('rgba')) {
      reg = /rgba\([^)]+\)/g;
    } else if (newRule.includes('rgb')) {
      reg = /rgb\([^)]+\)/g;
    } else if (newRule.includes('#')) {
      reg = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
    }
    if (!reg) {
      continue;
    }
    // console.log('reg=',reg);
    const matchColors = newRule.match(reg);
    colors = matchColors && [...colors, ...matchColors];
    newRule = newRule.replace(reg, '');
  }

  return {
    colors: colors || [],
    rule: newRule.trim()
  };
}

const extractRotate = (transform: string) => {
  const reg = /rotate\([^)]+\)/g;
  const rotate = transform.match(reg);
  transform = transform.replace(reg, '');
  return rotate;
}

const extractScale = (transform: string) => {
  const reg = /scale\([^)]+\)/g;
  const scale = transform.match(reg);
  transform = transform.replace(reg, '');
  return scale;
}

const getUrlParam = (name: string, url: string = '') => {
  if (!url) {
    url = window.location.href;
  }
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
  if (!results) {
    return undefined;
  }
  return results[1] || undefined;
},


updateCounterBoxSize = (editor: any, dir: string) => {
  const selectedModel = editor.getSelected();
  const selectedEl = selectedModel.view.el;
  const elePos = editor.Canvas.getElementPos(selectedEl,{});
  const width = elePos.width;
  const height = elePos.height;
  const containerCounterEl = selectedEl.querySelector('.container-counter');
  const columnCounterEl = selectedEl.querySelector('.column-counter');
  const labelCounterEl = selectedEl.querySelector('.label-counter');
  const boxNumber = $(selectedEl).find('.column-counter').length;
  const boxEl = $(selectedEl).find('.box-counter').eq(0);
  
  const paddHori = parseInt($(containerCounterEl).css('padding-left')) 
    + parseInt($(containerCounterEl).css('padding-right')) 
    + boxNumber * parseInt($(columnCounterEl).css('padding-right')) 
    + boxNumber *parseInt($(columnCounterEl).css('padding-left'));

  const paddVertical =  parseInt($(containerCounterEl).css('padding-top')) 
    + parseInt($(containerCounterEl).css('padding-bottom')) 
    + parseInt($(columnCounterEl).css('padding-top')) 
    + parseInt($(columnCounterEl).css('padding-bottom'));

  const widthBox = dir === ('center-bottom' ||  dir === 'center-top') ? height - paddVertical -  parseInt($(labelCounterEl).css('height')) :  (width - paddHori) / boxNumber;
  //const height = paddVertical + widthBox + parseInt($(labelCounterEl).css('height'));
  // console.log('updateCounterBoxSize widthBox=',widthBox, ' height=',height);
  $(selectedEl).find('.box-counter').css({'width': `${widthBox}px`, 'height' : `${widthBox}px`});
  $(selectedEl).css({'height' : `auto`, 'width' : `auto`});

  editor.runCommand('update-resize-pos', {});
  editor.runCommand('update-toolbar-pos', { show: true, el: selectedEl});
}

export {
  isEmpty,
  dataURLToFile,
  processCaptureScreen,
  youtubeParser,
  extractColor,
  extractRotate,
  extractScale,
  getUrlParam,
  cleanDataHTML,
  updateCounterBoxSize
}
