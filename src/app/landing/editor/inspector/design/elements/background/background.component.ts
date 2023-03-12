import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { IColorVar } from '../../../../../../common/common-types';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { IGradient, IGradientItem } from 'src/app/components/color/set/gradient/gradient.component';
import { Utils } from 'src/app/utils/utils';
import { uid } from 'uid';
import { IMenuListItem } from 'src/app/components/menu/menu.component';

interface IBgImage {
  url: string;
}

interface IBgLayer {
  type: 'image' | 'color' | 'gradient',
  gradient?: IGradient;
  color?: IColorVar;
  image?: IBgImage
}
 
@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsBackgroundComponent extends MoLandingEditorInspectorBaseComponent {
  
  bgType: 'image' | 'color' | 'gradient' = 'color';
  bgLayers: IBgLayer[] = [];

  menuItems: IMenuListItem[] = [];
  
  @Input() override isOpen: boolean = true;
  @Input() bgVar: string = '';

  override onInit(): void {
    this.menuItems = [
      {
        id: 'copy',
        name: 'Tạo bản sao',
        icon: 'mo-icn-popup-com'
      },
      {
        id: 'remove',
        name: 'Xoá',
        icon: 'mo-icn-menu-xoa',
        isRemove: true
      }
    ];
  }
 
  override onAfterViewInit() {
    this.setValue();
    this.detectChanges();
  }
 

  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    // get bg var
    this.setBgVar();
    // get style
    const styles = this.getStyle('-1');
    // extract background layers
    this.bgLayers = this.extractBackgroundLayer(styles[this.bgVar]);
    // console.log('setValue bgLayers=', this.bgLayers);
    this.detectChanges();
  }

  /**
   * extract background layer 
   * @param bgStr 
   */
  extractBackgroundLayer(bgStr: string): IBgLayer[] {
    if (!bgStr) {
      return [];
    }
    const bgLayers: IBgLayer[] = []; 
    let bgLayersStr: string[] = bgStr.split('),');

    if (bgLayersStr.length > 1 && bgLayersStr[1].trim().length < 5) {
      bgLayersStr = [bgStr];
    }

    for(let i=0; i < bgLayersStr.length; i++){
      const str: string = `${bgLayersStr[i]}`;
      if (str.includes('url(')) {
        const url = str.split('url(')[1];
        const layer = this.extractImageBackground(url);
        layer && bgLayers.push(layer);
        continue;
      }
      // linear extract
      // console.log('matchArr=',matchArr, ' linear str', str);
      if (str.includes('linear-gradient(')) {
        const linear = str.split('linear-gradient(')[1];
        //console.log('linear=', linear);
        const layer = this.extractGradientBackground(linear, 'line');
        layer && bgLayers.push(layer);
        continue;
      }
      // radial extract
      if (str.includes('radial-gradient(')) {
        const radial = str.split('radial-gradient(')[1];
        //console.log('radial =', radial);
        const layer = this.extractGradientBackground(radial, 'center');
        layer && bgLayers.push(layer);
        continue;
      }
      const layer = this.extractBackgroundColor(str);
      if (layer) {
        bgLayers.push(layer);
      }
    };
    // console.log('bgLayers=', bgLayers);
    return bgLayers;
  }

  /**
   * extract image background
   * @param bgUrl 
   * @param bgLayer 
   */
  extractImageBackground(bgUrl: string): IBgLayer {
    let url = bgUrl.replace('url(', '');
    url = bgUrl.replace(')', '');
    const layer: IBgLayer = {
      type: 'image',
      image: {
        url: url
      }
    }
    return layer;
  }
 
  /**
   * extract gradient background
   * @param bgLinear 
   * @param bgLayer 
   */
  extractGradientBackground(bgGradient: string, type: 'line' | 'center'): IBgLayer {
    // console.log('extractGradientBackground bgGradient=', bgGradient);
    const gradient: IGradient = {
      id: uid(),
      type: type,
      colors: [],
      alpha: 1
    }
    const bgLayer: IBgLayer = {
      type: 'gradient',
      gradient: gradient
    }
    let colorStr ='';
    if (type === 'line') {
      colorStr = bgGradient.replace('linear-gradient(', '');
      //colorStr = colorStr.replace(')', '');
    } else {
      colorStr = bgGradient.replace('radial-gradient(', '');
      //colorStr = colorStr.replace(')', '');
    }
    // console.log('extractGradientBackground colorStr=', colorStr);
    const rgbaReg = /rgba\([^%]+\)/g;
    const rgbaMatch = colorStr.match(rgbaReg);
    // console.log('rgbaMatch=', rgbaMatch);
    for(let i=0; i < rgbaMatch.length; i++) {
      const rgba = rgbaMatch[i];
      // console.log('rgba=', rgba);
      const colorVar = Utils.parseColorVar(rgbaMatch[i]);
      colorStr = colorStr.replace(rgba, '');
      const gradientItem: IGradientItem = {
        id: uid(),
        color: colorVar,
        left: 0,
        percent: 0,
      };
      bgLayer.gradient.colors.push(gradientItem);
    }

    let arr = colorStr.split(',');
    if (arr.length < 3) {
      bgLayer.type = 'color';
      bgLayer.color = bgLayer.gradient.colors.length && bgLayer.gradient.colors[0].color;
    }

    if (type === 'line') {
      bgLayer.gradient.angle = parseInt(arr[0]);
    } else {
      let circleAt = arr[0];
      circleAt = circleAt.replace('circle at','');
      circleAt = circleAt.trim();
      const circlePos = circleAt.split(' ');
      bgLayer.gradient.centerPos = {
        left: 0,
        top: 0
      };
      bgLayer.gradient.centerPos.top = circlePos.length > 1 ? parseInt(circlePos[1]) : 0;
      bgLayer.gradient.centerPos.left = circlePos.length > 0 ? parseInt(circlePos[0]) : 0;
    }

    arr.splice(0,1);
    arr.forEach((percentStr: string, index: number) => {
      if (bgLayer.gradient.colors.length > index) {
        bgLayer.gradient.colors[index].percent = parseInt(percentStr);
      }
    });

    // update alpha
    if (bgLayer.gradient.colors.length) {
      bgLayer.gradient.alpha = bgLayer.gradient.colors[0].color.alpha;
    }
    
    //console.log('extractGradientBackground bgLayer=', bgLayer);
    return bgLayer;
  }

  /**
   * extract background color
   * @param bgColor 
   * @param bgLayer 
   */
  extractBackgroundColor(bgColor: string) {
    let colorVar: IColorVar = null ;
    const bgLayer: IBgLayer = {
      type: 'color'
    }
    // console.log('extractBackgroundColor rgbaMatch = ', rgbaMatch, ' bgColor=',bgColor);
    colorVar = Utils.parseColorVar(bgColor);
    bgLayer.color = colorVar;
    return bgLayer;
  }
 
  /**
   * set background var
   */
  setBgVar() {
    // set bg var regular
    if (this.state === 'REGULAR' && !this.bgVar) {
      this.bgVar = '--bg';
      return;
    }
    // set bg var hover
    if (this.state === 'HOVER' && !this.bgVar) {
      this.bgVar = '--bgh';
    }
  }

  
  /**
   * clear inline style
   */
  clearInlineStyle() {
    this.$targetEls.removeAttr('style');
  }
 
  /**
   * change background
   */
  changeBackground(inlineStyle: boolean){
    const background = this.generateBackground();
    if (inlineStyle) {
      this.$targetEls.attr('style', `${this.bgVar}:${background}`);
      return;
    }
    this.clearInlineStyle();
    // set style for selected comp
    this.setStyle(background, this.bgVar, '-1');
    if (background) {
      this.setStyle(`var(${this.bgVar})`, 'background');
    } else {
      this.setStyles([],['background']);
    }
    this.detectChanges();
  }
  /**
   * generate background
   * @returns 
   */
  generateBackground() {
    let background = '';
    this.bgLayers.forEach((layer: IBgLayer, index: number) => {
      let bgLayer = '';
      switch(layer.type) {
        case 'color':
          bgLayer = Utils.generateBackgroundColor(layer.color, false);
          break;
        case 'gradient':
          bgLayer = Utils.generateGradientBackground(layer.gradient, false);
          break;
        case 'image':
          bgLayer = Utils.generateBackgroundImage(layer.image);
          break;
      }
      
      background = index === 0 ? `${bgLayer}` : `${background},${bgLayer}`;
    }); 
    return background;
  }
 
  /**
   * update gradient color
   * @param gradient 
   * @param layer 
   */
  updateGradientColor(gradient: IGradient, layer: IBgLayer) {
    layer.gradient = Utils.copyGradient(gradient);
    layer.type = 'gradient';
    layer.color = null;
  }

  /**
   * add new background layer
   */
  addNewBgLayer() {
    const cssVar = '--c15';
    const rgb = GLOBAL.rootStyles[cssVar];
    const bgLayer: IBgLayer = {
      type: 'color',
      color: {
        color: Utils.rgbToHex(rgb),
        rgbColor: rgb,
        cssVar: cssVar,
        alpha: 0.5
      }
    }
    // push new bg layer at index 0
    this.bgLayers.splice(0,0, bgLayer);
    // change background style
    this.changeBackground(false);
    this.detectChanges();
  }
 
  /**
   * remove bgLayer item
   * @param layer 
   * @param index 
   */
  removeBgLayerItem(layer: IBgLayer, index: number) {
    this.bgLayers.splice(index, 1);
    // change background style
    this.changeBackground(false);
    this.detectChanges();
  }

  /**
   * copy bgLayer item
   * @param layer 
   */
  copyBgLayerItem(layer: IBgLayer) {
    const newLayer = Utils.copyObject(layer);
    // push new bg layer at index 0
    this.bgLayers.splice(0,0, newLayer);
    // change background style
    this.changeBackground(false);
    this.detectChanges();
  }

  /**
   * handle on background color changed
   * @param colorVar 
   * @param layer 
   */
  handleOnBackgroundColorChanged(colorVar: IColorVar, layer: IBgLayer) {
    layer.color = Utils.copyColor(colorVar);
    layer.type = 'color';
    layer.gradient = null;
    this.changeBackground(true);
  }

  /**
   * handle select background color
   * @param colorVar 
   * @param layer 
   */
  handleOnSelectBackgroundColor(colorVar: IColorVar, layer: IBgLayer) {
    layer.color = Utils.copyColor(colorVar);
    layer.type = 'color';
    layer.gradient = null;
    this.changeBackground(false);
  }

  /**
   * handle gradient color changed
   * @param gradient 
   * @param layer 
   */
  handleOnGradientColorChanged(gradient: IGradient, layer: IBgLayer) {
    this.updateGradientColor(gradient, layer);
    this.changeBackground(true);
  }
  
  /**
   * handle select gradient color
   * @param gradient 
   * @param layer 
   */
  handleOnSelectGradientColor(gradient: IGradient, layer: IBgLayer) {
    this.updateGradientColor(gradient, layer);
    this.changeBackground(false);
  }

  /**
   * handle set color close
   */
  handleOnSetColorClosed() {
    this.clearInlineStyle();
  }

  /**
   * handle on add new bg layer
   * @param e 
   */
  handleOnAddLayerButtonClick(e: MouseEvent){
    this.addNewBgLayer();
  }

  /**
   * handle on select menu item
   * @param menuItem 
   * @param layer 
   * @param index 
   */
  handleOnSelectMenuItem(menuItem: IMenuListItem, layer: IBgLayer, index: number) {
    switch(menuItem.id) {
      case 'remove':
        this.removeBgLayerItem(layer, index); 
        break;
      case 'copy':
        this.copyBgLayerItem(layer);
        break;
      default:
        break;
    }
  }
  
}

export {
  IBgImage
}
