import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { IColorVar } from '../../../../../../common/common-types';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { css } from 'jquery';
import { Utils } from 'src/app/utils/utils';

interface IShadow {
  hOffset: number,
  vOffset: number,
  blur: number;
  spread: number;
  colorVar: IColorVar;
}

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-shadow',
  templateUrl: './shadow.component.html',
  styleUrls: ['./shadow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsShadowComponent extends MoLandingEditorInspectorBaseComponent {
  @Input() shdVar: string = '--shd';

  isActive: boolean = false;
  shadow: IShadow;

  override width: number = 1;

  override onInit(): void {
    this.initDefaultShadowValue();
  }

  initDefaultShadowValue() {
    const cssVar = '--c13';
    const rgb = GLOBAL.rootStyles[cssVar];
    const color = Utils.rgbToHex(rgb);
    this.shadow = {
      hOffset: 2,
      vOffset: 2,
      blur: 2,
      spread: 1,
      colorVar: {
        cssVar: cssVar,
        rgbColor: rgb,
        color: color,
        alpha: 1
      }
    }
  }

  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    this.isOpen = false;
    const styles = this.getStyle();
    const shd = styles[this.shdVar];
    const arr = shd && shd.split(' ');
    if (!arr || arr.length < 5) {
      this.isActive = false;
      this.detectChanges();
      return;
    }

    this.isActive = true;
    this.initValue(styles);

    this.detectChanges();
  } 

  initValue(styles: any) {
    const shd = styles[this.shdVar];
    const arr = shd && shd.split(' ');
    if (!arr || arr.length < 5) {
      return;
    }
    this.shadow.hOffset = parseFloat(arr[0]);
    this.shadow.vOffset = parseFloat(arr[1]);
    this.shadow.blur = parseFloat(arr[2]);
    this.shadow.spread = parseFloat(arr[3]);
    this.shadow.colorVar = Utils.parseColorVar(arr[4]);
  }

  generateShadow(shadow: IShadow) {
    const shd = `${shadow.hOffset}px ${shadow.vOffset}px ${shadow.blur}px ${shadow.spread}px rgba(${Utils.generateRgbColor(shadow.colorVar)},${shadow.colorVar.alpha})`;
    return shd;
  }

  /**
   * change horizontal distance
   * @param value 
   * @param isInline 
   * @returns 
   */
  changeHorizontalDistance(value: number, isInline: boolean) {
    this.shadow.hOffset= value;
    let shd = this.generateShadow(this.shadow);
    this.detectChanges();
    if (isInline) {
      this.$targetEls.attr('style', `${this.shdVar} : ${shd}`);
      return;
    }
    // set style
    this.setStyle(shd, this.shdVar);
    // delete inline style
    this.deleteInlineStyle();
  }

  /**
   * change vertical offset
   * @param value 
   * @param isInline 
   * @returns 
   */
  changeVerticalDistance(value: number, isInline: boolean) {
    this.shadow.vOffset= value;
    let shd = this.generateShadow(this.shadow);
    this.detectChanges();
    if (isInline) {
      this.$targetEls.attr('style', `${this.shdVar} : ${shd}`);
      return;
    }
    // set style
    this.setStyle(shd, this.shdVar);
    // delete inline style
    this.deleteInlineStyle();
  }

  /**
   * change blur value
   * @param value 
   * @param isInline 
   * @returns 
   */
  changeBlurValue(value: number, isInline: boolean) {
    this.shadow.blur= value;
    let shd = this.generateShadow(this.shadow);
    this.detectChanges();
    if (isInline) {
      this.$targetEls.attr('style', `${this.shdVar} : ${shd}`);
      return;
    }
    // set style
    this.setStyle(shd, this.shdVar);
    // delete inline style
    this.deleteInlineStyle();
  }

  /**
   * change spread value
   * @param value 
   * @param isInline 
   * @returns 
   */
  changeSpreadValue(value: number, isInline: boolean) {
    this.shadow.spread = value;
    let shd = this.generateShadow(this.shadow);
    this.detectChanges();
    if (isInline) {
      this.$targetEls.attr('style', `${this.shdVar} : ${shd}`);
      return;
    }
    // set style
    this.setStyle(shd, this.shdVar);
    // delete inline style
    this.deleteInlineStyle();
  }

  /**
   * change shadow color
   * @param colorVar 
   * @param isInline 
   * @returns 
   */
  changeShadowColor(colorVar: IColorVar, isInline: boolean) {
    if (isInline) {
      const shadow: IShadow = Utils.copyObject(this.shadow);
      shadow.colorVar = colorVar;
      const shd = this.generateShadow(shadow);
      this.$targetEls.attr('style', `${this.shdVar}: ${shd};`);
      return;
    }
    this.shadow.colorVar = colorVar;
    const shd = this.generateShadow(this.shadow);
    // set style
    this.setStyle(shd, this.shdVar);
    // delete inline style
    this.deleteInlineStyle();
    this.deleteInlineStyle();
  }

  /**
   * toggle active shadow
   * @param isActive 
   */
  toggleActiveShadow(isActive: boolean) {
    this.isActive = isActive;
    if (isActive) {
      this.initDefaultShadowValue();
      let shd = this.generateShadow(this.shadow);
      // set style selected comp
      this.setStyles([
        {
          value: shd,
          property: this.shdVar
        }
      ], [], '-1');
      // set box shadow
      this.setStyles([
        {
          value: `var(${this.shdVar})`,
          property: 'box-shadow'
        }
      ], []);
      this.detectChanges();
      return;
    }
    // set selected comp style
    this.setStyles([
      {
        value: 'none',
        property: this.shdVar
      }
    ], [], '-1');

    // remove box shadow
    this.setStyles([], ['box-shadow']);
    this.detectChanges();
  }

  handleOnHorizontalDistanceChange(value: number) {
    this.changeHorizontalDistance(value, true);
  }

  handleOnInputHorizontalDistanceSliderValueChanged(value: number) {
    this.changeHorizontalDistance(value, false);
  }

  handleOnVerticalDistanceChange(value: number) {
    this.changeVerticalDistance(value, false);
  }

  handleOnInputVerticalDistanceSliderValueChanged(value: number) {
    this.changeVerticalDistance(value, true);
  }

  handleOnSizeChange(value: number) {
    this.changeSpreadValue(value, false);
  }

  handleOnInputSizeSliderValueChanged(value: number) {
    this.changeSpreadValue(value, true);
  }

  handleOnBlurChange(value: number) {
    this.changeBlurValue(value, false);
  }

  handleOnInputBlurSliderValueChanged(value: number) {
    this.changeBlurValue(value, true);
  }

  handleOnSelectColor(color: IColorVar){
    this.changeShadowColor(color, false);
  }

  handleOnOverColor(color: IColorVar) {
    this.changeShadowColor(color, true);
  }

  handleOnCancelColor(event: any) {
    this.deleteInlineStyle();
  }

  handleOnActiveToggle(event: any) {
    this.toggleActiveShadow(event.active)
  }
  
}
